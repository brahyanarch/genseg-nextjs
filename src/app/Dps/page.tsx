import Link from 'next/link'
import {Navbar} from '../page'

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