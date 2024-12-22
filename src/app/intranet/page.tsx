"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {API_LOGIN, API_LOGIN_UNIQUE} from "@/config/apiconfig";
import Image from 'next/image'
interface Subunidad {
  id_subuni: number;
  n_subuni: string;
}
interface Role {
  id_rol: number;
  n_rol: string;
}
interface User {
  n_usu: string;
  dni: string;
  rol_id: number;
  subunidad_id_subuni: number;
  rol: Role;
  sub_uni: Subunidad;
}
interface LoginResponse {
  token: string;
  users: User[];
  message: string;
  error?: string;
  admin: boolean;
}
interface RoleProps {
  title: string;
  subtitle: string;
  onClick: () => void;
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
  const [admin, setAdmin] = useState<boolean | null>(null);
  const router = useRouter();

 
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
        
        if(data.admin){
            localStorage.setItem("token", data.token);
            setAdmin(true);
            return;
        } else {
          setUserRoles(data.users); // Actualiza roles de usuario normal
        } 
      } else {
        setError("Usuario no encontrado.");
        //console.warn("Usuario no encontrado.");
      }
    } catch (error: any) {
      setError("Error al logearse");
      //console.error("Error al logearse", error);
    }

  };

  const handleRoleSelection = async (user: User) => {
    setError(null); // Limpia errores previos
    try {
      const response = await fetch(API_LOGIN_UNIQUE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          n_usu: user.n_usu,
          dni: user.dni,
          rol_id: user.rol_id,
          subunidad_id_subuni: user.subunidad_id_subuni,
        }),
      });
  
      if (response.ok) {
        const data: LoginResponse = await response.json();
        localStorage.setItem("token", data.token);
        router.push(`/intranet/${user.dni}/${user.rol_id}/${user.subunidad_id_subuni}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al seleccionar el rol");
      }
    } catch (error: any) {
      setError("Error al comunicarse con la API");
    }
  };

  useEffect(() => {
    if (admin) {
      router.push(`/intranet/privilegios`);
    }
  }, [admin, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      {userRoles.length > 0 ? (
        // Mostrar tarjetas de roles normales
        <div className="w-[50%] space-y-8">
          <h2 className="text-2xl font-bold">Selecciona un Rol y Subunidad</h2>
          <div className="grid grid-cols-3 gap-4">
            {userRoles.map((user, index) => (
              <RoleCard
                key={`${user.dni}-${user.rol_id}-${user.subunidad_id_subuni}`}
                title={user.rol.n_rol}
                subtitle={user.sub_uni.n_subuni}
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
              width={80}
              height={80}
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

