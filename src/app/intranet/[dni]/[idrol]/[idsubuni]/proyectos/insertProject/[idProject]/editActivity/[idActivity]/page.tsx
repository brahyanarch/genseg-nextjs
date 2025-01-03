'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { API_ACTIVITIES } from "@/config/apiconfig"
import Swal from 'sweetalert2';
import { BreadcrumbWithDropdown } from "@/components/breadcrumb"

export default function ActivityForm() {
  const [questions, setQuestions] = useState([]);
  ///entradas obligatorios
  const [nombreActividad, setNombreActividad] = useState();
  const [fechaInicio, setFechaInicio] = useState();
  const [fechaFinal, setFechaFinal] = useState();
  const [answers, setAnswers] = useState({}); // Estado para almacenar respuestas
  const { idProject, idActivity, dni, idrol, idsubuni } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const handleChange = (questionId, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [
        {
          ...prev[questionId]?.[0],
          [field]: value, // Actualiza el campo correspondiente (resTxt, etc.)
        },
      ],
    }));
  };

  /// casos de single choice
  const handleSingleChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [{ idomul: optionId, idp: questionId }], // Reemplaza con la nueva selección
    }));
  };
  const handleChangeFile = (questionId, file) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [{ file, idp: questionId }], // Agrega el archivo
    }));
  };



  // Manejar cambios para opciones múltiples
  const handleMultipleChoiceChange = (questionId, optionId) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      const isSelected = currentAnswers.some(
        (response) => response.idomul === optionId
      );

      return {
        ...prev,
        [questionId]: isSelected
          ? currentAnswers.filter((response) => response.idomul !== optionId) // Quita si ya está seleccionado
          : [
            ...currentAnswers,
            { idomul: optionId, idp: questionId }, // Agrega la opción seleccionada
          ],
      };
    });
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

    // Crear el objeto FormData
    const formData = new FormData();

    // Agregar datos básicos
    formData.append("name", String(nombreActividad)); // Nombre de la actividad
    formData.append("fInit", String(fechaInicio));    // Fecha de inicio
    formData.append("fFin", String(fechaFinal));      // Fecha final
    formData.append("idproj", String(idProject));     // ID del proyecto

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
  const inicio = recortarRutaHastaSegmento1(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "page", label: "Insertar actividad" },
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
              className="w-full bg-gray-100 dark:bg-gray-800 h-12 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3"
              value={nombreActividad}
              onChange={(e) => setNombreActividad(e.target.value)}
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
              className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-lg font-medium text-gray-700 dark:text-gray-300">Fecha final</Label>
            <input
              id="end-date"
              type="date"
              placeholder="Fecha final"
              className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3"
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
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
                      className="w-full border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="Escribe tu respuesta"
                      value={answers[question.id]?.[0]?.resTxt || ""}
                      onChange={(e) => handleChange(question.id, "resTxt", e.target.value)}
                    />
                  </div>
                );

              case "date":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    <input
                      type="date"
                      className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 px-4 py-3"
                      value={answers[question.id]?.[0]?.resTxt || ""}
                      onChange={(e) => handleChange(question.id, "resTxt", e.target.value)}
                    />
                  </div>
                );

              case "multipleChoice":
                return (
                  <div key={question.id} className="space-y-4">
                    <label className="text-lg font-medium text-gray-700 dark:text-gray-300">{question.questionText}</label>
                    {question.options?.map((option) => (
                      <div key={option.idop}>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-white">
                          <input
                            type="checkbox"
                            className="border rounded-lg text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                            checked={
                              answers[question.id]?.some(
                                (response) => response.idomul === option.idop
                              ) || false
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
                                (response) => response.idomul === option.idop
                              ) || false
                            }
                            onChange={() => handleSingleChange(question.id, option.idop)}
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
                      className="w-full border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500"
                      value={answers[question.id]?.[0]?.idomul || ""}
                      onChange={(e) =>
                        handleSingleChange(question.id, Number(e.target.value))
                      }
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
                      className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 px-4 py-3 file:bg-blue-600 file:text-white file:rounded-md file:px-6 file:py-3"
                      onChange={(e) =>
                        handleChangeFile(question.id, e.target.files?.[0] || null)
                      }
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
            Insertar Actividad
          </Button>
        </div>
      </div>
    </div>
  )
}

