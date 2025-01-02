"use client";
import Navbar from "@/components/componentesDashboard/navbarDashboard";
import Menu from "@/components/componentesDashboard/menuDashboard";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Para obtener parámetros de la URL
import { API_USERS } from "@/config/apiconfig"; // Rutas de las APIs
import { User } from "@/tipos/typos"; // Tipos de datos personalizados
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon } from "lucide-react";
import { Notificacion, Roles, Perfil } from "@/components/ComponentsIntranet/navIntranet";
import Image from 'next/image'
import {
    API_ROLES,
    API_SUBUNIDADES,
  } from "@/config/apiconfig";


const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false); // Indica si el cliente está renderizando
  const [User, setUser] = useState<User[]>([]); // Información del usuario
  const [darkMode, setDarkMode] = useState(false);

  const { idrol, idsubuni, dni } = useParams();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const fetchUs = async () => {
    try {
      const response = await fetch(`${API_USERS}/${dni}`);
      if (!response.ok) throw new Error("Error al obtener los usuarios");
      const data = await response.json();
      if (Array.isArray(data)) {
        setUser(data);
      } else {
        console.error("Respuesta de API no válida:", data);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchUs(); // Obtener información del usuario
    setIsClient(true); // Indica que se está renderizando en el cliente
  }, []);

  if (!isClient) return null;
  console.log(User, " ");
  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 dark:bg-gray-900">
      <nav className="bg-white dark:text-white w-full dark:bg-gray-800 shadow-md">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src={"/resources/images/DPSEClogo.png"}
                alt="Logo"
                className="h-9 w-9 rounded-full bg-white"
                width={80}
                height={80}
              />
              <div className="flex flex-col pl-3">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  Proyección Social y Extensión Cultural
                </span>
                {/* Agregar lógica para mostrar el rol y subunidad */}
                {
                  <p className="text-xs text-gray-400 flex-row">
                    Administrador General
                  </p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                className="mr-4 w-64"
                placeholder="Buscar..."
                type="search"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-black dark:text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-black dark:text-white" />
                )}
              </Button>
              <Notificacion />
              {/*<Roles idRol={idrol} idSubUnidad={idsubuni} dni={dni} />*/}
              <Perfil name={"Admin"} />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <Menu admi={true} />
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
