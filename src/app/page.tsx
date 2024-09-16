'use client'
//importando
import { useState, useEffect } from 'react'
import { Menu, X, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Carrusel2 from "@/componentes/carrusel";
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
  {
    src: "/resources/images/42.png",
    alt: "First slide",
    heading: "GENSEG",
    description: "Dpsec",
  },
  {
    src: "/resources/images/9.jpg",
    alt: "Second slide",
    heading: "Gestion Ambiental",
    description: "Evidencia de la actividad de la que nosotros nos encontramos con todos",
  },
  {
    src: "/resources/images/28.jpg",
    alt: "Third slide",
    heading: "Seguimiento al egresado",
    description: "Evidencia de las que ya estamos presente en ese lugar",
  },
  {
    src: "/resources/images/31.jpg",
    alt: "Fourth slide",
    heading: "Proyección Social y Extensión Cultural",
    description: "Evidencia de las que no estamos, y sobre todo el respeto",
  },
  ];
  //inicializando estados para cambiar las imágenes y controlar el cambio suave de las imágenes
  const [imagenActual, setImagenActual] = useState(0);
  const [isFading, setIsFading] = useState(false);
  // Cambia la imagen cada 10 segundos
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };
   
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000); // Auto-advance every 5 seconds
    console.log("solo pasa una vez");
    return () => clearInterval(timer);
  }, []);
  //función para controlar el cambio de las imágenes al hacer click en los botones del carrusel
  
  

  return (
    <div
      className="relative overflow-hidden h-[600px] "
      id="carouselExampleCaptions"
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2.3s] ease-in-out  ${
            index === activeIndex ? "bg-opacity-50 bg-zinc-100" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2  text-white">
            <h5 className="text-xl font-bold mb-0 text-center">
              {image.heading}
              
            </h5>
            <p className="text-sm text-center mb-16">{image.description}</p>
          </div>
        </div>
      ))}

      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white text-opacity-50  hover:text-white p-2 rounded-full"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-9 w-9" />
        <span className="sr-only">Previous</span>
      </button>

      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white text-opacity-50  hover:text-white p-2 rounded-full"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-9 w-9" />
        <span className="sr-only">Next</span>
      </button>

      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-10 h-1 rounded-[11px] ${
              index === activeIndex ? "bg-blue-700" : "bg-blue-400 opacity-50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
            aria-current={index === activeIndex ? "true" : "false"}
          ></button>
        ))}
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
    <Carrusel2/>
    <ObtenerCertificado/>
    </div>
  )
}