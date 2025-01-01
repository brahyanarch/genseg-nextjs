'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { API_PROJECTS, API_ESCUELA_PROFESIONAL } from "@/config/apiconfig";
import Swal from 'sweetalert2';

/// Interface escuela profesional
interface Escuelas {
  idpe: number;
  nmPE: string;
  idesc: number;
}

export default function ProjectForm() {
  /// Variables importantes
  const [escuelas, setEscuelas] = useState<Escuelas[]>([]);
  const [escuelaProfesional, setEscuelaProfesional] = useState<string>("");
  const [planProyecto, setPlanProyecto] = useState<File | null>(null);
  const { idrol, idsubuni, dni } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [comboboxOpen, setComboboxOpen] = useState(false);

  //// Funciones importantes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPlanProyecto(event.target.files[0]);
    }
  };

  const getAllEscuelas = async () => {
    
    try {
      const response = await fetch(API_ESCUELA_PROFESIONAL);
      if (response.ok) {
        const data = await response.json();
        setEscuelas(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las escuelas profesionales.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al conectar con la API: ${error}`,
        confirmButtonText: 'OK'
      });
    }
  };

  const handleNewProyect = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    if (planProyecto) {
      formData.append("file", planProyecto);
    }
    formData.append("dni", String(dni));
    formData.append("id_rol", String(idrol));
    formData.append("subunidad", String(idsubuni));
    formData.append("idpe", String(escuelaProfesional));

    try {
      const response = await fetch(API_PROJECTS, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const resIdProject = await response.json();
          // Mostrar un SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El Proyecto fue creado correctamente.',
            confirmButtonText: 'OK'
          });
        if (resIdProject.idproj !== undefined) {
          router.push(`${pathname}/${resIdProject.idproj}`);
        }
      } else {
        // Si el servidor no responde correctamente
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el Proyecto.',
          confirmButtonText: 'OK'
        });
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      }
    } catch (error) {
      // Si ocurre un error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al conectar con la API. ${error}`,
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    getAllEscuelas();
  }, []);

  return (
    <div className="flex-1 bg-background py-4 pl-4 text-black dark:text-white">
      <div className="flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <span>Inicio</span> {" > "}
        <span>Proyectos</span> {" > "}
        <span>Insertar</span>
      </div>
      <div className="w-full space-y-6">
        <div className="flex-1 w-[90%] mx-auto flex flex-col justify-between ">
          <div className="w-[100%] flex flex-1 justify-around items-center">
            <div className="flex w-[80%] h-[40%] flex-col justify-between items-start">
              <h1 className="text-2xl font-semibold mb-3">Insertar Proyecto</h1>
              <div className="w-full">
                <label className="text-lg font-medium mb-3 block">
                  Escuela Profesional
                </label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-96 justify-between h-10 border-2 dark:border-gray-300"
                    >
                      {escuelaProfesional
                        ? escuelas.find((esc) => esc.idpe === parseInt(escuelaProfesional))?.nmPE
                        : "Seleccione una opción"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar escuela profesional..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                          {escuelas.map((escuela) => (
                            <CommandItem
                              key={escuela.idpe}
                              value={escuela.idpe.toString()}
                              onSelect={() => {
                                setEscuelaProfesional(
                                  escuela.idpe.toString()
                                );
                                setComboboxOpen(false);
                              }}
                            >
                              {escuela.nmPE}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  escuelaProfesional === escuela.idpe.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

              </div>

              <div>
                <label className="text-lg font-medium my-3 block">
                  Insertar el plan
                </label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="bg-background w-96 h-10 border-2 border-gray-900 rounded-md text-md text-black dark:text-white dark:border-gray-300"
                />
              </div>
            </div>

            <form onSubmit={handleNewProyect} className="flex w-[25%] self-end">
              <Button
                className="bg-blue-500 hover:bg-blue-600 self-end flex-1 w-20 h-14"
                type="submit"
              >
                Crear Proyecto
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
