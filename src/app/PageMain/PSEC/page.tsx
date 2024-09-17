import Link from 'next/link'
import Navbar from '@/components/navbar'
import Carrusel from "@/components/carrusel";

export default function Dps(){
    return(
        <div className='text-gray-950'>
            <Navbar/>
            <h1>
                Estas en Dirección de Proyección Social y Extensión Cultural.
            </h1>
            <Link href='/'>
            Regresar al Home
            </Link>
        </div>
    )
}