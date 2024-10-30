import {  Breadcrumb,  BreadcrumbEllipsis,  BreadcrumbItem,  BreadcrumbLink,  BreadcrumbList,  BreadcrumbPage,  BreadcrumbSeparator,} from "@/components/ui/breadcrumb";
import BreadcrumbItems from "@/components/breadcrumb";
import { EnCurso, Archivado, Pendiente, Completado } from "@/components/ComponentsIntranet/estadosProyecto";
import Graficos from "@/components/ComponentsIntranet/graficos";
import Dona from "@/components/ComponentsIntranet/graficoDona"
export default function Principal (){
    return(
        <>
        <BreadcrumbItems items={["Inicio", "Configuración"]} />
        <div className="flex items-center space-x-4">

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