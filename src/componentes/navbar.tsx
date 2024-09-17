'use client'
import { useState, useEffect } from "react";
import { Menu, X, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar(){
    //inicializando el estado para controlar el menu en un teléfono
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  
    return(
      <nav className="bg-white shadow-md">
      <div className=" bg-gray-900 w-full mx-auto px-4 sm:px-6 lg:px-8 h-auto flex justify-end items-center">
        <Link href='/#' className="px-3 py-1 rounded-md text-xs font-medium text-blue-600 hover:bg-gray-900 hover:text-gray-50">
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
            <a href="/PageMain/GA" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Gestión Ambiental</a>
            <a href="/PageMain/SDG" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Seguimiento y Desarrollo del Graduado</a>
            <a href="/PageMain/PSEC" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-gray-50">Proyección Social y Extensión Cultural</a>
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
  