"use client";
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LockIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  token: string;
  error?: string;
}

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Inicializar el hook useRouter
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST", // Cambiado a POST para enviar los datos
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          password: password,
        }), // Aquí se envían el usuario y la contraseña
      });

      const data: LoginResponse = await response.json();
      console.log(data.token);

      if (response.ok) {
        // Si el inicio de sesión es exitoso, guarda el token en localStorage
        localStorage.setItem("token", data.token);
        console.log("Inicio de sesión exitoso");

        // Redirigir a otra página después del inicio de sesión exitoso
        router.push("/intranet/privilegios"); // Reemplaza '/dashboard' con la ruta que desees
      } else {
        // Manejar errores de respuesta
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.log("Error al conectarse con el servidor");
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-300">
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
              <label htmlFor="cuenta" className="sr-only">
                Cuenta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="cuenta"
                  name="cuenta"
                  type="text"
                  required
                  onChange={(e) => setUsuario(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Annette Black"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-400"
            >
              Recordar contraseña
            </label>
          </div>
          <Button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Iniciar Sesión
          </Button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;