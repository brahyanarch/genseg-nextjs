"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import NavIntranet from "@/components/ComponentsIntranet/navIntranet";
import { API_ROLES, API_SUBUNIDADES } from "@/config/apiconfig";
import MenuBody from "@/components/ComponentsIntranet/menuBody";
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

const PrivilegiosPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [subunidades, setSubunidades] = useState<Subunidad[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Obtener los parámetros de la URL: idrol, idsubuni, dni
  const { idrol, idsubuni, dni } = useParams();

  // Obtener el nombre del rol por su ID
  const getRoleName = (rol_id: number) => {
    const role = roles.find((r) => r.id_rol === rol_id);
    return role ? role.n_rol : `Rol ${rol_id}`;
  };

  // Obtener el nombre de la subunidad por su ID
  const getSubunidadName = (subunidad_id: number) => {
    const subunidad = subunidades.find((s) => s.id_subuni === subunidad_id);
    return subunidad ? subunidad.n_subuni : `Subunidad ${subunidad_id}`;
  };

  // Fetch de roles y subunidades
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const [rolesResponse, subunidadesResponse] = await Promise.all([
          fetch(API_ROLES),
          fetch(API_SUBUNIDADES),
        ]);

        if (!rolesResponse.ok || !subunidadesResponse.ok) {
          throw new Error("Error fetching data");
        }

        const rolesData: Role[] = await rolesResponse.json();
        const subunidadesData: Subunidad[] = await subunidadesResponse.json();

        setRoles(rolesData);
        setSubunidades(subunidadesData);
      } catch (error) {
        setError("Ocurrió un error al cargar los datos. Por favor, intenta de nuevo.");
        console.error("Error fetching data:", error);
      }
    };

    //fetchData();
  }, []);

  useEffect(() => {
    // Asegurarse de que el componente está montado en el cliente
    setIsClient(true);
  }, []);

  // Validación de cliente para evitar el renderizado en el servidor
  if (!isClient) return null;

  // Validar que DNI esté disponible antes de usarlo
  if (!dni) {
    setError("El DNI no está disponible.");
    return <p>{error}</p>;
  }

  return (
    <div className="w-full">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {/*<NavIntranet idRol={Number(idrol)} idSubUnidad={Number(idsubuni)} dni={dni.toString()} />*/}
          <MenuBody idrol={Number(idrol)} idsubuni={Number(idsubuni)} dni={dni.toString()}/> 

        </>
      )}
    </div>
  );
};

export default PrivilegiosPage;
