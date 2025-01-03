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
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";

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
          confirmButtonText: 'OK',
          background: 'bg-gray-800', // Fondo para modo oscuro
          color: 'text-gray-200', // Texto claro
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
          },
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
          confirmButtonText: 'OK',
          background: 'bg-gray-800', // Fondo para modo oscuro
          color: 'text-gray-200', // Texto claro
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
          },
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
  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'proyectos');
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}`},
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "page", label: "Insertar proyecto" },
  ];
  return (
    <div className="flex-1 bg-background py-4 pl-4 text-black dark:text-white">
      <div className="flex gap-4 px-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>
      <div className="w-full flex flex-col items-center space-y-8">
        <div className="w-[80%] max-w-2xl bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
            Insertar Proyecto
          </h1>
          <div className="space-y-4">
            {/* Escuela Profesional */}
            <div className="w-full">
              <label className="text-lg font-medium mb-2 block text-gray-700 dark:text-gray-300">
                Escuela Profesional
              </label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between h-12 border-2 rounded-lg px-4 dark:border-gray-600"
                  >
                    {escuelaProfesional
                      ? escuelas.find((esc) => esc.idpe === parseInt(escuelaProfesional))?.nmPE
                      : "Seleccione una opción"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar escuela profesional..."
                      className="h-10"
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                      <CommandGroup>
                        {escuelas.map((escuela) => (
                          <CommandItem
                            key={escuela.idpe}
                            value={escuela.idpe.toString()}
                            onSelect={() => {
                              setEscuelaProfesional(escuela.idpe.toString());
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

            {/* Insertar Plan */}
            <div>
              <label className="text-lg font-medium mb-2 block text-gray-700 dark:text-gray-300">
                Insertar el plan
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="w-full h-18 bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 px-4 py-3 file:bg-blue-600 file:text-white file:rounded-md file:px-6 file:py-3"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Solo se permiten formatos: <strong>PDF, Excel, Word</strong>. Tamaño máximo: <strong>20MB</strong>.
              </p>
            </div>
          </div>

          {/* Botón Crear Proyecto */}
          <form
            onSubmit={handleNewProyect}
            className="mt-6 flex justify-center"
          >
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full max-w-sm py-3 h-12 font-semibold"
              type="submit"
            >
              Crear Proyecto
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
