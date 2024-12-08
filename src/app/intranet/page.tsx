"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  API_ROLES,
  API_SUBUNIDADES,
  API_LOGIN,
  API_ADMIN,
} from "@/config/apiconfig";
import Image from 'next/image'
interface User {
  dni: string;
  rol_id: number;
  subunidad_id_subuni: number;
}

interface LoginResponse {
  token: string;
  users: User[];
  message: string;
  error?: string;
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

interface RoleProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

type Admin = {
  id: number;
  usuario: string;
}

function RoleCard({ title, subtitle, onClick }: RoleProps) {
  return (
    <Card
      className="w-48 h-48 bg-gray-900 text-white flex flex-col items-center justify-between cursor-pointer hover:bg-slate-700"
      onClick={onClick}
    >
      <CardContent className="text-center p-4">
        <div className="text-4xl font-bold text-green-500 mb-4">M</div>
        <div className="text-sm">{title}</div>
        <div className="text-blue-400 text-xs mt-1">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

const RoleSelectionPage: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<User[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [subunidades, setSubunidades] = useState<Subunidad[]>([]);
  const router = useRouter();

  // Fetch roles y subunidades al cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, subunidadesRes] = await Promise.all([
          fetch(API_ROLES),
          fetch(API_SUBUNIDADES),
        ]);

        setRoles(await rolesRes.json());
        setSubunidades(await subunidadesRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Buscar en la API de usuarios normales
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          password: password,
        }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        console.log("Usuario encontrado en usuarios normales:", data.token);

        localStorage.setItem("token", data.token);
        if(data.message === "admin" )
        {
          const dataAdmin: Admin = await response.json();
          setAdmin(dataAdmin);
        }
        else {
          setUserRoles(data.users); // Actualiza roles de usuario normal
        }
        
        return;
      } else {
        console.warn("Usuario no encontrado en API de usuarios normales.");
      }
    } catch (error) {
      console.error("Error al buscar en la API de usuarios normales:", error);
    }

    // Si no hay roles normales, buscar en la API de administradores
    try {
      const responseAdmin = await fetch(API_ADMIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          password: password,
        }),
      });

      if (responseAdmin.ok) {
        const dataAdmin: Admin = await responseAdmin.json();
        console.log("Usuario encontrado en administradores:", dataAdmin);

        setAdmin(dataAdmin); // Guardar datos del administrador
        localStorage.setItem("adminId", String(dataAdmin.id));
        return;
      } else {
        console.warn("Usuario no encontrado en API de administradores.");
      }
    } catch (error) {
      console.error("Error al buscar en la API de administradores:", error);
    }

    // Si no se encuentran datos en ambas APIs
    setError("Usuario no encontrado en ambas APIs.");
  };

  const handleRoleSelection = (user: User) => {
    router.push(`/intranet/${user.dni}/${user.rol_id}/${user.subunidad_id_subuni}`);
  };

  const getRoleName = (rol_id: number) =>
    roles.find((role) => role.id_rol === rol_id)?.n_rol || "Rol desconocido";

  const getSubunidadName = (subunidad_id: number) =>
    subunidades.find((sub) => sub.id_subuni === subunidad_id)?.n_subuni || `Subunidad ${subunidad_id}`;

  // Redirigir directamente si es administrador
  useEffect(() => {
    if (admin) {
      //router.push(`/admin/dashboard/${admin.id}`);
      router.push(`/intranet/privilegios`);
    }
  }, [admin, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      {userRoles.length > 0 ? (
        // Mostrar tarjetas de roles normales
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-2xl font-bold">Selecciona un Rol y Subunidad</h2>
          <div className="grid grid-cols-3 gap-4">
            {userRoles.map((user) => (
              <RoleCard
                key={`${user.dni}-${user.rol_id}-${user.subunidad_id_subuni}`}
                title={getRoleName(user.rol_id)}
                subtitle={getSubunidadName(user.subunidad_id_subuni)}
                onClick={() => handleRoleSelection(user)}
              />
            ))}
          </div>
        </div>
      ) : (
        // Formulario de inicio de sesión
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image
              alt="Logo"
              className="h-24 w-24 rounded-full bg-white"
              src={"/resources/images/DPSEClogo.png"}
            />
            <h2 className="mt-6 text-3xl font-bold">INICIAR SESIÓN</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                required
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700"
                placeholder="Nombre de usuario"
              />
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full py-2 bg-blue-600">
              Iniciar Sesión
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default RoleSelectionPage;

