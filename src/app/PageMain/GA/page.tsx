import Link from 'next/link'
import Navbar from '@/components/navbar'
import Carrusel from '@/components/carrusel';
import {Cards} from '@/components/Cards';
import Image from 'next/image'
import Footer from '@/components/Footer'


export default function Gamb(){
    return(
        <div className='text-gray-950'>
            <Navbar/>
            <Carrusel />
           
            <Cards/>
            <Footer/>
        </div>
    )
}