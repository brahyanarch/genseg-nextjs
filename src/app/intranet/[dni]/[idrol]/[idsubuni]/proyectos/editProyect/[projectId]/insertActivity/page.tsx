'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {AvisoContext} from "@/context/avisoContext"
import { useState, useContext, useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import {API_FORM, API_ACTIVITIES } from "@/config/apiconfig"

export default function ActivityForm() {
   const [questions, setQuestions] = useState([]);
   const {mostrarAviso} = useContext<any>(AvisoContext);
   ///entradas obligatorios
   const [nombreActividad, setNombreActividad] = useState();
   const [fechaInicio,setFechaInicio] = useState();
   const [fechaFinal, setFechaFinal] = useState();
   const [answers, setAnswers] = useState<{ [key: number]: string | File | number[] }>({}); // Estado para almacenar respuestas
   const {projectId, idsubuni} = useParams();
   const pathname = usePathname(); 
   const router = useRouter();
   // Manejar cambios en las respuestas
   const handleChange = (id:number, value:string) => {
     setAnswers((prev) => ({ ...prev, [id]: value }));
   };
   const handleChangeFile = (id: number, file: File | null) => {

    if (file) {
      setAnswers((prev) => ({ ...prev, [id]: file }));
    }
  };
   /// casos de single choice
   const handleSingleChange = (id:number, value:number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: [value], // Guarda el ID seleccionado como un array
    }));
  };
  

   // Manejar cambios para opciones múltiples
   const handleMultipleChoiceChange = (id:number, optionId) => {
    setAnswers((prev) => {
      const currentValues = prev[id] || [];
      const updatedValues = currentValues.includes(optionId)
        ? currentValues.filter((val) => val !== optionId) // Elimina si ya está seleccionado
        : [...currentValues, optionId]; // Agrega si no está seleccionado
  
      return { ...prev, [id]: updatedValues };
    });
  };
  //
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 2).join('/'); // Toma hasta el segmento + un nivel
  };
  const handleCancelActivity = ()=>{
    const recortada = recortarRutaHastaSegmento(pathname, 'editProyect');
    router.push(recortada);
  } 
  
  const handleSubmitAnswers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
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
      const response = await fetch(API_ACTIVITIES, {
        method: 'POST',
        body: formData, // Enviar el FormData como cuerpo
      });
  
      if (response.ok) {
        const resIdProject = await response.json();
        mostrarAviso('succefull', 'Respuestas guardadas correctamente.');
        router.back(); // Volver a la ruta anterior
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      } else {
        mostrarAviso('warning', 'Error al guardar las respuestas.');
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
      }
    } catch (error) {
      mostrarAviso('warning', `Error al conectar con la API: ${error}`);
    }
  };
  
  
     /// obtener las preguntas del formulario
     const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_FORM}/${idsubuni}`);
        if (!response.ok) {
          throw new Error('Error al obtener las preguntas');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err: any) {
        mostrarAviso('warning',err.message );
      } finally {
        console.log("Todo completo");
      }
    };
      ///obtener las preguntas existentes en la base de datos desde la API
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="text-sm breadcrumbs mb-6 text-muted-foreground">
        <span>Inicio</span> {' > '} 
        <span>Proyectos</span> {' > '} 
        <span>Insertar</span> {' > '} 
        <span>actividad</span>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold mb-8">Insertar Actividad</h1>
        
        <form className="space-y-4" >
          <div className="space-y-2">
            <Label htmlFor="activity-name">Nombre de la actividad</Label>
            <Input 
              id="activity-name"
              placeholder="Nombre de la actividad"
              className="bg-background"
              value={nombreActividad}
              onChange={(e) => setNombreActividad(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Fecha inicial</Label>
            <Input 
              id="start-date"
              type="date"
              placeholder="Fecha inicial"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Fecha final</Label>
            <Input 
              id="end-date"
              type="date"
              placeholder="Fecha final"
              className="bg-background"
              value={fechaFinal}
              onChange={(e) => setFechaFinal(e.target.value)}
            />
          </div>
          {questions.map((question) => {
          switch (question.type) {
            case "text":
              return (
                <div key={question.id}>
                  <label className="block font-medium">{question.questionText}</label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full bg-background"
                    placeholder="Escribe tu respuesta"
                    value={answers[question.id] || ""}
                    required
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  />
                </div>
              );

            case "date":
              return (
                <div key={question.id}>
                  <label className="block font-medium bg-background">{question.questionText}</label>
                  <input
                    type="date"
                    className="border rounded p-2 w-full bg-background"
                    value={answers[question.id] || ""}
                    required
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  />
                </div>
              );

            case "multipleChoice":
              return (
                <div key={question.id}>
                  <label className="block font-medium">{question.questionText}</label>
                  {question.options?.map((option) => (
                    <div key={option.idop}>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="border rounded"
                          id={`${question.id}-${option.idop}`} // Vincula correctamente con el ID
                          value={option.idop}
                          checked={answers[question.id]?.includes(option.idop) || false} // Comprueba contra option.id
                          onChange={() => handleMultipleChoiceChange(question.id, option.idop)} // Envía option.id correctamente
                          required
                        />
                        {option.optionTxt} {/* Usa la propiedad correcta para el texto */}
                      </label>
                    </div>
                  ))}

                </div>
              );
              case "singleChoice":
                return (
                  <div key={question.id}>
                    <label className="block font-medium">{question.questionText}</label>
                    {question.options?.map((option) => (
                      <div key={option.idop}>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`singleChoice-${question.id}`}
                            value={option.idop}
                            checked={answers[question.id]?.includes(option.idop)} // Verifica si está incluido en el array
                            onChange={(e) => handleSingleChange(question.id, option.idop)} // Llama a la función con el ID
                            required
                          />
                          {option.optionTxt}
                        </label>
                      </div>
                    ))}
                  </div>
                );
              
                         
            case "archive":
              return (
                <div key={question.id}>
                  <label className="block font-medium bg-background">{question.questionText}</label>
                  <input
                    type="file"
                    className="border rounded p-2 w-full"
                    onChange={(e) => handleChangeFile(question.id, e.target.files?.[0] || null)}
                    required
                  />
                </div>
              );

              case "dropdown":
                return (
                  <div key={question.id}>
                    <label className="block font-medium bg-background">{question.questionText}</label>
                    <select
                      className="border rounded p-2 w-full bg-background"
                      value={answers[question.id]?.[0] || ""} // Accede al primer valor del array
                      onChange={(e) => handleSingleChange(question.id, e.target.value)} // Llama a la función con el valor seleccionado
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
        <div className="w-[90%] mx-auto flex justify-end space-x-4 pt-4">
            <Button 
              variant="destructive" 
              className="bg-[#F08080] hover:bg-[#E07070] text-white"
              onClick={handleCancelActivity}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleSubmitAnswers}
            >
              Insertar Actividad
            </Button>
          </div>
      </div>
    </div>
  )
}

