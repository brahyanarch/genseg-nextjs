'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter } from 'next/navigation'


export default function ConfiguradorPlantillaCertificado() {
  const [titulo, setTitulo] = useState('Certificado de Participación')
  const [colorFondo, setColorFondo] = useState('#ffffff')
  const [colorTexto, setColorTexto] = useState('#000000')
  const [fuente, setFuente] = useState('Arial')
  const [tamanoTitulo, setTamanoTitulo] = useState(32)
  const router = useRouter();
  
  const guardarConfiguracion = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Configuración guardada:', { titulo, colorFondo, colorTexto, fuente, tamanoTitulo })
    redirigir();
  }

  const redirigir = () => {
    router.back();
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Configurar Plantilla de Certificado</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Opciones de Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título del Certificado</Label>
              <Input 
                id="titulo" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="colorFondo">Color de Fondo</Label>
              <Input 
                id="colorFondo" 
                type="color" 
                value={colorFondo} 
                onChange={(e) => setColorFondo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="colorTexto">Color de Texto</Label>
              <Input 
                id="colorTexto" 
                type="color" 
                value={colorTexto} 
                onChange={(e) => setColorTexto(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fuente">Fuente</Label>
              <Select onValueChange={setFuente} defaultValue={fuente}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tamanoTitulo">Tamaño del Título</Label>
              <Slider
                id="tamanoTitulo"
                min={16}
                max={48}
                step={1}
                value={[tamanoTitulo]}
                onValueChange={(value) => setTamanoTitulo(value[0])}
              />
              <span className="text-sm text-gray-500">{tamanoTitulo}px</span>
            </div>
            <Button onClick={guardarConfiguracion}>Guardar Configuración</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              style={{
                backgroundColor: colorFondo,
                color: colorTexto,
                fontFamily: fuente,
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <h2 style={{ fontSize: `${tamanoTitulo}px`, marginBottom: '20px' }}>{titulo}</h2>
              <p style={{ fontSize: '18px' }}>Nombre del Participante</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>Ha completado satisfactoriamente el curso</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>Nombre del Curso</p>
              <p style={{ fontSize: '14px', marginTop: '20px' }}>Fecha: DD/MM/AAAA</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

