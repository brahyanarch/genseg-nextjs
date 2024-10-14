"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {Skeleton} from "@/components/ui/skeleton"
//import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import {
  API_ROLES_WITH_DNI,
  apiRolesWithDni,
  API_ROLES,
  API_SUBUNIDADES,
} from "@/config/apiconfig";

interface Rol {
  dni: string;
  n_usu: string;
  estado: boolean;
  rol_id: number; // Cambio aquí
  subunidad_id_subuni: number; // Cambio aquí
}

interface RolesProps {
  id_rolActive?: number;
  id_subActive?: number;
  dni?: string;
}

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

const Roles: React.FC<RolesProps> = ({
  id_rolActive,
  id_subActive,
  dni,
}: RolesProps) => {
  const [error, setError] = useState<string | null>(null);
  const [nombreRoles, setNombreRoles] = useState<Role[]>([]);
  const [subunidades, setSubunidades] = useState<Subunidad[]>([]);
  const [rolesUser, setRolesUser] = useState<Rol[]>([]);
  const router = useRouter();
  // Obtener el nombre del rol por su ID
  const getRoleName = (rol_id: number) => {
    const role = nombreRoles.find((r) => r.id_rol === rol_id);
    //return role ? role.n_rol : `Rol ${rol_id}`;
    return role ? role?.n_rol : (<div className="">
              <Skeleton className="h-4 w-full bg-slate-700" />
    </div>)
  };

  // Obtener el nombre de la subunidad por su ID
  const getSubunidadName = (subunidad_id: number | undefined) => {
    const subunidad = subunidades.find((s) => s.id_subuni === subunidad_id);
    return subunidad ? subunidad.n_subuni : `Subunidad ${subunidad_id}`;
  };
  console.log(dni);
  const fetchRoleswithDNI = async () => {
    try {
      console.log(apiRolesWithDni(API_ROLES_WITH_DNI, dni));
      const response = await fetch(apiRolesWithDni(API_ROLES_WITH_DNI, dni));
      const data: Rol[] = await response.json();
      setRolesUser(data);
      console.log("Data fetched:", data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(API_ROLES);
      const data: Role[] = await response.json();
      setNombreRoles(data);
    } catch (error) {
      setError("Error fetching roles");
      console.error("Error fetching roles:", error);
    }
  };

  const fetchSubunidades = async () => {
    try {
      const response = await fetch(API_SUBUNIDADES);
      const data: Subunidad[] = await response.json();
      setSubunidades(data);
    } catch (error) {
      setError("Error fetching subunidades");
      console.error("Error fetching subunidades:", error);
    }
  };
  // Función para manejar el clic en los roles (excepto el activo)
  const handleClick = (role: Rol) => {
    if (
      role.rol_id === id_rolActive &&
      role.subunidad_id_subuni === id_subActive
    )
      return;
    // Redirigir a otra página (puedes ajustar la ruta según tu estructura)
    router.push(`/intranet/${dni}/${role.rol_id}/${role.subunidad_id_subuni}`);
  };

  useEffect(() => {
    fetchRoles();
    fetchSubunidades();
    fetchRoleswithDNI();
  }, []);

  return (
    <div className="absolute right-2 z-10 top-12 w-[300px] bg-gray-900 text-white rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Roles</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {rolesUser?.map((role, index) => {
              const isActive =
                role.rol_id === id_rolActive &&
                role.subunidad_id_subuni === id_subActive;

              return (
                <div
                  key={index}
                  onClick={() => handleClick(role)}
                  className={`flex flex-col items-center p-2 ${
                    isActive
                      ? "bg-gray-800 hover:bg-slate-600 hover:text-slate-500 text-white cursor-default" // Estilo para el activo
                      : "bg-gray-800 hover:bg-gray-700 cursor-pointer" // Estilo para los que se pueden hacer clic
                  } rounded-lg`}
                >
                  <div
                    className={`w-8 h-8 ${
                      isActive ? "bg-yellow-500" : "bg-green-700"
                    } rounded-full flex items-center justify-center mb-2`}
                  >
                    <span className="text-sm font-bold">M</span>
                  </div>
                  <span className="text-xs text-center text-blue-700">
                    {getSubunidadName(role.subunidad_id_subuni)}
                  </span>
                  <span className="text-xs text-center">
                    {getRoleName(role.rol_id)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default Roles;
