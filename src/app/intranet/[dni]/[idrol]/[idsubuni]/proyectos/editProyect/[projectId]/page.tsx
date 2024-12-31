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
import { useState, useEffect, useContext } from "react"
import { AvisoContext } from "@/context/avisoContext";
import { API_PROJECT_ACTIVITIES, API_PROJECTS, API_URL, API_ESCUELA_PROFESIONAL } from "@/config/apiconfig";
import { usePathname, useRouter, useParams } from "next/navigation"
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
  const { mostrarAviso } = useContext<any>(AvisoContext);
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
      setEscuelaP(data.datasProject.prgest.nmPE);
      setExistingPlan(data.datasProject.plan)

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  //Editar Proyecto
  const saveChanges = async () => {
  
    const formData = new FormData();
    formData.append("idpe", String(escuelaP)); // Valor modificado
    if (plan) {
      formData.append("file", plan); // Archivo nuevo si se seleccionó
    }
  
    try {
      const response = await fetch(`${API_PROJECTS}/${projectId}`, {
        method: "PUT",
        body: formData, // Enviar el objeto FormData directamente
      });
  
      if (response.ok){
        alert("Cambios guardados exitosamente.");
        fetchProjectsDetails(); // Recargar los detalles actualizados
      }
      else {
          alert('Error al guardar el proyecto.');
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
        mostrarAviso("warning", "Error al cargar las escuelas profesionales.");
      }
    } catch (error) {
      mostrarAviso("warning", `Error al conectar con la API: ${error}`);
    }
  };
  
  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    fetchProjectsDetails();
    getAllEscuelas();
  }, [projectId]);

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
        <CardContent className="">
          <Image src={"/resources/images/imgActividad.jpg"} alt="imagen header" className="w-[100%] h-44" width={500} height={300} ></Image>
        </CardContent>
        <div className=" w-[90%] mx-auto" >
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
            Proyecto: {projectDetails?.idString || "Sin ID"}
            </CardTitle>
            <Progress value={64} className="h-2 mt-2" />
            <span className="text-sm text-muted-foreground mt-1">64%</span>
          </CardHeader>
          <CardContent className="space-y-6 ">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="text-sm">
                  <div className="font-medium">Fecha Inicio</div>
                  <div className="text-muted-foreground py-2 px-4 rounded-lg border-2 border-gray-500 border-opacity-30 ">
                  {formatearFecha(projectDetails?.fInit || "")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">
                  <div className="font-medium">Fecha final</div>
                  <div className="text-muted-foreground py-2 px-4 rounded-lg border-2 border-gray-500 border-opacity-30">
                  {formatearFecha(projectDetails?.fFin || "")}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Asignados</h3>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-400 rounded-full">
                <span className=" text-black font-bold text-lg ">L</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Estado</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-yellow-200">
                {projectDetails?.estado || "Sin estado"}
                </Badge>
              </div>
            </div>
            <div>
              <div className="dark:texto-white texto md">
                <h3 className="font-medium mb-2">Escuela Profesional</h3>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-96 justify-between h-10 border-2 dark:border-gray-300"
                    >
                      {escuelaP
                        ? escuelas.find((esc) => esc.idpe === parseInt(escuelaP))?.nmPE
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
                                setEscuelaP(
                                  escuela.idpe.toString()
                                );
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
                <h3 className="font-medium mb-2">Plan de Proyecto</h3>
                              <a
                                href={`${API_URL}/${existingPlan}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Ver plan existente
                              </a>
                <input type="file" name="" id="" onChange={(e) => setPlan(e.target.files?.[0] || null)} />
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600 h-12 w-32 " onClick={saveChanges}  >
                guardar cambios
              </Button>
            </div>


            <TaskList toggleOpenDetsAct={(id: number) => toggleOpenDetailsActivities(id)} typeEdit={true} />
          </CardContent>
        </div>
      </Card>
    </>

  )
}

