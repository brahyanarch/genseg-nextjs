"use client";
import Navbar from "@/components/componentesDashboard/navbarDashboard";
import Menu from "@/components/componentesDashboard/menuDashboard";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Para obtener parámetros de la URL
import {  API_USERS } from "@/config/apiconfig"; // Rutas de las APIs
import { User } from "@/tipos/typos"; // Tipos de datos personalizados

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
    } catch (err:any) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchUs(); // Obtener información del usuario


    setIsClient(true); // Indica que se está renderizando en el cliente
  }, []);


  const handleMenuClick = (label: string) => {
    console.log(`Navigating to ${label}`);
    // Agregar lógica de navegación
  };
  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 dark:bg-gray-900">
      <Navbar
        idrol={Number(idrol)} // Reemplaza con datos reales
        idsubuni={Number(idsubuni)} // Reemplaza con datos reales
        dni={dni.toString()} // Reemplaza con datos reales
        name={User[0]?.n_usu || 'K'} // Reemplaza con datos reales
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <div className="flex flex-1 overflow-hidden">
        <Menu />
        <main className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
