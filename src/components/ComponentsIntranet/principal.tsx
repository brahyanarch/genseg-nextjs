'use client'
import {BreadcrumbWithDropdown} from "@/components/breadcrumb";
import { EnCurso, Archivado, Pendiente, Completado } from "@/components/componentesGraficos/estadosProyecto";
import Graficos from "@/components/componentesGraficos/graficos";
import Dona from "@/components/componentesGraficos/graficoDona"
import { usePathname } from "next/navigation";
export default function Principal (){
    ///navegacion rutas
    const pathname = usePathname();
    const breadcrumbData = [
        { type: "link", label: "Inicio", href: pathname },
        { type: "page", label: "Principal" },
      ];
    return(
        <>
        <div className="self-start px-4 " >
        <BreadcrumbWithDropdown items={breadcrumbData}  />
        </div>
        
        <div className="flex items-center justify-around space-x-2 mx-auto p-4">

        <Completado />
        <p className="pr-7">5 proyectos compleados</p>
        <Pendiente />
        <p className="pr-7">3 proyectos pendientes</p>
        <Archivado />
        <p className="pr-7">1 proyectos archivados</p>
        <EnCurso />
        <p className="pr-7">2 proyectos en curso</p>
        </div>

        <Graficos />   
        <Dona/>
        </>

    );
}