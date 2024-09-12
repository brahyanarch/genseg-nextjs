'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export function AvisoModal() {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  // Mostrar modal cuando el componente esté montado
  useEffect(() => {
    setMostrarAviso(true);
  }, []);

  // Función para cerrar el modal
  const closeModal = () => {
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
  const images = [
    '/resources/images/FondoP.png',
    '/resources/images/FondoP1.png',
    '/resources/images/genseg.png',
  ];

  const [imagenActual, setImagenActual] = useState(0);

  // Cambia la imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setImagenActual((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Intervalo de 5 segundos

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[500px]">
      <Image
        src={images[imagenActual]}
        alt="Imagen del Carrusel"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="transition-opacity duration-1000 ease-in-out"
      />
      {/* Texto superpuesto en la primera imagen */}
      {imagenActual === 0 && (
        <div className="absolute inset-0 flex justify-center items-end">
          <h1 className="w-1/2 text-center text-black text-4xl font-bold bg-ColorPrincipal bg-opacity-50 p-4 rounded-md my-10">
            Bienvenido a GENSEG
          </h1>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            {/* Logo */}
            <Image src="/resources/images/genseg.png" alt="Logo" width={55} height={55} />
            <p className='text-gray-900 text-base px-2' >Gestor de Proyectos <br/> de la DPSEC</p>
          </div>
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            <a href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Gestión Ambiental</a>
            <a href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Seguimiento y Desarrollo del Graduado</a>
            <a href="/config" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Proyección Social y Extensión Cultural</a>
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
    <Carrusel/>
    </div>
  )
}