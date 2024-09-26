//importando componentes necesarios
import NavbarAdmi from '@/components/ComponentsIntranet/navbarAdmi'
import NavIntranet from "@/components/navIntranet";
import MenuIntranet from "@/components/menuIntranet";
import Grafica from "@/components/ComponentsIntranet/graficos"
import GraficoInfo from '@/components/graficosInfo'
export default function AdmiGeneral(){
    return(
        <>
        {/** <NavbarAdmi/> */}
        <NavIntranet />
        <div  className="flex justify-between items-start" >
        <MenuIntranet />
        <div className='w-[90%] flex flex-col justify-between items-center' >
        <Grafica />
        <GraficoInfo/>
        </div>
        
         </div>
        </>
    )
}