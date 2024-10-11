"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import NavIntranet from "@/components/navIntranet";


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
  const router = useRouter();
  // Obtener los parámetros de la URL: idrol e idsubuni
  const { idrol, idsubuni, dni } = useParams();
  const [isClient, setIsClient] = useState(false);
  
  const getRoleName = (rol_id: number) => {
    const role = roles.find((r) => r.id_rol === rol_id);
    return role ? role.n_rol : `Rol ${rol_id}`;
  };

  // Obtener el nombre de la subunidad por su ID
  const getSubunidadName = (subunidad_id: number) => {
    const subunidad = subunidades.find((s) => s.id_subuni === subunidad_id);
    return subunidad ? subunidad.n_subuni : `Subunidad ${subunidad_id}`;
  };
  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/roles");
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchSubunidades = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/subunidad");
        const data: Subunidad[] = await response.json();
        setSubunidades(data);
      } catch (error) {
        console.error("Error fetching subunidades:", error);
      }
    };

    fetchRoles();
    fetchSubunidades();
  }, []);

  useEffect(() => {
    // Asegurarse de que el componente está montado en el cliente
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // No renderiza nada en el servidor
  }
  const idrolInt = +idrol;
  const idsubuniInt = +idsubuni;

  return (
    <div>
      <h1>Privilegios</h1>
      {/* Imprimir idrol y idsubuni en h1 */}
      <h1>Rol ID: {getRoleName(idrolInt)}</h1>
      <h1>Subunidad ID: {getSubunidadName(idsubuniInt)}</h1>

      <NavIntranet idRol={idrolInt} idSubUnidad={idsubuniInt} dni={dni.toString()} />
    </div>
  );
};

export default PrivilegiosPage;
