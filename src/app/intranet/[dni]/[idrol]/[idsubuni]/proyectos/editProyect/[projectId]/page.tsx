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
import { BreadcrumbWithDropdown } from "@/components/breadcrumb"
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
  const { projectId, dni, idrol, idsubuni } = useParams();
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
  }, []);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString();
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
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
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "page", label: "Editar proyecto" },
  ];

  return (
    <>
      <Card className=" w-full rounded-none bg-white dark:bg-gray-900 mx-auto overflow-y-auto p-2 relative">
        <div className="flex p-4 gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
          <BreadcrumbWithDropdown items={breadcrumbData} />
        </div>
        <div className="w-full max-w-4xl mx-auto p-8 space-y-12 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          {/* Encabezado */}
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Proyecto: {projectDetails?.idString || "Sin ID"}
            </CardTitle>
            <div className="relative w-3/4 mx-auto">
              <Progress value={64} className="h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 dark:text-gray-300">
                64%
              </span>
            </div>
          </CardHeader>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fecha Inicio</h3>
              <div className="mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow">
                {formatearFecha(projectDetails?.fInit || "")}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Fecha Final</h3>
              <div className="mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow">
                {formatearFecha(projectDetails?.fFin || "")}
              </div>
            </div>
          </div>

          {/* Asignados */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Asignados</h3>
            <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full mx-auto shadow-lg">
              <span className="text-2xl font-bold">L</span>
            </div>
          </div>

          {/* Estado */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Estado</h3>
            <Badge
              variant="outline"
              className="px-6 py-2 bg-yellow-100 dark:bg-yellow-700 text-yellow-600 dark:text-yellow-200 rounded-lg shadow"
            >
              {projectDetails?.estado || "Sin estado"}
            </Badge>
          </div>

          {/* Escuela Profesional */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
              Escuela Profesional
            </h3>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full max-w-md h-12 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 mx-auto mt-2 flex justify-between items-center px-4 shadow"
                >
                  {escuelaP
                    ? escuelas.find((esc) => esc.idpe === parseInt(escuelaP))?.nmPE
                    : "Seleccione una opción"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-md p-0 rounded-lg shadow-md bg-white dark:bg-gray-800 mx-auto mt-2">
                <Command>
                  <CommandInput
                    placeholder="Buscar escuela profesional..."
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none"
                  />
                  <CommandList>
                    <CommandEmpty className="p-4 text-gray-500 dark:text-gray-400">
                      No se encontraron resultados.
                    </CommandEmpty>
                    <CommandGroup>
                      {escuelas.map((escuela) => (
                        <CommandItem
                          key={escuela.idpe}
                          value={escuela.idpe.toString()}
                          onSelect={() => {
                            setEscuelaP(escuela.idpe.toString());
                            setComboboxOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {escuela.nmPE}
                          <Check
                            className={cn(
                              "ml-auto text-blue-500",
                              escuelaP === escuela.idpe.toString() ? "opacity-100" : "opacity-0"
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

          {/* Plan de Proyecto */}
          <div className="space-y-6">
            <div className="border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Plan de Proyecto
              </h3>
              <a
                href={`${API_URL}/${existingPlan}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver plan existente
              </a>
            </div>
            <div className="border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
              <input
                type="file"
                onChange={(e) => setPlan(e.target.files?.[0] || null)}
                className="block w-full px-4 py-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Botón Guardar Cambios */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg h-12 w-48 mx-auto shadow-lg"
            onClick={saveChanges}
          >
            Guardar Cambios
          </Button>
          <TaskList
          toggleOpenDetsAct={(id: number) => toggleOpenDetailsActivities(id)}
          typeEdit={true}
        />
        </div>

      </Card>
    </>

  )
}

