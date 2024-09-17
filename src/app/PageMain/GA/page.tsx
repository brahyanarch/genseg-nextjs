import Link from 'next/link'
import Navbar from '@/components/navbar'
import Carrusel from '@/components/carrusel';
import {Cards} from '@/components/Cards';
import Image from 'next/image'


export default function Gamb(){
    return(
        <div className='text-gray-950'>
            <Navbar/>
            <Carrusel />
           
            <Cards/>
        </div>
    )
}