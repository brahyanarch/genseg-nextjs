//importando componentes necesarios
import NavbarAdmi from '@/components/ComponentsIntranet/navbarAdmi'
import NavIntranet from "@/components/ComponentsIntranet/navIntranet";
import MenuIntranet from "@/components/ComponentsIntranet/menuIntranet";
import Grafica from "@/components/ComponentsIntranet/graficos"
import GraficoInfo from '@/components/ComponentsIntranet/graficosInfo'
import ConfiRoles from '@/components/ComponentsIntranet/confiRoles'
import ConfiUsers from '@/components/ComponentsIntranet/confiUsers'
import ConfiPermisos from '@/components/ComponentsIntranet/confiPermisos'
import ConfiSunidad from '@/components/ComponentsIntranet/confiSunidad'
import ConfiProyectos from '@/components/ComponentsIntranet/confiProyectos'
export default function AdmiGeneral(){
    return(
        <div className="bg-[#0F111A] flex flex-col h-screen " >
        {/** <NavbarAdmi/> */}
        <NavIntranet />
        <div  className=" flex-1 flex " >
        <MenuIntranet />
        <div className='flex-grow flex flex-col justify-between items-center overflow-auto h-full' >
        <Grafica />
        <GraficoInfo/>
        <ConfiRoles/>
        <ConfiUsers/>
        <ConfiPermisos/>
        <ConfiSunidad/>
        <ConfiProyectos/>
        </div>
        
         </div>
        </div>
    )
}