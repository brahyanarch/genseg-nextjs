'use client'
import {useState, useEffect, useRef} from 'react'
import { BellIcon, User, HelpCircle, LogOut , SearchIcon, Logs } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import NavRoles from '@/components/ComponentsIntranet/roles'
import Notificaciones from '@/components/ComponentsIntranet/notificaciones'

const MenuRoles = () => {
  return (
    <svg
      width="6"
      height="6"
      viewBox="0 0 23 23"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 fill-current text-white" // Controla el tamaño y el color
    >
      <path d="M2.875 5.75C4.46282 5.75 5.75 4.46282 5.75 2.875C5.75 1.28718 4.46282 0 2.875 0C1.28718 0 0 1.28718 0 2.875C0 4.46282 1.28718 5.75 2.875 5.75Z" />
      <path d="M2.875 14.375C4.46282 14.375 5.75 13.0878 5.75 11.5C5.75 9.91218 4.46282 8.625 2.875 8.625C1.28718 8.625 0 9.91218 0 11.5C0 13.0878 1.28718 14.375 2.875 14.375Z" />
      <path d="M2.875 23C4.46282 23 5.75 21.7128 5.75 20.125C5.75 18.5372 4.46282 17.25 2.875 17.25C1.28718 17.25 0 18.5372 0 20.125C0 21.7128 1.28718 23 2.875 23Z" />
      <path d="M11.5 14.375C13.0878 14.375 14.375 13.0878 14.375 11.5C14.375 9.91218 13.0878 8.625 11.5 8.625C9.91218 8.625 8.625 9.91218 8.625 11.5C8.625 13.0878 9.91218 14.375 11.5 14.375Z" />
      <path d="M11.5 23C13.0878 23 14.375 21.7128 14.375 20.125C14.375 18.5372 13.0878 17.25 11.5 17.25C9.91218 17.25 8.625 18.5372 8.625 20.125C8.625 21.7128 9.91218 23 11.5 23Z" />
      <path d="M20.125 14.375C21.7128 14.375 23 13.0878 23 11.5C23 9.91218 21.7128 8.625 20.125 8.625C18.5372 8.625 17.25 9.91218 17.25 11.5C17.25 13.0878 18.5372 14.375 20.125 14.375Z" />
      <path d="M20.125 23C21.7128 23 23 21.7128 23 20.125C23 18.5372 21.7128 17.25 20.125 17.25C18.5372 17.25 17.25 18.5372 17.25 20.125C17.25 21.7128 18.5372 23 20.125 23Z" />
      <path d="M11.5 5.75C13.0878 5.75 14.375 4.46282 14.375 2.875C14.375 1.28718 13.0878 0 11.5 0C9.91218 0 8.625 1.28718 8.625 2.875C8.625 4.46282 9.91218 5.75 11.5 5.75Z" />
      <path d="M20.125 5.75C21.7128 5.75 23 4.46282 23 2.875C23 1.28718 21.7128 0 20.125 0C18.5372 0 17.25 1.28718 17.25 2.875C17.25 4.46282 18.5372 5.75 20.125 5.75Z" />
    </svg>
  );
};

export function Notificacion() {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Alternar visibilidad de la ventana de notificación
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Cerrar el menú de notificación si el usuario hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={notificationRef} >
      <div className="text-[28px] cursor-pointer mr-3" onClick={toggleProfileMenu}>
        <BellIcon className="h-5 w-5" />
      </div>
      {/* Ventana flotante de Notificacion */}
      {isProfileOpen && (
       
          <Notificaciones />
        
      )}
    </div>
  );
}

export function Perfil() {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Función para alternar la visibilidad de la ventana flotante
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Cerrar el menú si el usuario hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={profileMenuRef} >
      {/* Botón de perfil */}
      <div
        className="text-sm font-bold text-gray-500 pt-1 text-center h-[30px] w-[30px] focus:outline-none rounded-[50%] bg-white cursor-pointer"
        onClick={toggleProfileMenu}
      >
        B
      </div>
      <div>
        {isProfileOpen && (
          <div className="absolute z-30 right-2 w-64 bg-gray-900 text-white p-4 rounded-lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold mr-3">
                M
              </div>
              <div>
                <h2 className="font-semibold">Mariana artista muchacha</h2>
              </div>
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Centro de ayuda
                  </Button>
                </li>
              </ul>
            </nav>
            <div className="mt-6">
              <Button variant="secondary" className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Roles() {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const rolesMenuRef = useRef<HTMLDivElement>(null);

  // Función para alternar la visibilidad de la ventana flotante
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Cerrar el menú si el usuario hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rolesMenuRef.current && !rolesMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={rolesMenuRef}>
      {/* Botón que abre el menú de roles */}
      <div className="cursor-pointer" onClick={toggleProfileMenu}>
        <MenuRoles />
      </div>

      {/* Ventana flotante de Roles */}
      {isProfileOpen && (
        
          <NavRoles />
        
      )}
    </div>
  );
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