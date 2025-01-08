'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import {  useParams, usePathname, useRouter } from "next/navigation"
import { API_FORM, API_ACTIVITIES } from "@/config/apiconfig"
import Swal from 'sweetalert2';
import { BreadcrumbWithDropdown } from "@/components/breadcrumb"
import clsx from "clsx"
export default function ActivityForm() {
  const [questions, setQuestions] = useState<[]>([]);
  ///entradas obligatorios
  const [nombreActividad, setNombreActividad] = useState();
  const [fechaInicio, setFechaInicio] = useState();
  const [fechaFinal, setFechaFinal] = useState();
  const [answers, setAnswers] = useState<{ [key: number]: string | File | number[] }>({}); // Estado para almacenar respuestas
  const [errorForm, setErrorForm] = useState(false);

  const { projectId, dni, idrol, idsubuni } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  // Manejar cambios en las respuestas
  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const handleChangeFile = (id: number, file: File | null) => {

    if (file) {
      setAnswers((prev) => ({ ...prev, [id]: file }));
    }
  };
  /// casos de single choice
  const handleSingleChange = (id: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: [value], // Guarda el ID seleccionado como un array
    }));
  };


  // Manejar cambios para opciones múltiples
  const handleMultipleChoiceChange = (id: number, optionId) => {
    setAnswers((prev) => {
      const currentValues = prev[id] || [];
      const updatedValues = currentValues.includes(optionId)
        ? currentValues.filter((val) => val !== optionId) // Elimina si ya está seleccionado
        : [...currentValues, optionId]; // Agrega si no está seleccionado

      return { ...prev, [id]: updatedValues };
    });
  };
  // Función que valida si todas las preguntas están completas
  const validateForm = () => {
    let isValid = true;
    // Verifica las 3 preguntas fijas
    if (!nombreActividad || !fechaInicio || !fechaFinal) {
      isValid = false;
      return isValid;
    }
    // Verifica las preguntas dinámicas
    questions.forEach((question) => {
      if (!answers[question.id]) {
        isValid = false;
        return isValid;
      }
    });
    return isValid;
  };

  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 2).join('/'); // Toma hasta el segmento + un nivel
  };
  const handleCancelActivity = async () => {
    // Confirmación de SweetAlert antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro de no crear la actividad?',
      text: "No se creará la actividad.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, no crear actividad',
      cancelButtonText: 'No, regresar.',
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded',
      },
    });
    if (result.isConfirmed) {
      const recortada = recortarRutaHastaSegmento(pathname, 'editProyect');
      router.push(recortada);
      // Mostrar un SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Actividad no creada',
        text: 'La actividad no ha sido creada.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        },
      });
    }
  }

  const handleSubmitAnswers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Si el formulario no es válido, muestra los errores
    if (!validateForm()) {
      setErrorForm(true);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la actividad',
        text: 'Rellene todos los campos del formulario',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        },
      });
      console.log(errorForm);
    } else {
      // Si todo está correcto, haz algo con los datos del formulario

      console.log("dentro de la solicitud",errorForm);
      console.log(errorForm);
    // Crear el objeto FormData
    const formData = new FormData();

    // Agregar datos básicos
    formData.append("name", String(nombreActividad)); // Nombre de la actividad
    formData.append("fInit", String(fechaInicio));    // Fecha de inicio
    formData.append("fFin", String(fechaFinal));      // Fecha final
    formData.append("idproj", String(projectId));     // ID del proyecto

    // Crear un objeto para almacenar las respuestas
    const responses = {};

    // Recorrer las respuestas y agregarlas al objeto responses
    Object.entries(answers).forEach(([key, value]) => {
      if (value instanceof File) {
        // Si el valor es un archivo, lo agregamos con el tipo "file"
        responses[key] = "file";
        formData.append(`${key}`, value); // Agregar el archivo al FormData
      } else {
        // Si no es un archivo, simplemente lo agregamos como está
        responses[key] = value;
      }
    });

    // Agregar el objeto de respuestas al FormData como JSON string
    formData.append("responses", JSON.stringify(responses));


    // Enviar la solicitud al backend
    try {
      const response = await fetch(`${API_ACTIVITIES}/${idsubuni}`, {
        method: 'POST',
        body: formData, // Enviar el FormData como cuerpo
      });

      if (response.ok) {
        const resIdProject = await response.json();
        // Mostrar un SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Actividad Creada',
          text: 'La actividad fue creada correctamente.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
          },
        });
        router.back(); // Volver a la ruta anterior
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      } else {
        // Si el servidor no responde correctamente
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la actividad',
          text: 'Rellene todos los campos del formulario correctamente',
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
      // Si ocurre un error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al conectar con la API. ${error}`,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        },
      });
    }
  }
  };


  /// obtener las preguntas del formulario
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_FORM}/${idsubuni}`);
      if (!response.ok) {
        // Si el servidor no responde correctamente
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener las preguntas.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
          },
        });
          
        
      }
      const data = await response.json();
      setQuestions(data);
    } catch (err: any) {
      // Si ocurre un error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al conectar con la API. ${err.message}`,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        },
      });
    } finally {
      console.log("Todo completo");
    }
  };
  ///obtener las preguntas existentes en la base de datos desde la API
  useEffect(() => {
    fetchQuestions();
  }, []);
  //recortamos las rutas requeridas
  const recortarRutaHastaSegmento1 = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  const configuracion = recortarRutaHastaSegmento1(pathname, 'proyectos');
  const inicio = recortarRutaHastaSegmento1(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "link", label: "Editar proyecto", href: `${configuracion}/editProyect/${projectId}` },
    { type: "page", label: "Insertar actividad" },
  ];
  return (
    <div className="min-h-screen bg-background text-black dark:text-white p-6">
      <div className=" flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-lg shadow-xl space-y-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-10">
          Insertar Actividad
        </h1>

        <form className="space-y-6" >
          {/* Nombre de la actividad */}
          <div className="space-y-4">
            <Label htmlFor="activity-name" className="text-lg font-semibold text-gray-900 dark:text-gray-300">
              Nombre de la actividad
            </Label>
            <input
              id="activity-name"
              placeholder="Nombre de la actividad"
              className={clsx(
                "w-full bg-gray-100 dark:bg-gray-800  dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3",
                { "border-red-400 ring-1 ring-red-400": errorForm && !nombreActividad}, // Estilo condicional si el campo está vacío
                { "border-green-400 ring-1 ring-green-400": !errorForm && nombreActividad } // Estilo si el campo está lleno
              )}
              value={nombreActividad}
              onChange={(e) => setNombreActividad(e.target.value)}
              required
            />
          </div>

          {/* Fecha inicial */}
          <div className="space-y-4">
            <Label htmlFor="start-date" className="text-lg font-semibold text-gray-900 dark:text-gray-300">
              Fecha inicial
            </Label>
            <div className="relative">
              <input
                id="start-date"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className={clsx('w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-red-500 px-4 py-3',
                  { "border-red-400 ring-1 ring-red-400": errorForm && !fechaFinal }, // Estilo condicional si el campo está vacío
                  { "border-green-400 ring-1 ring-green-400": !errorForm && fechaInicio } // Estilo si el campo está lleno
                )}
                required
              />
              <p className="text-sm text-red-500 mt-1 invisible peer-invalid:visible">
                Por favor selecciona una fecha.
              </p>
            </div>
          </div>

          {/* Fecha final */}
          <div className="space-y-4">
            <Label htmlFor="end-date" className="text-lg font-semibold text-gray-900 dark:text-gray-300">
              Fecha final
            </Label>
            <div className="relative">
              <input
                id="end-date"
                type="date"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
                className={clsx('w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-red-500 px-4 py-3',
                  { "border-red-400 ring-1 ring-red-400": errorForm && !fechaFinal }, // Estilo condicional si el campo está vacío
                  { "border-green-400 ring-1 ring-green-400": !errorForm && fechaFinal } // Estilo si el campo está lleno
                )}
                required
              />
            </div>
          </div>
          {/* Preguntas dinámicas */}
          {questions.map((question) => {
            switch (question.type) {
              case "text":
                return (
                  <div key={question.id} className="space-y-4">
                    <Label
                      htmlFor={`text-${question.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {question.questionText}
                    </Label>
                    <input
                      type="text"
                      id={`text-${question.id}`}
                      className={clsx(
                        "w-full border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-4 focus:ring-red-500",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      placeholder="Escribe tu respuesta"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required
                    />
                  </div>
                );

              case "date":
                return (
                  <div key={question.id} className="space-y-4">
                    <Label
                      htmlFor={`date-${question.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {question.questionText}
                    </Label>
                    <input
                      type="date"
                      id={`date-${question.id}`}
                      value={answers[question.id] || ""}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className={clsx(
                        "w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      required
                    />
                  </div>
                );

              case "multipleChoice":
                return (
                  <div key={question.id} className="space-y-4">
                    <Label
                      htmlFor={`multipleChoice-${question.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {question.questionText}
                    </Label>
                    {question.options?.map((option) => (
                      <div key={option.idop} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="border rounded-lg text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          id={`${question.id}-${option.idop}`}
                          value={option.idop}
                          checked={answers[question.id]?.includes(option.idop) || false}
                          onChange={() => handleMultipleChoiceChange(question.id, option.idop)}
                          
                        />
                        <Label htmlFor={`${question.id}-${option.idop}`} className="text-gray-700 dark:text-white">
                          {option.optionTxt}
                        </Label>
                      </div>
                    ))}
                  </div>
                );

              case "singleChoice":
                return (
                  <div key={question.id} className="space-y-4">
                    <Label
                      htmlFor={`singleChoice-${question.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {question.questionText}
                    </Label>
                    {question.options?.map((option) => (
                      <div key={option.idop} className="flex items-center gap-2 ">
                        <input
                          type="radio"
                          name={`singleChoice-${question.id}`}
                          value={option.idop}
                          checked={answers[question.id]?.includes(option.idop)}
                          onChange={(e) => handleSingleChange(question.id, option.idop)}
                          required
                        />
                        <Label htmlFor={`${question.id}-${option.idop}`} className="text-gray-700 dark:text-white">
                          {option.optionTxt}
                        </Label>
                      </div>
                    ))}
                  </div>
                );

              case "archive":
                return (
                  <div key={question.id} className="space-y-4">
                    <Label
                      htmlFor={`file-upload-${question.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {question.questionText}
                    </Label>
                    <input
                      id={`file-upload-${question.id}`}
                      type="file"
                      accept=".pdf,.xls,.xlsx,.doc,.docx"
                      className={clsx(
                        "w-full bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 px-4 py-3 file:bg-blue-600 file:text-white file:rounded-md file:px-6 file:py-3",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      onChange={(e) => handleChangeFile(question.id, e.target.files?.[0] || null)}
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Solo se permiten formatos: <strong>PDF, Excel, Word</strong>. Tamaño máximo: <strong>20MB</strong>.
                    </p>
                  </div>
                );

              case "dropdown":
                return (
                  <div key={question.id} className="space-y-4">
                    <Label
                      htmlFor={`dropdown-${question.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-300"
                    >
                      {question.questionText}
                    </Label>
                    <select
                      className={clsx(
                        "w-full border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      value={answers[question.id]?.[0] || ""}
                      onChange={(e) => handleSingleChange(question.id, e.target.value)}
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      {question.options?.map((option) => (
                        <option key={option.idop} value={option.idop}>
                          {option.optionTxt}
                        </option>
                      ))}
                    </select>
                  </div>
                );

              default:
                return null;
            }
          })}
        </form>
                  {/* Botones */}
                  <div className="w-full mx-auto flex justify-end space-x-6 pt-8">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 h-12 w-36 text-white px-6 py-3 rounded-lg shadow-md focus:ring-4 focus:ring-red-500 transition-all duration-300"
              onClick={handleCancelActivity}
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 h-12 w-36 text-white px-6 py-3 rounded-lg shadow-md focus:ring-4 focus:ring-blue-500 transition-all duration-300"
              onClick={handleSubmitAnswers}
            >
              Insertar Actividad
            </Button>
          </div>
      </div>

    </div>
  )
}

