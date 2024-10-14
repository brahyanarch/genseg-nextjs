"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { API_ROLES, API_SUBUNIDADES,API_LOGIN } from "@/config/apiconfig";

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
  onClick: () => void; // Añadir esta propiedad
}

function RoleCard({ title, subtitle, onClick }: RoleProps) {
  return (
    <Card
      className="w-48 h-48 bg-gray-900 text-white flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700"
      onClick={onClick} // Maneja el evento onClick
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
  const [roles, setRoles] = useState<Role[]>([]);
  const [subunidades, setSubunidades] = useState<Subunidad[]>([]);
  const router = useRouter();

  // Fetch roles y subunidades cuando se carga la página
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(API_ROLES);
        const data: Role[] = await response.json();
        setRoles(data);
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

    fetchRoles();
    fetchSubunidades();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    try {
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

      const data: LoginResponse = await response.json();
      console.log(data.token);

      if (response.ok) {
        // Guarda el token en localStorage
        localStorage.setItem("token", data.token);
        console.log("Inicio de sesión exitoso");

        // Actualiza la lista de roles y subunidades del usuario
        setUserRoles(data.users);
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.log("Error al conectarse con el servidor");
      setError("Error de conexión con el servidor");
    }
  };

  const handleRoleSelection = (dni: String, rol_id: number, subunidad_id_subuni: number) => {
    // Redirigir a la página seleccionada con el rol y subunidad elegidos
    console.log(rol_id, subunidad_id_subuni)
    router.push(`/intranet/${dni}/${rol_id}/${subunidad_id_subuni}`);
  };

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      {userRoles.length === 0 ? (
        // Si no hay roles todavía, mostrar el formulario de inicio de sesión
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center ">
            <div className="bg-white rounded-full">
              <img
                alt="Logo"
                className="h-24 w-24"
                src="/resources/images/DPSEClogo.png"
              />
            </div>
            <h2 className="mt-6 text-3xl font-bold">INICIAR SESIÓN</h2>
          </div>
          <hr />
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="cuenta" className="sr-only">Cuenta</label>
                <div className="relative">
                  <input
                    id="cuenta"
                    type="text"
                    required
                    onChange={(e) => setUsuario(e.target.value)}
                    className="appearance-none rounded-md w-full px-3 py-2 pl-10 border border-gray-700 placeholder-gray-500 text-white bg-gray-800"
                    placeholder="Nombre de usuario"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md w-full px-3 py-2 pl-10 border border-gray-700 placeholder-gray-500 text-white bg-gray-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full py-2 bg-blue-600">Iniciar Sesión</Button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        // Si ya hay roles disponibles, mostrar las opciones en RoleCard
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-2xl font-bold">Selecciona un Rol y Subunidad</h2>
          <div className="grid grid-cols-3 gap-4 m-[-80px]">
            {userRoles.map((user, index) => (
              <RoleCard
                key={index}
                title={getRoleName(user.rol_id)}
                subtitle={getSubunidadName(user.subunidad_id_subuni)}
                onClick={() => handleRoleSelection(user.dni, user.rol_id, user.subunidad_id_subuni)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionPage;
