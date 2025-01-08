'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { API_PROJECTS } from "@/config/apiconfig";
import Swal from 'sweetalert2';
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbItemType } from "@/tipos/typos";
/// Interface escuela profesional


const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.ms-excel'
];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB en bytes

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export default function ProjectForm() {
  /// Variables importantes
  const [escuelaProfesional, setEscuelaProfesional] = useState<string>("");
  const [planProyecto, setPlanProyecto] = useState<File | null>(null);
  const { idrol, idsubuni, dni } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // State to manage uploading status
  const [progress, setProgress] = useState(0); // State to manage upload progress

  //// Funciones importantes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);

    if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError("El archivo debe ser PDF, Word o Excel.");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("El archivo no debe superar los 20 MB.");
        return;
      }

      setPlanProyecto(selectedFile);
    }
  };

  const handleNewProyect = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!planProyecto) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", planProyecto);
    formData.append("dni", String(dni));
    formData.append("id_rol", String(idrol));
    formData.append("subunidad", String(idsubuni));
    formData.append("idpe", String(escuelaProfesional));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_PROJECTS, true);

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
        if (resIdProject.idproj !== undefined) {
          router.push(`${pathname}/${resIdProject.idproj}`);
        }
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
      setIsUploading(false);
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
      setIsUploading(false);
    };

    xhr.send(formData);
  };



  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };

  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'proyectos');
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');

  //definimos valores para el breadCrumb
  const breadcrumbData:BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}`},
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "page", label: "Insertar proyecto" },
  ];

  return (
    <div className="flex-1 bg-background py-4 pl-4 text-black dark:text-white">
      
      <div className="flex gap-4 px-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>
      <div className="w-full flex flex-col items-center space-y-8">
        <div className="w-[80%] max-w-2xl bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
            Insertar Proyecto
          </h1>
          <div className="space-y-4">
            {/* Insertar Plan */}
            <div>
              <label className="text-lg font-medium mb-2 block text-gray-700 dark:text-gray-300">
                Insertar el plan
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                ref={fileInputRef}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Seleccionar archivo
              </Button>
              {planProyecto && (
                <div className="space-y-2">
                  <p>Archivo seleccionado: {planProyecto.name}</p>
                  <p>Tamaño: {formatFileSize(planProyecto.size)}</p>
                  <div className="space-y-1">
                    <Progress value={(planProyecto.size / MAX_FILE_SIZE) * 100} />
                    <p className="text-sm text-gray-500">
                      {formatFileSize(planProyecto.size)} / {formatFileSize(MAX_FILE_SIZE)}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Solo se permiten formatos: <strong>PDF, Excel, Word</strong>. Tamaño máximo: <strong>20MB</strong>.
              </p>
            </div>
          </div>

          {/* Botón Crear Proyecto */}
          <form
            onSubmit={handleNewProyect}
            className="mt-6 flex justify-center"
          >
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full max-w-sm py-3 h-12 font-semibold"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Subiendo..." : "Crear Proyecto"}
            </Button>
          </form>
          {isUploading && (
            <div className="space-y-2 mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">{progress}% completado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
