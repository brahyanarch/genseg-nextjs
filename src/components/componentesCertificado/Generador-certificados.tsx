'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Certificado {
  nombre: string
  curso: string
  fecha: string
}

export default function GeneradorCertificados() {
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [nombre, setNombre] = useState('')
  const [curso, setCurso] = useState('')
  const [fecha, setFecha] = useState('')

  const generarCertificado = () => {
    const nuevoCertificado: Certificado = { nombre, curso, fecha }
    setCertificados([...certificados, nuevoCertificado])
    // Aquí podrías agregar lógica para guardar o imprimir el certificado
  }

  const generarCertificadosMasivos = (cantidad: number) => {
    const nuevosCertificados = Array.from({ length: cantidad }, (_, i) => ({
      nombre: `Participante ${i + 1}`,
      curso,
      fecha
    }))
    setCertificados([...certificados, ...nuevosCertificados])
    // Aquí podrías agregar lógica para guardar o imprimir los certificados en masa
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generador de Certificados</h1>
      <div className="grid gap-4 mb-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del participante" />
        </div>
        <div>
          <Label htmlFor="curso">Curso</Label>
          <Input id="curso" value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Nombre del curso" />
        </div>
        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-4 mb-8">
        <Button onClick={generarCertificado}>Generar Certificado Individual</Button>
        <Button onClick={() => generarCertificadosMasivos(10)}>Generar 10 Certificados</Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {certificados.map((cert, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle>Certificado</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Nombre:</strong> {cert.nombre}</p>
              <p><strong>Curso:</strong> {cert.curso}</p>
              <p><strong>Fecha:</strong> {cert.fecha}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

