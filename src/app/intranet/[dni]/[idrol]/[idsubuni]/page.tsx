"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import NavIntranet from "@/components/ComponentsIntranet/navIntranet";
import { API_ROLES, API_SUBUNIDADES, API_USERS } from "@/config/apiconfig";
import MenuBody from "@/components/ComponentsIntranet/menuBody";
import { User } from "@/tipos/typos";
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
  const [User, setUser] = useState<User[]>([]);

  
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
  const fetchUs = async () => {
    try {
      const response = await fetch(`${API_USERS}/${dni}`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setUser(data);
      } else {
        console.error('Respuesta de API no válida:', data);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // Fetch de roles y subunidades
  useEffect(() => {
    fetchUs();
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
console.log(User);

    //fetchData();
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
          <MenuBody idrol={Number(idrol)} idsubuni={Number(idsubuni)} dni={dni.toString()} name={User[0]?.n_usu || 'K'}/> 

        </>
      )}
    </div>
  );
};

export default PrivilegiosPage;
