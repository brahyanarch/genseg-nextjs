import Link from 'next/link'
import {Navbar} from '../page'


export default function Gamb(){
    return(
        <div className='text-gray-950'>
            <Navbar/>
            <h1>
                Estas en Gestión Ambiental.

            </h1>
            <Link href='/'>
            Regresar al Home
            </Link>
        </div>
    )
}