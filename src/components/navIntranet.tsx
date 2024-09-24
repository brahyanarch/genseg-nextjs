'use client'
import {useState} from 'react'
import { BellIcon, MenuIcon, SearchIcon, Search, Logs } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function Notificacion(){
  // Estado para controlar la visibilidad de la ventana flotante
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Función para alternar la visibilidad de la ventana flotante
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

 return(
     <div>
         <div className="text-[28px] cursor-pointer mr-3" onClick={toggleProfileMenu} >
         <BellIcon className="h-5 w-5" />
         </div>
         <div>
            {/* Ventana flotante de Notificacion */}
     {isProfileOpen && (
       <div className="absolute text-gray-500 right-10 mt-2 w-48 bg-white rounded-lg shadow-lg h-[400px]">
         <ul className="py-2 ">
           <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
             <h3>Notificacion 1</h3>
             <p className="text-xs">
               Lennin está solicitando editar ...
             </p>
           </li>
           <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
           <h3>Notificacion 2</h3>
           <p className="text-xs">
               Lennin está solicitando editar ...
             </p>
           </li>
           <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
           <h3>Notificacion 3</h3>
           <p className="text-xs">
               Lennin está solicitando editar ...
             </p>
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
    <div>
      {/* Botón de perfil */}
      <div
        className="text-sm font-bold text-gray-500 pt-1  text-center h-[30px] w-[30px] focus:outline-none rounded-[50%] bg-white cursor-pointer" onClick={toggleProfileMenu}
      >
      B
      </div>
      <div>
      {isProfileOpen && (
          <div className="absolute text-gray-500 right-2 mt-2 w-48 bg-white rounded-lg shadow-lg h-[400px]">
            <ul className="py-2">
              <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
                Editar perfil
              </li>
              <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
                Centro de ayuda
              </li>
              <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer">
                Cerrar sesión
              </li>
            </ul>
          </div>
        )}
      </div>

      
    </div>
  );
}

export function Roles(){
    // Estado para controlar la visibilidad de la ventana flotante
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Función para alternar la visibilidad de la ventana flotante
    const toggleProfileMenu = () => {
      setIsProfileOpen(!isProfileOpen);
    };
  return(
    <div >
    <div>
    <Logs  className="h-5 w-5 cursor-pointer" onClick={toggleProfileMenu} />
    </div>
    <div>
      {/* Ventana flotante de Roles */}
      {isProfileOpen && (
        <div className="absolute text-white right-2 mt-2 bg-white rounded-lg shadow-lg h-[300px] w-[200px]">
          <ul className="flex justify-between flex-wrap  py-2">
            <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer rounded-full w-50 h-50 bg-slate-400 hidden ">
              Administrador General
            </li>
            <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer rounded-full  w-80 h-80 bg-slate-400 hidden">
              Sub Administrador
            </li>
            <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer rounded-full  w-80 h-80 bg-slate-400 hidden">
              Coordinador
            </li>
            <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer rounded-full  w-80 h-80 bg-slate-400 hidden">
              Coordinador
            </li>
            <li className="px-10 py-2 hover:bg-gray-100 cursor-pointer rounded-full  w-80 h-80 bg-slate-400 hidden">
              Sub Coordinador
            </li>
          </ul>
        </div>
      )}
    </div>
    </div>
  )
}

export default function Component() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Función para alternar la visibilidad de la ventana flotante
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  return (
    <nav className="bg-gray-900 text-white p-2 flex items-center justify-between relative">
      <div className="flex items-center space-x-2">
        <img src="/resources/images/DPSEClogo.png" alt="Logo" className="h-9 w-9 rounded-full bg-white" />
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold">Proyección Social y Extensión Cultural</h1>
          <p className="text-xs text-gray-400">Coordinador</p>
        </div>
      </div>
        <div className="relative hidden md:block ">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar..." 
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400 w-64 rounded-3xl"
          />
        </div>
      <div className="flex items-center space-x-4">
        
      <Notificacion/>
      
       <Roles/>
        <Perfil/>
        
      </div>
    </nav>
  )
}