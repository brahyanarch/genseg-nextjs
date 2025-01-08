'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { API_ACTIVITIES } from "@/config/apiconfig"
import Swal from 'sweetalert2';
import { BreadcrumbWithDropdown } from "@/components/breadcrumb"
import { BreadcrumbItemType } from "@/tipos/typos"
import clsx from "clsx"
export default function ActivityForm() {
  interface Question {
    id: number;
    type: string;
    questionText: string;
    options?: { idop: number; optionTxt: string }[];
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  ///entradas obligatorios
  const [nombreActividad, setNombreActividad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [answers, setAnswers] = useState<{ [key: number]: any }>({}); // Estado para almacenar respuestas
  const [errorForm, setErrorForm] = useState(false);
  const { idProject, idActivity, dni, idrol, idsubuni } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // Manejar cambios en las respuestas
  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  /// casos de single choice
  const handleSingleChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId], // Guarda el ID seleccionado como un array
    }));
  };

  const handleChangeFile = (id: number, file: File | null) => {

    if (file) {
      setAnswers((prev) => ({ ...prev, [id]: file }));
    }
  };


  const handleMultipleChoiceChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => {
      // Obtiene las respuestas actuales para esta pregunta o un array vacío
      const currentAnswers = prev[questionId] || [];

      // Verifica si la opción ya está seleccionada
      const isSelected = currentAnswers.some(
        (response: { idomul: number }) => response.idomul === optionId
      );

      // Actualiza las respuestas de la pregunta
      const updatedAnswers = isSelected
        ? currentAnswers.filter((response: { idomul: number }) => response.idomul !== optionId) // Quita la opción si ya está seleccionada
        : [...currentAnswers, optionId]; // Agrega la opción si no está seleccionada

      // Retorna el nuevo estado con las respuestas actualizadas
      return {
        ...prev,
        [questionId]: updatedAnswers, // Actualiza solo esta pregunta
      };
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

  //
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 2).join('/'); // Toma hasta el segmento + un nivel
  };

  const handleCancelActivity = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No se editará la actividad.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, no editar actividad',
      cancelButtonText: 'No, regresar.',
    });
    if (result.isConfirmed) {
      const recortada = recortarRutaHastaSegmento(pathname, 'insertProject');
      router.push(recortada);
      // Mostrar un SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Actividad no editada',
        text: 'los datos de la actividad no fueron editados.',
        confirmButtonText: 'OK'
      });
    }
  }

  const handleSubmitAnswers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      // Crear el objeto FormData
      const formData = new FormData();

      // Agregar datos básicos
      formData.append("name", String(nombreActividad)); // Nombre de la actividad
      formData.append("fInit", String(fechaInicio));    // Fecha de inicio
      formData.append("fFin", String(fechaFinal));      // Fecha final
      formData.append("idproj", String(idProject));     // ID del proyecto

      // Crear un objeto para almacenar las respuestas
      const responses: { [key: string]: any } = {};
      Object.entries(answers).forEach(([key, value]) => {
        // Manejar múltiples valores de idomul
        if (value instanceof File) {
          responses[key] = "file";
          formData.append(`${key}`, value);
        } else if (Array.isArray(value) && value[0]) {
          // Manejar múltiples valores de idomul
    const multipleIdomul = value.map(v => v.idomul).filter(Boolean);
          // Asignar el primer valor válido
          responses[key] =
            value[0].idou ??
            value[0].resTxt ??
            (value[0].resdate ? formatDate(value[0].resdate) : null) ??
            value[0].idodes ??
            (multipleIdomul.length > 0 ? multipleIdomul : null)  ??
            value; // Puedes definir un valor por defecto si todos fallan
        } else {
          responses[key] = value;
        }
      });





      // Agregar el objeto de respuestas al FormData como JSON string
      formData.append("responses", JSON.stringify(responses));


      // Enviar la solicitud al backend
      try {
        const response = await fetch(`${API_ACTIVITIES}/${idActivity}`, {
          method: 'PUT',
          body: formData, // Enviar el FormData como cuerpo
        });

        if (response.ok) {
          const resIdProject = await response.json();
          // Mostrar un SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: 'Actividad editada',
            text: 'La actividad fue editada correctamente.',
            confirmButtonText: 'OK'
          });
          router.back(); // Volver a la ruta anterior
          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });
        } else {
          // Si el servidor no responde correctamente
          Swal.fire({
            icon: 'error',
            title: 'No se pudo editar la actividad',
            text: 'Hubo un problema al editar la actividad.',
            confirmButtonText: 'OK'
          });
          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });
          console.log(answers[1]);
        }
      } catch (error: any) {
        // Si ocurre un error de conexión
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al conectar con la API. ${error.message}`,
          confirmButtonText: 'OK'
        });
      }
    };
  }
  const formatDate = (dateString: string) => {
    if (!dateString) return null; // Retornar null si no hay cadena válida

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null; // Retornar null si no es una fecha válida

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // Retornar fecha formateada
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_ACTIVITIES}/${idActivity}`); // Nuevo endpoint

        if (!response.ok) {
          // Si el servidor no responde correctamente
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los datos de la Actividad.',
            confirmButtonText: 'OK'
          });
        }

        const data = await response.json(); // Suponiendo que la API retorna un array de objetos con preguntas y respuestas

        setQuestions(data.preguntas); // Ajusta según la estructura de datos
        setAnswers(data.respuestas);     // Ajusta según la estructura de datos
        setNombreActividad(data.actividad.name); // Ajusta según la estructura de datos

        setFechaInicio(formatDate(data.actividad.fInit));    // Ajusta según la estructura de datos
        setFechaFinal(formatDate(data.actividad.fFin));   // Ajusta según la estructura de datos
      } catch (err: any) {
        // Si ocurre un error de conexión
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al conectar con la API. ${err.message}`,
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, []);
  //recortamos las rutas requeridas
  const recortarRutaHastaSegmento1 = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  const configuracion = recortarRutaHastaSegmento1(pathname, 'proyectos');
  const configuracion1 = recortarRutaHastaSegmento(pathname, 'insertProject');
  const inicio = recortarRutaHastaSegmento1(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData: BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "page", label: "Insertar Proyecto"},
    { type: "link", label: "Insertar Actividades", href: `${configuracion1}` },
    { type: "page", label: "Editar Actividad" },
  ];
  return (
    <div className="min-h-screen bg-background p-6">
      <div className=" flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-10">Editar Actividad</h1>

        <form className="space-y-6" >
          <div className="space-y-4">
            <Label htmlFor="activity-name" className="text-lg font-medium text-gray-700 dark:text-gray-300">Nombre de la actividad</Label>
            <Input
              id="activity-name"
              placeholder="Nombre de la actividad"
              className={clsx(
                "w-full bg-gray-100 dark:bg-gray-800  dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3",
                { "border-red-400 ring-1 ring-red-400": errorForm && !nombreActividad }, // Estilo condicional si el campo está vacío
                { "border-green-400 ring-1 ring-green-400": !errorForm && nombreActividad } // Estilo si el campo está lleno
              )}
              value={nombreActividad}
              onChange={(e) => setNombreActividad(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="start-date" className="text-lg font-medium text-gray-700 dark:text-gray-300">Fecha inicial</Label>
            <input
              id="start-date"
              type="date"
              placeholder="Fecha inicial"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className={clsx('w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-red-500 px-4 py-3',
                { "border-red-400 ring-1 ring-red-400": errorForm && !fechaFinal }, // Estilo condicional si el campo está vacío
                { "border-green-400 ring-1 ring-green-400": !errorForm && fechaInicio } // Estilo si el campo está lleno
              )}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-lg font-medium text-gray-700 dark:text-gray-300">Fecha final</Label>
            <input
              id="end-date"
              type="date"
              placeholder="Fecha final"
              className={clsx('w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-red-500 px-4 py-3',
                { "border-red-400 ring-1 ring-red-400": errorForm && !fechaFinal }, // Estilo condicional si el campo está vacío
                { "border-green-400 ring-1 ring-green-400": !errorForm && fechaFinal } // Estilo si el campo está lleno
              )}
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
              required
            />
          </div>
          {questions.map((question) => {
            switch (question.type) {
              case "text":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    <input
                      type="text"
                      className={clsx(
                        "w-full border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-4 focus:ring-red-500",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      placeholder="Escribe tu respuesta"
                      value={answers[question.id]?.[0]?.resTxt || answers[question.id]
                      }
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required
                    />
                  </div>
                );

              case "date":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    <input
                      type="date"
                      className={clsx(
                        "w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      value={formatDate(answers[question.id]?.[0]?.resdate || formatDate(answers[question.id]))}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required
                    />
                  </div>
                );

              case "multipleChoice":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {question.questionText}
                    </label>
                    {question.options?.map((option) => (
                      <div key={option.idop}>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-white">
                          <input
                            type="checkbox"
                            className="border text-black rounded-lg  dark:text-white focus:ring-2 focus:ring-blue-500"
                            value={option.idop}
                            checked={
                              answers[question.id]?.some(
                                (response: { idomul: number }) => response.idomul === option.idop
                              ) || answers[question.id]?.includes(option.idop)
                            }
                            onChange={() => handleMultipleChoiceChange(question.id, option.idop)}
                          />
                          {option.optionTxt}
                        </label>
                      </div>
                    ))}
                  </div>
                );


              case "singleChoice":
                return (
                  <div key={question.id}>
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    {question.options?.map((option) => (
                      <div key={option.idop}>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-white">
                          <input
                            type="radio"
                            name={`singleChoice-${question.id}`}
                            value={option.idop}
                            checked={
                              answers[question.id]?.some(
                                (response: { idou: number }) => response.idou === option.idop
                              ) || answers[question.id]?.includes(option.idop)
                            }
                            onChange={() => handleSingleChange(question.id, option.idop)}
                            required
                          />
                          {option.optionTxt}
                        </label>
                      </div>
                    ))}
                  </div>
                );

              case "dropdown":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    <select
                      className={clsx(
                        "w-full border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      value={answers[question.id]?.[0]?.idodes || answers[question.id]?.[0]}
                      onChange={(e) =>
                        handleSingleChange(question.id, Number(e.target.value))
                      }
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

              case "archive":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    <input
                      type="file" accept=".pdf,.xls,.xlsx,.doc,.docx"
                      className={clsx(
                        "w-full bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 px-4 py-3 file:bg-blue-600 file:text-white file:rounded-md file:px-6 file:py-3",
                        {
                          "border-red-400 ring-1 ring-red-400": errorForm && !answers[question.id], // Error
                          "border-green-400 ring-1 ring-green-400": !errorForm && answers[question.id], // Validez
                        }
                      )}
                      onChange={(e) =>
                        handleChangeFile(question.id, e.target.files?.[0] || null)
                      }
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Solo se permiten formatos: <strong>PDF, Excel, Word</strong>. Tamaño máximo: <strong>20MB</strong>.
                    </p>
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
            Editar Actividad
          </Button>

        </div>


      </div>
    </div>
  )
}

