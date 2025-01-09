"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, ArrowUpDown } from 'lucide-react';
import { API_URL } from '@/config/apiconfig';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { BreadcrumbWithDropdown } from '@/components/breadcrumb';
import { BreadcrumbItemType } from '@/tipos/typos';

interface ImageItemProps {
  index: number;
  filename: string;
  size: string;
  timestamp: string;
  imageUrl: string;
  onFileChange: (index: number, file: File | null) => void;
  onTitleChange: (index: number, title: string) => void;
  onDescChange: (index: number, desc: string) => void;
}

function ImageItem({
  index,
  filename,
  size,
  timestamp,
  imageUrl,
  onFileChange,
  onTitleChange,
  onDescChange
}: ImageItemProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    onFileChange(index, file);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    onTitleChange(index, value);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    onDescChange(index, value);
  };

  return (
    <Card className="bg-slate-900 text-slate-100 border-slate-800">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <FileImage className="h-4 w-4" />
          <span>{imageFile && (imageFile.name)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{imageFile ? (imageFile.size / 1024).toFixed(2): size} KB</span>
          <span>|</span>
          <span>{imageFile ? (imageFile.type):timestamp}</span>
        </div>
        <div className="relative aspect-video mt-2 overflow-hidden rounded-sm">
          <Image
            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
            alt={filename}
            className="object-cover w-full h-full"
            width={200}
            height={100}
          />
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <input
          type="file"
          id={`fileInput-${filename}`}
          className="hidden"
          onChange={handleChange}
        />
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-950"
          onClick={() => document.getElementById(`fileInput-${filename}`)?.click()}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Cambiar imagen
        </Button>
      </CardFooter>
      <CardContent className="p-4 space-y-4">
        <div>
          <label
            htmlFor={`title-input-${index}`}
            className="block text-sm font-medium text-slate-300"
          >
            Título
          </label>
          <input
            type="text"
            id={`title-input-${index}`}
            value={title}
            onChange={handleTitleChange}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 text-slate-200 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ingresa el título"
          />
        </div>

        <div>
          <label
            htmlFor={`desc-input-${index}`}
            className="block text-sm font-medium text-slate-300"
          >
            Descripción
          </label>
          <textarea
            id={`desc-input-${index}`}
            cols={30}
            rows={5}
            placeholder="Escribe la descripción"
            value={description}
            onChange={handleDescChange}
            className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-800 text-slate-200 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
      </CardContent>

    </Card>
  );
}

const ImageGallery: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [datos, setDatos] = useState([]);
  //navegación
  const pathname = usePathname();
  const handleFileChange = (index: number, file: File | null) => {
    const updatedImages = [...selectedImages];
    updatedImages[index] = file;
    setSelectedImages(updatedImages);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = title;
    setTitles(updatedTitles);
  };

  const handleDescChange = (index: number, desc: string) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = desc;
    setDescriptions(updatedDescriptions);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    // Adjuntar las imágenes al FormData como un array llamado 'files'
    selectedImages.forEach((file) => {
      if (file) {
        formData.append('files', file); // 'files' es el nombre que Multer procesará
      }
    });

    titles.forEach((title, index) => {
      formData.append(`title${index + 1}`, title);
    });

    descriptions.forEach((description, index) => {
      formData.append(`desc${index + 1}`, description);
    });

    try {
      const response = await fetch(`${API_URL}/api/carrusel`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        alert('Imágenes subidas exitosamente.');
        Swal.fire({
          title: 'Datos guardados correctamente',
          text: 'Imágenes subidas exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
          },
        });
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        setSelectedImages([]);
        setTitles([]);
        setDescriptions([]);
      } else {
        Swal.fire({
          title: 'Error al guardar las imágenes.',
          text: 'Hubo un problema al intentar guardar las imágenes.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
          },
        });
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      }
    } catch (error) {
           Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Error al conectar con la API. ${error.message}`,
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
              },
            });
    }
  };
  const getDateCarrusel = async () =>{
    const res = await fetch(`${API_URL}/api/carrusel`);
    const data = await res.json();
    setDatos(data);

  }
  useEffect(() => {
    getDateCarrusel();
  },[]);

  const images = [
    {
      filename: 'Image 1',
      size: '768 kb',
      timestamp: '21st Dec, 12:56 PM',
      imageUrl: '/resources/images/53.png',
    },
    {
      filename: 'Image 2',
      size: '512 kb',
      timestamp: '22nd Dec, 10:30 AM',
      imageUrl: '/resources/images/54.png',
    },
    {
      filename: 'Image 3',
      size: '1 MB',
      timestamp: '23rd Dec, 03:20 PM',
      imageUrl: '/resources/images/55.png',
    },
    {
      filename: 'Image 4',
      size: '256 kb',
      timestamp: '24th Dec, 06:45 PM',
      imageUrl: '/resources/images/56.png',
    },
  ];
  //
    ///recortar rutas
    const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
      const partes = ruta.split('/'); // Divide la ruta en partes
      const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
      if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
      return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
    };
    //recortamos las rutas requeridas
    const inicio = recortarRutaHastaSegmento(pathname, 'intranet');
    //definimos valores para el breadCrumb
    const breadcrumbData: BreadcrumbItemType[] = [
      { type: "link", label: "Inicio", href: `${inicio}/privilegios` },
      { type: "page", label: "Pagina" },
      { type: "page", label: "Carrusel" },
    ];

  return (
    <div className="p-4  min-h-screen">
      <div className="flex gap-4 items-center mx-auto text-sm text-gray-900 breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100  mb-6 text-center">Subir y previsualizar imágenes del carrusel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {images.map((image, index) => (
          <ImageItem
            key={index}
            index={index}
            filename={image.filename}
            size={image.size}
            timestamp={image.timestamp}
            imageUrl={image.imageUrl}
            onFileChange={handleFileChange}
            onTitleChange={handleTitleChange}
            onDescChange={handleDescChange}
          />
        ))}
      </div>

      {selectedImages.length > 0 && (
        <Button
          onClick={handleUpload}
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          Subir imágenes
        </Button>
      )}
    </div>
  );
};

export default ImageGallery;
