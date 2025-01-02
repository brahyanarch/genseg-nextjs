'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';

interface ImageItemProps {
  index: number;
  filename: string;
  size: string;
  timestamp: string;
  imageUrl: string;
  onFileChange: (index: number, file: File | null) => void;
}

function ImageItem({
  index,
  filename,
  size,
  timestamp,
  imageUrl,
  onFileChange
}: ImageItemProps) {
  // Cada imagen maneja su propio estado
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    onFileChange(index, file); // Pasamos el archivo seleccionado al componente principal
  };

  return (
    <Card className="bg-slate-900 text-slate-100 border-slate-800">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <FileImage className="h-4 w-4" />
          <span>{filename}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{size}</span>
          <span>|</span>
          <span>{timestamp}</span>
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
        {imageFile && (
          <div className="mt-2 text-sm">
            <p>{imageFile.name}</p>
            <p>{(imageFile.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

const ImageGallery: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([]); // Almacena los archivos seleccionados

  const handleFileChange = (index: number, file: File | null) => {
    const updatedImages = [...selectedImages];
    updatedImages[index] = file; // Actualiza la imagen seleccionada en su índice correspondiente
    setSelectedImages(updatedImages);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      if (image) formData.append('files', image); // Solo agrega las imágenes válidas
    });

    try {
      const response = await fetch('/api/upload-all', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        alert('Imágenes subidas exitosamente.');
        setSelectedImages([]); // Resetear las imágenes
      } else {
        alert('Error al subir las imágenes.');
      }
    } catch (error) {
      console.error('Error al subir las imágenes:', error);
      alert('Error al subir las imágenes.');
    }
  };

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

  return (
    <div className="p-4 bg-slate-950 min-h-screen">
      <h1 className="text-xl font-bold text-slate-100 mb-6">Subir y previsualizar imágenes</h1>
      
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
