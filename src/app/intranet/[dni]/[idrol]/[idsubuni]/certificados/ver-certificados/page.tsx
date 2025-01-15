//import GeneradorCertificadosAPI from '@/components/componentesCertificado/'
"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GeneradorCertificadosAPI() {
  const [nombre, setNombre] = useState("");
  const [curso, setCurso] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);

  const generarCertificado = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, curso, fecha }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${nombre}-certificado.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error al generar el certificado");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Generador de Certificados API
        </h1>
        <div className="grid gap-4 mb-4">
          <div>
            <Label  className="text-black dark:text-white" htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del participante"
              className='text-black dark:text-white'
            />
          </div>
          <div>
            <Label htmlFor="curso" className='text-black dark:text-white'>Curso</Label>
            <Input
              id="curso"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              placeholder="Nombre del curso"
              className='text-black dark:text-white'
            />
          </div>
          <div>
            <Label htmlFor="fecha" className='text-black dark:text-white'>Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className='text-black dark:text-white'
            />
          </div>
        </div>
        <Button onClick={generarCertificado} disabled={loading}>
          {loading ? "Generando..." : "Generar Certificado"}
        </Button>
      </div>
    </main>
  );
}
