"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon } from "lucide-react";
import { Notificacion, Roles, Perfil } from "@/components/ComponentsIntranet/navIntranet";
import { Skeleton } from "@/components/ui/skeleton";
import {useState, useEffect} from 'react'
import Image from 'next/image'
import {
    API_ROLES,
    API_SUBUNIDADES,
  } from "@/config/apiconfig";


interface Role {
    id_rol: number;
    n_rol: string;
    abrev: string;
  }
  interface Subunidad {
    id_subuni: number;
    n_subuni: string;
    abreviatura: string;
  }

const Navbar = ({
  idrol,
  idsubuni,
  dni,
  name,
  toggleDarkMode,
  darkMode,
}: {
  idrol: number;
  idsubuni: number;
  dni: string;
  name: string;
  toggleDarkMode: () => void;
  darkMode: boolean;
}) => {
    const [nomroles, setnomroles] = useState<Role[]>([]);
    const [subunidades, setSubunidades] = useState<Subunidad[]>([]);

    const getRoleName = (rol_id: number) => {
        const role = nomroles.find((r) => r.id_rol === rol_id);
        //return role ? role.n_rol : `Rol ${rol_id}`; // poner esqueleton
        console.log(role);
        return role ? role.n_rol + " de " : null;
      };
      const getSubunidadName = (subunidad_id: number) => {
        const subunidad = subunidades.find((s) => s.id_subuni === subunidad_id);
        //return subunidad ? subunidad.n_subuni : `Subunidad ${subunidad_id}`;
        return subunidad ? subunidad.n_subuni : null;
      };
      const fetchRoles = async () => {
        try {
          const response = await fetch(API_ROLES);
          const data: Role[] = await response.json();
          setnomroles(data);
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
      const fetchSubunidades = async () => {
        try {
          const response = await fetch(API_SUBUNIDADES);
          const data: Subunidad[] = await response.json();
          setSubunidades(data);
        } catch (error) {
          console.error("Error fetching subunidades:", error);
        }
      };
      useEffect(() => {
        fetchRoles();
        fetchSubunidades();
      }, []);
  return (
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
              {getRoleName(idrol) && getSubunidadName(idsubuni) ? (
                  <p className="text-xs text-gray-400 flex-row">
                    {" "}
                    {getRoleName(idrol)}
                    {getSubunidadName(idsubuni)}{" "}
                  </p>
                ) : (
                  <Skeleton className="h-4 w-full bg-slate-700 " />
                )}
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
            <Roles idRol={idrol} idSubUnidad={idsubuni} dni={dni} />
            <Perfil name={name} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
