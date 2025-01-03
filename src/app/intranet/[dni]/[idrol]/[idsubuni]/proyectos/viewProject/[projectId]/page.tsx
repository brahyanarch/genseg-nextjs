'use client';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { API_PROJECT_ACTIVITIES, API_URL } from "@/config/apiconfig";
import { usePathname, useRouter, useParams } from "next/navigation";
import { TaskList } from '@/components/componentesProyecto/porjectInfo';
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";

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

export default function ProjectDetails() {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { projectId, dni, idrol, idsubuni } = useParams();

  const toggleOpenDetailsActivities = (activityId: number) => {
    router.push(`${pathname}/viewActivity/${activityId}`);
  };

  const fetchProjectsDetails = async () => {
    try {
      const response = await fetch(`${API_PROJECT_ACTIVITIES}/${projectId}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos del proyecto");
      }
      const data = await response.json();
      setProjectDetails(data.datasProject);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsDetails();
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
    { type: "page", label: "Ver proyecto" },
  ];

  return (
    <Card className="w-full rounded-none bg-white dark:bg-gray-900 mx-auto overflow-y-auto p-2 relative">
      <div className="flex gap-4 p-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
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

        {/* Estado */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Estado</h3>
          <Badge variant="outline" className="px-6 py-2 bg-yellow-100 dark:bg-yellow-700 text-yellow-600 dark:text-yellow-200 rounded-lg shadow">
            {projectDetails?.estado || "Sin estado"}
          </Badge>
        </div>

        {/* Escuela Profesional */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
            Escuela Profesional
          </h3>
          <div className="flex items-center justify-center space-x-2">
            <Image
              src="/assets/images/escudo_unmsm.png"
              alt="Escudo de la UNMSM"
              width={50}
              height={50}
            />
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {projectDetails?.prgest.nmPE || "Sin Escuela Profesional"}
            </span>
          </div>

          {/* Plan de Proyecto */}
          <div className="space-y-6">
            <div className="border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Plan de Proyecto
              </h3>
              <a
                href={`${API_URL}/${projectDetails?.plan}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver plan
              </a>
            </div>
          </div>
        </div>


        <TaskList
          toggleOpenDetsAct={(id: number) => toggleOpenDetailsActivities(id)}
          typeEdit={false}
        />
      </div>
    </Card>
  );
}
