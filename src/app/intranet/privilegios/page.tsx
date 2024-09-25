//importando componentes necesarios
import NavbarAdmi from '@/components/ComponentsIntranet/navbarAdmi'
import NavIntranet from "@/components/navIntranet";
import MenuIntranet from "@/components/menuIntranet";

export default function AdmiGeneral(){
    return(
        <>
        {/** <NavbarAdmi/> */}
        <NavIntranet />
        <MenuIntranet />

        </>
    )
}