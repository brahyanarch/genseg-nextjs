//importando componentes necesarios
import NavbarAdmi from '@/components/ComponentsIntranet/navbarAdmi'
import NavIntranet from "@/components/navIntranet";
import MenuIntranet from "@/components/menuIntranet";
import Grafica from "@/components/ComponentsIntranet/graficos"
import GraficoInfo from '@/components/graficosInfo'
import ConfiRoles from '@/components/ComponentsIntranet/confiRoles'
import ConfiUsers from '@/components/ComponentsIntranet/confiUsers'
import ConfiPermisos from '@/components/ComponentsIntranet/confiPermisos'
import ConfiSunidad from '@/components/ComponentsIntranet/confiSunidad'
export default function AdmiGeneral(){
    return(
        <>
        {/** <NavbarAdmi/> */}
        <NavIntranet />
        <div  className="flex justify-between items-start" >
        <MenuIntranet />
        <div className='w-[90%] flex flex-col justify-between items-center overflow-auto h-screen' >
        <Grafica />
        <GraficoInfo/>
        <ConfiRoles/>
        <ConfiUsers/>
        <ConfiPermisos/>
        <ConfiSunidad/>
        </div>
        
         </div>
        </>
    )
}