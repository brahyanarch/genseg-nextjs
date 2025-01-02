'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface Anuncio {
  titulo: string
  detalle: string
  fecha: Date
}

export default function ConfiguradorAnuncio() {
  const [anuncio, setAnuncio] = useState<Anuncio>({
    titulo: '',
    detalle: '',
    fecha: new Date()
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAnuncio(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setAnuncio(prev => ({ ...prev, fecha: date }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Anuncio guardado:', {
      ...anuncio,
      fecha: anuncio.fecha.toLocaleDateString('es-ES')
    })
  }

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('es-ES', options)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10  border-2 border-gray-900 bg-white dark:bg-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100  transition-colors duration-200">
      <CardHeader className="bg-gray-100 dark:bg-gray-800 rounded-t-lg transition-colors duration-200">
        <CardTitle className="text-2xl font-bold">Configurar Anuncio</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm font-semibold">Título Principal</Label>
            <Input
              id="titulo"
              name="titulo"
              value={anuncio.titulo}
              onChange={handleInputChange}
              placeholder="Aviso Importante"
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detalle" className="text-sm font-semibold">Detalle del Aviso</Label>
            <Textarea
              id="detalle"
              name="detalle"
              value={anuncio.detalle}
              onChange={handleInputChange}
              placeholder="Escriba aquí los detalles del anuncio..."
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 min-h-[100px] dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha" className="text-sm font-semibold">Fecha de Publicación/Modificación</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  id="fecha"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {formatDate(anuncio.fecha)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={anuncio.fecha}
                  onSelect={handleDateChange}
                  initialFocus
                  className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Guardar Anuncio
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

