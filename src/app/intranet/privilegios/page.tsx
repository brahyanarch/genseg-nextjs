//importando componentes necesarios
import NavbarAdmi from '@/components/ComponentsIntranet/navbarAdmi'
import NavIntranet from "@/components/navIntranet";
import MenuIntranet from "@/components/menuIntranet";
import Grafica from "@/components/ComponentsIntranet/graficos"
export default function AdmiGeneral(){
    return(
        <>
        {/** <NavbarAdmi/> */}
        <NavIntranet />
        <div  className="flex justify-between items-start" >
        <MenuIntranet />
         <Grafica />
         </div>
        </>
    )
}