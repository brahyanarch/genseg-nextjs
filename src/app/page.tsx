'use client'
//importando
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
//funcion principal que controla el Modal de aviso
export function AvisoModal() {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  // Mostrar modal de aviso cuando el componente esté montado
  useEffect(() => {
    setMostrarAviso(true);
  }, []);

  // Función para cerrar el modal
  const closeModal = () => {
    //hal hacer click en el botón de cerrar el valor de Mostrar aviso cambia de estado
    setMostrarAviso(false);
  };

  return (
    <>
      {/* Modal */}
      {mostrarAviso && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg flex flex-col items-center justify-center p-8 shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold m-4 text-gray-500">Aviso Importante</h2>
            <p className="text-gray-700 m-6">Para todos los voluntarios que culminaron sus 3 actividades ya pueden solicitar sus certificados mediante esta plataforma con su codigo de estudiante.</p>
            <h4 className='text-gray-950 m-5'>
              {Date()}
            </h4>
            <button
              className="w-40 h-15 text-center pb-1 bg-gray-500 text-white rounded hover:bg-gray-300 hover:text-gray-900"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function Carrusel() {
  //array images que almacena las direcciones de las images que aparecerán en el carrucel
  const images = [
    '/resources/images/FondoP.png',
    '/resources/images/FondoP1.png',
    '/resources/images/genseg.png',
  ];
  //inicializando estados para cambiar las imágenes y controlar el cambio suave de las imágenes
  const [imagenActual, setImagenActual] = useState(0);
  const [isFading, setIsFading] = useState(false);
  // Cambia la imagen cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setImagenActual((prev) => (prev + 1) % images.length);//si llega al último de las imágenes regresa al primero
        console.log(imagenActual);
        setIsFading(false); // Inicia el fade-in
      }, 1000); // Tiempo para el fade-out
    }, 10000);
    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [images.length]);
  //función para controlar el cambio de las imágenes al hacer click en los botones del carrusel
  function Cambiar() {
    setImagenActual(prev => (prev + 1) % images.length); // Cicla entre imágenes
  }
  

  return (
    <div className="relative w-full h-[500px]">
      <Image
        src={images[imagenActual]}
        alt="Imagen del Carrusel"
        layout="fill"
        objectFit="cover"
        quality={100}
        className={`transition-opacity duration-1000 ease-in-out ${
          isFading ? 'opacity-20' : 'opacity-100'
        }`}
      />
      {/* Texto superpuesto en la primera imagen */}
      {imagenActual === 0 && (
        <div className="absolute inset-0 flex justify-center items-end">
          <h1 className="w-1/2 text-center text-black text-4xl font-bold bg-ColorPrincipal bg-opacity-50 p-4 rounded-md my-10">
            Bienvenido a GENSEG
          </h1>
        </div>
      )}
      <div className="absolute inset-0 flex justify-between items-center" >
        <button className='text-5xl ml-3 text-gray-950 bg-slate-300 bg-opacity-50 '  onClick={Cambiar}>
         {'<'}
        </button>
        <button className='text-5xl mr-3 text-gray-950 bg-slate-300 bg-opacity-50 '  onClick={Cambiar}>
          {'>'}
        </button>
      </div>
    </div>
  );
}
export function Navbar(){
  //inicializando el estado para controlar el menu en un teléfono
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return(
    <nav className="bg-white shadow-md">
    <div className=" bg-gray-900 w-full mx-auto px-4 sm:px-6 lg:px-8 h-auto flex justify-end items-center">
      <Link href='/#' className="px-3 py-1 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">
      Intranet
      </Link>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          {/* Logo */}
          <Image src="/resources/images/genseg.png" alt="Logo" width={55} height={55} />
          <p className='text-gray-900 text-base px-2' ><Link href='/' >Gestor de Proyectos <br/> de la DPSEC</Link></p>
        </div>
        {/* Desktop menu */}
        <div className="hidden sm:flex sm:items-center">
          <a href="/Gamb" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Gestión Ambiental</a>
          <a href="/Segre" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Seguimiento y Desarrollo del Graduado</a>
          <a href="/Dps" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Proyección Social y Extensión Cultural</a>
        </div>
        
        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    {isMenuOpen && (
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Gestión Ambiental</a>
          <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Seguimiento y Desarrollo del Graduado</a>
          <a href="/config" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Proyección Social y Extensión Cultural</a>
        </div>
      </div>
    )}
  </nav>
  )
}

export function ObtenerCertificado() {
  return (
    <>
      <div className="bg-gray-300 gap-4 text-gray-800 flex flex-col justify-center items-center mx-auto my-[50px] p-8 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Solicitar Certificado</h2>
        <p className="text-sm bg-blue-100 text-blue-600 p-2 rounded-md w-full text-center mb-4">
          ¡Atención! Los certificados se solicitan una vez que el voluntario participante culminó con las 3 actividades designadas.
        </p>
        <div className="flex justify-between items-center w-full md:w-3/4 mb-4">
          <h3 className="text-lg">Digite su código de estudiante:</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="201861"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Consultar
            </button>
          </div>
        </div>

        <p className="text-sm bg-yellow-100 text-yellow-600 p-2 rounded-md w-full text-center">
          Los certificados se entregarán de manera digital a su correo institucional, si requiere en físico apersonarse a la oficina de la DPSEC.
        </p>
      </div>
    </>
  );
}

export default function Home() {
  const [mostrarAlerta, setMostrarAlerta] = useState(false)

  useEffect(() => {
    // Show the alert when the component mounts
    setMostrarAlerta(true)

    // Automatically hide the alert after 10 seconds
    const timer = setTimeout(() => {
      setMostrarAlerta(false)
    }, 10000)

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer)
  }, [])

  return (
    <div >
    <AvisoModal/>
    <Navbar/>
    <Carrusel/>
    <ObtenerCertificado/>
    </div>
  )
}