'use client';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { API_PROJECT_ACTIVITIES, API_URL } from "@/config/apiconfig";
import { usePathname, useRouter, useParams } from "next/navigation";
import { TaskList } from '@/components/componentesProyecto/porjectInfo';

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
  const { projectId } = useParams();

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

  return (
    <Card className="w-full rounded-none bg-white dark:bg-gray-900 mx-auto overflow-y-auto p-2 relative">
      <CardContent>
        <Image
          src={"/resources/images/imgActividad.jpg"}
          alt="imagen header"
          className="w-[100%] h-44"
          width={500}
          height={300}
        />
      </CardContent>
      <div className="w-[90%] mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Proyecto: {projectDetails?.idString || "Sin ID"}
          </CardTitle>
          <Progress value={64} className="h-2 mt-2" />
          <span className="text-sm text-muted-foreground mt-1">64%</span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <div className="font-medium">Fecha Inicio</div>
                <div className="text-muted-foreground py-2 px-4 rounded-lg border-2 border-gray-500 border-opacity-30">
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
            <h3 className="font-medium mb-2">Estado</h3>
            <Badge variant="outline" className="bg-yellow-200">
              {projectDetails?.estado || "Sin estado"}
            </Badge>
          </div>

          <div>
            <h3 className="font-medium mb-2">Escuela Profesional</h3>
            <h4 className="text-sm text-muted-foreground">
              {projectDetails?.prgest?.nmPE || "Sin escuela profesional"}
            </h4>
          </div>

          <div>
            <h3 className="font-medium mb-2">Plan de Proyecto</h3>
            <h4 className="text-sm text-muted-foreground">
              <a
                href={`${API_URL}/${projectDetails?.plan}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver plan
              </a>
            </h4>
          </div>

          <TaskList
            toggleOpenDetsAct={(id: number) => toggleOpenDetailsActivities(id)}
            typeEdit={false}
          />
        </CardContent>
      </div>
    </Card>
  );
}
