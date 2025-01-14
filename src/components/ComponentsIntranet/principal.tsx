'use client'
import {BreadcrumbWithDropdown} from "@/components/breadcrumb";
import { EnCurso, Archivado, Pendiente, Completado } from "@/components/componentesGraficos/estadosProyecto";
import Graficos from "@/components/componentesGraficos/graficos";
import Dona from "@/components/componentesGraficos/graficoDona"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { API_ACTIVITIES } from "@/config/apiconfig";
import { useParams } from "next/navigation";
import {BreadcrumbItemType} from '@/tipos/typos'
import StatusBadge from "@/components/componentesGraficos/estadosProyecto";

  
  type AllActivities = {
    Pendiente: number;
    Completado: number;
    Curso: number;
    Archivado: number
  }

export default function Principal (){
    const { idsubuni } = useParams();
    const [activities, setactivities] = useState<AllActivities>({
        Pendiente: 0,
        Completado: 0,
        Curso: 0,
        Archivado: 0,
    });
    const [loading, setLoading] = useState(true);
    

    const pathname = usePathname();
    const breadcrumbData:BreadcrumbItemType[] = [
        { type: "link", label: "Inicio", href: pathname },
        { type: "page", label: "Principal" },
      ];
      const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ACTIVITIES}/subunidad/${idsubuni}`);
            if (!response.ok) throw new Error("Error al cargar actividades");
            const data: AllActivities = await response.json();
            setactivities(data);
        } catch (error) {
            console.error("Error fetching activities:", error);
            setactivities({ Pendiente: 0, Completado: 0, Curso: 0, Archivado: 0 });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchActivities();
      }, []);
    return(
        <>
        <div className="self-start p-4" >
        <BreadcrumbWithDropdown items={breadcrumbData}  />
        </div>
        
        <div className="flex items-center justify-around space-x-2 mx-auto p-4">

        <Completado />
        <p className="pr-7"> {activities?.Completado || 0} Actividades Completados</p>
        <Pendiente />
        <p className="pr-7">{activities?.Pendiente||0} Actividades pendientes</p>
        <Archivado />
        <p className="pr-7">{activities?.Archivado||0} Actividades archivados</p>
        <EnCurso />
        <p className="pr-7">{activities?.Curso||0} Actividades en curso</p>
        </div>
        <Graficos />   
        <Dona/>
        </>

    );
}