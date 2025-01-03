'use client'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { TaskList } from '@/components/componentesProyecto/porjectInfo'
import Image from 'next/image'
import { useState, useEffect } from "react"
import { API_PROJECT_ACTIVITIES, API_PROJECTS, API_URL, API_ESCUELA_PROFESIONAL } from "@/config/apiconfig";
import { usePathname, useRouter, useParams } from "next/navigation"
import Swal from 'sweetalert2';
///
interface ProjectDetails {
  plan: string;
  estado: string;
  name: string;
  dni: string;
  fInit: string;
  fFin: string;
  escuelaProfesional: string;
  idString: string;
  idproj: number;
  ir_rol: number;
  idsubuni: number;
}
/// Interface escuela profesional
interface Escuelas {
  idpe: number;
  nmPE: string;
  idesc: number;
}
interface ProjectDetails {
  plan: string;
  estado: string;
  fInit: string;
  fFin: string;
  idString: string;
  prgest: {
    nmPE: string;
  };
}
export default function EditProject() {

  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [escuelaP, setEscuelaP] = useState<string>("");
  const [escuelas, setEscuelas] = useState<Escuelas[]>([]);
  const [plan, setPlan] = useState<File | null>(null);
  const [existingPlan, setExistingPlan] = useState<string>("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const route = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams();
  /// Fucion para cambiar a interfaz de detalles de una actividad
  const toggleOpenDetailsActivities = (activityId: number) => {
    route.push(`${pathname}/viewActivity/${activityId}`);
  }
  //función para obtener datos desde la API
  const fetchProjectsDetails = async () => {
    try {
      const response = await fetch(`${API_PROJECT_ACTIVITIES}/${projectId}`);
      if (!response.ok) {
        throw new Error("Error al obtener los Proyectos");
      }
      const data = await response.json();
      setProjectDetails(data.datasProject);
      setEscuelaP(data.datasProject.prgest.idpe.toString());

      setExistingPlan(data.datasProject.plan)

    } catch (err: any) {
      setError(err.message);
      // Si ocurre un error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al conectar con la API. ${err.message
          }`,
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };
  //Editar Proyecto
  const saveChanges = async () => {

    const formData = new FormData();
    formData.append("idpe", String(escuelaP)); // Valor actualizado

    if (plan) {
      formData.append("file", plan); // Archivo nuevo si se seleccionó
    }

    try {
      const response = await fetch(`${API_PROJECTS}/${projectId}`, {
        method: "PUT",
        body: formData, // Enviar el objeto FormData directamente
      });

      if (response.ok) {
        // Mostrar un SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El proyecto fue editado correctamente.',
          confirmButtonText: 'OK'
        });
        fetchProjectsDetails(); // Recargar los detalles actualizados
      }
      else {
        // Si el servidor no responde correctamente
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al Editar el proyecto.',
          confirmButtonText: 'OK'
        });
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };
  const getAllEscuelas = async () => {
    try {
      const response = await fetch(API_ESCUELA_PROFESIONAL);
      if (response.ok) {
        const data = await response.json();
        setEscuelas(data);
      } else {
        // Si ocurre un error de conexión
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al cargar las escuelas profesionales.`,
          confirmButtonText: 'OK'
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

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    fetchProjectsDetails();
    getAllEscuelas();
  }, [fetchProjectsDetails]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString();
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Card className=" w-full rounded-none bg-white dark:bg-gray-900 mx-auto overflow-y-auto p-2 relative">
        <div className="w-[80%] mx-auto space-y-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Proyecto: {projectDetails?.idString || "Sin ID"}
            </CardTitle>
            <Progress value={64} className="h-2 mt-4 mx-auto w-3/4" />
            <span className="text-sm text-muted-foreground mt-2 block">64%</span>
          </CardHeader>
          <CardContent className="space-y-8 text-center">
            <div>
              <div className="mb-4">
                <div className="font-medium text-lg">Fecha Inicio</div>
                <div className="text-muted-foreground py-2 px-4 rounded-lg border border-gray-300 w-64 mx-auto">
                  {formatearFecha(projectDetails?.fInit || "")}
                </div>
              </div>
              <div>
                <div className="font-medium text-lg">Fecha Final</div>
                <div className="text-muted-foreground py-2 px-4 rounded-lg border border-gray-300 w-64 mx-auto">
                  {formatearFecha(projectDetails?.fFin || "")}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg">Asignados</h3>
              <div className="w-16 h-16 flex items-center justify-center bg-gray-400 rounded-full mx-auto">
                <span className="text-black font-bold text-2xl">L</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg">Estado</h3>
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-yellow-200 px-4 py-2 text-lg">
                  {projectDetails?.estado || "Sin estado"}
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg">Escuela Profesional</h3>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-96 mx-auto justify-between h-12 border border-gray-300 text-lg"
                  >
                    {escuelaP
                      ? escuelas.find((esc) => esc.idpe === parseInt(escuelaP))?.nmPE
                      : "Seleccione una opción"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 mx-auto">
                  <Command>
                    <CommandInput placeholder="Buscar escuela profesional..." className="h-10" />
                    <CommandList>
                      <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                      <CommandGroup>
                        {escuelas.map((escuela) => (
                          <CommandItem
                            key={escuela.idpe}
                            value={escuela.idpe.toString()}
                            onSelect={() => {
                              setEscuelaP(escuela.idpe.toString());
                              setComboboxOpen(false);
                            }}
                          >
                            {escuela.nmPE}
                            <Check
                              className={cn(
                                "ml-auto",
                                escuelaP === escuela.idpe.toString()
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
            <div className="space-y-4">
              <div className="border border-gray-300 p-4 rounded-lg text-center">
                <h3 className="font-medium text-lg mb-2">Plan de Proyecto</h3>
                <a
                  href={`${API_URL}/${existingPlan}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 underline text-lg"
                >
                  Ver plan existente
                </a>
              </div>
              <div className="border border-gray-300 p-4 rounded-lg text-center">
                <input
                  type="file"
                  onChange={(e) => setPlan(e.target.files?.[0] || null)}
                  className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 px-4 py-3 file:bg-blue-600 file:text-white file:rounded-md file:px-6 file:py-3"
                />
              </div>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 h-12 w-40 mx-auto text-lg"
              onClick={saveChanges}
            >
              Guardar Cambios
            </Button>
          </CardContent>

        </div>
        <TaskList
              toggleOpenDetsAct={(id: number) => toggleOpenDetailsActivities(id)}
              typeEdit={true}
            />
      </Card>
    </>

  )
}

