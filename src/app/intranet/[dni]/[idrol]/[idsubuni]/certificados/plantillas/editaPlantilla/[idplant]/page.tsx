'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
//import { useToast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import {API_URL} from '@/config/apiconfig'
import { useParams, usePathname, useRouter } from "next/navigation"; // Para obtener parámetros de la URL
import Swal from 'sweetalert2'

const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 20 MB en bytes

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export default function ConfiguradorPlantillaCertificado() {
  const [imagenFondo, setImagenFondo] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()
  const [imagenPlantilla, setImagePlantilla] = useState<File | null>(null);
  const { idrol, idsubuni, dni } = useParams();
  const [nombre, setNombre] = useState<string>(""); 
  const [progress, setProgress] = useState(0); // State to manage upload progress
  const pathname = usePathname();
  const router = useRouter();

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const imageUrl = URL.createObjectURL(file)
      setImagenFondo(imageUrl)
    }
  }

  const handleFileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    
    if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError("El archivo debe ser jpg, jpeg y png.");
        return;
      }
      
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("El archivo no debe superar los 5 MB.");
        return;
      }
      if (selectedFile) {
        const file = selectedFile;
        setSelectedFile(file)
        const imageUrl = URL.createObjectURL(file)
        setImagenFondo(imageUrl)
      }
      setImagePlantilla(selectedFile);
    }
  };

  const guardarPlantilla = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    
    try {
      //setIsUploading(true);
      setProgress(0);
      setIsLoading(true);
      const formData = new FormData()
      formData.append('file', selectedFile);
      formData.append('idsubunidad', idsubuni.toString());
      formData.append('nombre', nombre);
      /*const response = await fetch(`${API_URL}/api/plantilla`, {
        method: 'POST',
        body: formData,
      })*/
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/plantilla`, true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
            if (xhr.status === 201) {
              const resIdProject = JSON.parse(xhr.responseText);
              Swal.fire({
                icon: 'success',
                title: 'Proyecto creado exitosamente',
                text: 'El proyecto fue creado correctamente.',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
                },
              });
              router.back();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Proyecto no creado',
                text: 'Hubo un problema al crear el Proyecto.',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
                },
              });
            }
          };
    xhr.onerror = () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al conectar con la API.',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
    
            },
          });
          setIsLoading(false);
        };
    
        xhr.send(formData);
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value); // Actualiza el estado con el valor del input
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Configurar Plantilla de Certificado</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
        <Input type="text" placeholder="Nombre de la plantilla"  
        value={nombre} // Vincula el valor del input al estado
        onChange={handleTitle} // Actualiza el estado al cambiar
        />
          <CardHeader>
            <CardTitle>Subir Plantilla</CardTitle>
          </CardHeader>
          {selectedFile && (
                <div className="space-y-2">
                  <p>Archivo seleccionado: {selectedFile.name}</p>
                  <p>Tamaño: {formatFileSize(selectedFile.size)}</p>
                  <div className="space-y-1">
                  <Progress value={(selectedFile.size / MAX_FILE_SIZE) * 100} />
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)} / {formatFileSize(MAX_FILE_SIZE)}
                    </p>
                  </div>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="imagen">Imagen de Plantilla</Label>
              <Input 
                id="imagen" 
                type="file" 
                accept="image/*"
                onChange={handleFileImageChange}
              />
            </div>
            <Button 
              onClick={guardarPlantilla} 
              disabled={!selectedFile || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Plantilla'
              )}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
              {selectedFile ? (
                <Image
                  src={imagenFondo || "/placeholder.svg"}
                  alt="Vista previa del certificado"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sube una imagen para ver la vista previa
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

