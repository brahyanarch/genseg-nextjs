'use client'
import { useState } from "react";
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Buscador(){
    return(
        <div className="self-center">
            <input type="search" placeholder="Buscar..." className=" p-4 rounded-[20px] w-[250px] h-[25px] border-[#9FA6BC] border-[1px] bg-[#141824]" />
        </div>
    )
}

export function Notificacion(){
     // Estado para controlar la visibilidad de la ventana flotante
     const [isProfileOpen, setIsProfileOpen] = useState(false);
  
     // Función para alternar la visibilidad de la ventana flotante
     const toggleProfileMenu = () => {
       setIsProfileOpen(!isProfileOpen);
     };

    return(
        <div>
            <div className="text-[28px]" onClick={toggleProfileMenu} >
                🔔
            </div>
            <div>
               {/* Ventana flotante de perfil */}
        {isProfileOpen && (
          <div className="absolute text-gray-500 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            <ul className="py-2 text-xs">
              <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
                Notificación 1
              </li>
              <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
                Notificación 2
              </li>
              <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
                Notificación 3
              </li>
            </ul>
          </div>
        )}
            </div>
        </div>
    )
}
export function Perfil() {
    // Estado para controlar la visibilidad de la ventana flotante
    const [isProfileOpen, setIsProfileOpen] = useState(false);
  
    // Función para alternar la visibilidad de la ventana flotante
    const toggleProfileMenu = () => {
      setIsProfileOpen(!isProfileOpen);
    };
  
    return (
      <div className="relative">
        {/* Botón de perfil */}
        <Link href="#" onClick={toggleProfileMenu}>
        <div
          className="text-gray-600 text-[28px] text-center h-[40px] w-[40px] focus:outline-none rounded-[50%] bg-white"
        >
          B
        </div>
        </Link>
  
        {/* Ventana flotante de perfil */}
        {isProfileOpen && (
          <div className="absolute text-gray-500 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Editar perfil
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Centro de ayuda
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Cerrar sesión
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
  



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null); // Estado para rastrear el enlace seleccionado

  const handleLinkClick = (link:any) => {
    setSelectedLink(link); // Actualiza el estado del enlace seleccionado
  };

  return (
    <nav className="bg-[#141824] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 ">
          <div className="flex-shrink-0 flex items-center py-2">
            {/* Logo */}
            <div className="bg-white rounded-[50%]" ><Image src="/resources/images/DPSEClogo.png" alt="" width={50} height={50}/></div>
            <p className='text-[#8A94AD] text-base px-2 self-start '>
              <Link href='/'>Proyección Social y Extensión Cultural</Link> <br/>
              <Link href='/'>Administrador General</Link>
            </p>
          </div>
          {/*Buscador*/}
           <Buscador/>
          {/* Menú para pantallas grandes */}
          <div className="hidden sm:flex sm:items-center">
           <Notificacion/>
            <Perfil/>
          </div>
          </div>
          {/* Botón de menú móvil */}
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

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/PageMain/GA"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                selectedLink === '/PageMain/GA' ? 'bg-gray-500 text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => handleLinkClick('/PageMain/GA')}
            >
              Gestión Ambiental
            </Link>
            <Link
              href="/PageMain/SDG"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                selectedLink === '/PageMain/SDG' ? 'bg-gray-500 text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => handleLinkClick('/PageMain/SDG')}
            >
              Seguimiento y Desarrollo del Graduado
            </Link>
            <Link
              href="/PageMain/PSEC"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                selectedLink === '/PageMain/PSEC' ? 'bg-gray-500 text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => handleLinkClick('/PageMain/PSEC')}
            >
              Proyección Social y Extensión Cultural
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
