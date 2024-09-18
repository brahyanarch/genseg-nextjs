import Link from 'next/link'
import Navbar from '@/components/navbar'
import Carrusel from "@/components/carrusel";
import Footer from '@/components/Footer'
export default function Segre(){
    return(
        <div className='text-gray-950'>
            <Navbar/>
            <Carrusel/>
            <Footer/>
        </div>
    )
}