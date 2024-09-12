import Link from 'next/link'
import {Navbar} from '../page'

export default function Segre(){
    return(
        <div className='text-gray-950'>
            <Navbar/>
            <h1>
                Estas en Seguimiento y Desarrollo del egresado.
            </h1>
            <Link href='/'>
            Regresar al Home
            </Link>
        </div>
    )
}