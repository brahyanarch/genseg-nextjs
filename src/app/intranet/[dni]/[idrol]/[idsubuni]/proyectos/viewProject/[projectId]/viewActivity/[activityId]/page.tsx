'use client'

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { API_ACTIVITIES, API_URL } from "@/config/apiconfig"
import Swal from 'sweetalert2';
import { BreadcrumbWithDropdown } from "@/components/breadcrumb"
import { BreadcrumbItemType } from "@/tipos/typos"
import { API_GET_PROJECTS } from "@/config/apiconfig";
import { Edit, Trash2, Eye } from "lucide-react";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import DynamicTable from "@/components/DynamicTable";
import Image from "next/image"
import clsx from "clsx"

interface Alumno {
  idest: number;
  dni: string;
  codigo: string;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  email: string;
}
interface Asistente {
  alumno: Alumno;
  asistio: boolean;
}
export function Card() {
  const { activityId } = useParams(); // activityId es un string
  const [currentActivity, setCurrentActivity] = useState({}); // Estado para la actividad actual


  //funcion para obtener datos de una actividad
  const getDataActivity = async () => {
    try {
      const response = await fetch(`${API_URL}/api/actividades/pagina`);
      if (response.ok) {
        const data = await response.json();
        setCurrentActivity(data.find((activity) => activity.idActivi === Number(activityId)));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener los datos del participante'

        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error no se pudo obtener los datos del participante',
        text: 'Compruebe su conexion a internet'

      })
    }
  }
  useEffect(() => {
    getDataActivity();
  }, []); // Solo se ejecuta al montar el componente



  return (
    <div className="max-w-sm rounded-md overflow-hidden shadow-lg bg-white mb-10 mx-auto w-80">
      {/* Imagen */}
      <div className="relative h-48 w-full">
        <Image
          src="/resources/images/5.jpg" // Cambia esto por la ruta real de la imagen
          alt="Lisa Mamani"
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
        />
      </div>

      {/* Contenido de la tarjeta */}
      {
        currentActivity && (
        <div className="p-4">
          <h3 className="text-base font-semibold text-blue-700">{currentActivity.project.usuario.n_usu} <span className="text-gray-500 font-light text-xs">Encargad@</span></h3>
          <p className="text-xl font-bold text-gray-900">{currentActivity.name}</p>
          <p className="text-gray-600 mt-2 font-normal">
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </p>

          {/* Botones */}
          <div className="mt-4 flex justify-between items-center ">
            <button className="bg-white-800 h-[40px] w-[130px] hover:bg-blue-700 hover:text-white text-blue-500 border-[1px] border-blue-500 font-medium py-2 px-4 rounded">
              Ver más
            </button>
            <button className="bg-blue-500 h-[40px] w-[130px] hover:bg-blue-700  text-white font-medium py-2 px-4 rounded">
              Participar
            </button>
          </div>
        </div>

        )
      }

    </div>
  );
}


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

  const [participantes, setParticipantes] = useState<Asistente[]>([]);
  const { projectId, activityId, dni, idrol, idsubuni } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  ///variables necesarios para la tabla dinámica
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(participantes.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPublic, setisPublic] = useState(false)

  // función para ver detalles del proyecto
  const viewProject = (projectId: number) => {
    router.push(`${pathname}/viewProject/${projectId}`);
  }
  //función para editar un proyecto
  const editProject = (projectId: number) => {
    router.push(`${pathname}/editProyect/${projectId}`);
  }
  //función para obtener datos desde la API
  const fetchParticipantes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/alumnos/actividad/${activityId}/`);
      if (!response.ok) {
        throw new Error("Error al obtener los Proyectos");
      }
      const data = await response.json();
      setParticipantes(data);
    } catch (err: any) {

    } finally {

    }
  };

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    fetchParticipantes();
  }, []);

  //Configuracion de la tabla dinámica

  // Función para acceder a propiedades anidadas
  const getNestedProperty = (obj: any, key: string) => {
    return key.split('.').reduce((value, part) => value && value[part], obj);
  };

  // Función para ordenar los datos
  const getSortedData = () => {
    if (!sortColumn) return participantes;

    return [...participantes].sort((a, b) => {
      const fieldA = getNestedProperty(a, sortColumn);
      const fieldB = getNestedProperty(b, sortColumn);

      if (fieldA === undefined || fieldB === undefined) return 0;

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }

      return 0;
    });
  };

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortedProjects = getSortedData();

  // Función para filtrar los datos basados en el término de búsqueda
  const getFilteredData = () => {
    if (!searchTerm) return sortedProjects;

    return sortedProjects.filter((user) =>
      Object.values(user).some((value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredUsers = getFilteredData();
  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const formatearFecha = (fecha: string) => {
    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
    return fechaFormateada;
  }

  const handleAsistance = async (asistio: boolean, idEstudiante: number) => {
    console.log("handleAsistance llamado:", { asistio, idEstudiante });
    setParticipantes((prev) =>
      prev.map((item) =>
        item.alumno.idest === idEstudiante
          ? { ...item, asistio } // Actualiza directamente el valor de `asistio`
          : item
      )
    ); // Cambia el estado visualmente antes de la API call
    try {
      const response = await fetch(`${API_URL}/api/asistencia/toggle/${idEstudiante}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participo: asistio, // Envía el nuevo estado del toggle
          idsubunidad: idsubuni,
          idActivi: activityId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la actividad");
      }

      const result = await response.json();
      console.log("Estado actualizado:", result);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      // Revierte el cambio si la solicitud falla
      setParticipantes((prev) =>
        prev.map((item) =>
          item.alumno.idest === idEstudiante
            ? { ...item, asistio: !asistio } // Revertir el estado de `asistio`
            : item
        )
      );
    }
  };
  // Configuración de la tabla
  const configurationData = [
    {
      key: "alumno.idest",
      label: "ID",
      render: (item: Asistente) => <>{participantes.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "alumno.codigo",
      label: "Codigo",
      render: (item: Asistente) => item.alumno.codigo,
      sortable: true,
    },
    {
      key: "alumno.nombre",
      label: "Nombre",
      render: (item: Asistente) => item.alumno.nombre,
      sortable: false,
    },
    {
      key: "alumno.aPaterno",
      label: "Apellido Paterno",
      render: (item: Asistente) => item.alumno.aPaterno,
      sortable: false,
    },
    {
      key: "alumno.aMaterno",
      label: "Apellido Materno",
      render: (item: Asistente) => item.alumno.aMaterno,
      sortable: true,
    },
    {
      key: "Asistencia",
      label: "Asistencia",
      render: (item: Asistente) => (
        <>
          <Checkbox checked={item.asistio} onClick={() => handleAsistance(!item.asistio, item.alumno.idest)} />
        </>
      ),
    },
  ];

  const renderPaginationButtons = () => {
    const pageButtons = [];

    // Botón de "Anterior"
    pageButtons.push(
      <Button
        key="prev"
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-black dark:text-white h-10 w-24 "
      >
        Anterior
      </Button>
    );

    // Mostrar la primera página siempre
    if (currentPage > 3) {
      pageButtons.push(
        <Button
          key={1}
          variant="outline"
          onClick={() => handlePageChange(1)}
          className="h-10 w-14 "
        >
          <p className="text-black dark:text-white">1</p>
        </Button>
      );
      pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
    }

    // Rango de páginas cercanas a la actual
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));

    if (endPage - startPage < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant="outline"
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "bg-blue-500 text-white h-10 w-14 " : "text-black dark:text-white h-10 w-14 "}
        >
          {i}
        </Button>
      );
    }

    // Mostrar la última página siempre
    if (currentPage < totalPages - 2) {
      pageButtons.push(<span key="end-ellipsis" className="px-2">...</span>);
      pageButtons.push(
        <Button
          key={totalPages}
          variant="outline"
          onClick={() => handlePageChange(totalPages)}
          className='h-10 w-14 '
        >
          <p className="text-black dark:text-white">{totalPages}</p>
        </Button>
      );
    }

    // Botón de "Siguiente"
    pageButtons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-black dark:text-white h-10 w-24  "
      >
        Siguiente
      </Button>
    );

    return pageButtons;
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };



  const handleToggle = async (checked: boolean) => {
    setisPublic(checked); // Cambia el estado visualmente antes de la API call
    try {
      const response = await fetch(`${API_URL}/api/actividad/toggle/${activityId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public: checked, // Envía el nuevo estado del toggle
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la actividad");
      }

      const result = await response.json();
      console.log("Estado actualizado:", result);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setisPublic(!checked); // Revierte el cambio si la solicitud falla
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_ACTIVITIES}/${activityId}`); // Nuevo endpoint

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
        setisPublic(data.actividad.public); // Ajusta según la estructura de datos
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
  const inicio = recortarRutaHastaSegmento1(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData: BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "link", label: "Ver proyecto", href: `${configuracion}/viewProject/${projectId}` },
    { type: "page", label: "Ver actividad" },
  ];
  const renderQuestionResponse = (question) => {
    switch (question.type) {
      case "text":
        return answers[question.id]?.[0]?.resTxt || "Sin respuesta";
      case "date":
        return formatDate(answers[question.id]?.[0]?.resdate) || "Sin respuesta";
      case "multipleChoice":
        return question.options?.map((option, index) => (
          <span key={option.idop}>
            {answers[question.id]?.[index]?.opcmul?.txtOpc || "Sin respuesta"}
          </span>
        ));
      case "singleChoice":
        return answers[question.id]?.[0]?.opcuni?.txtOpc || "Sin respuesta";
      case "dropdown":
        return answers[question.id]?.[0]?.opcdes?.txtOpc || "Sin respuesta";
      case "archive":
        return (
          <a
            href={`${API_URL}/${answers[question.id]?.[0]?.resFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver Archivo
          </a>
        );
      default:
        return "Sin respuesta";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 w-full">
      <div className=" flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>

      <div className="w-[90%] mx-auto px-4 space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Detalles de la Actividad
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center text-center content-center">
          <div className="shadow-lg rounded-xl p-6 bg-white dark:bg-gray-900 dark:text-white">
            <label htmlFor="activity-name" className="block text-lg  font-semibold text-gray-700 dark:text-gray-300">
              Nombre de la Actividad
            </label>
            <p className="mt-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700">
              {nombreActividad}
            </p>
          </div>

          <div className="shadow-lg rounded-xl p-6 bg-white dark:bg-gray-900 dark:text-white">
            <label htmlFor="start-date" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
              Fecha Inicial
            </label>
            <p className="mt-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700">
              {fechaInicio}
            </p>
          </div>

          <div className="shadow-lg rounded-xl p-6 bg-white dark:bg-gray-900 dark:text-white">
            <label htmlFor="end-date" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
              Fecha Final
            </label>
            <p className="mt-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700">
              {fechaFinal}
            </p>
          </div>

          {questions.map((question) => {
            return (
              <div key={question.id} className="shadow-lg rounded-xl p-6 bg-white dark:bg-gray-900 dark:text-white">
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {question.questionText}
                </label>
                <p className="mt-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700">
                  {renderQuestionResponse(question)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones */}
      <div className="w-[90%] mx-auto flex justify-end space-x-6 pt-8">

      </div>

      <div className="bg-[#E3E6ED] w-[90%] rounded-lg p-4 flex items-center space-x-4 mx-auto">
        <Switch
          className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-400"
          thumbColor="bg-white"
          checked={isPublic}
          onCheckedChange={handleToggle}
        />

        <Label className="text-black">Publicar Actividad</Label>
      </div>

      <div className="pt-2 ">
        <Card />
      </div>
      <div className="relative w-[80%] mx-auto">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          type="text"
          className="pl-8 w-[250px] bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}

        />
      </div>
      <div className="w-[80%] mx-auto">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white my-4">Lista de participantes en la actividad ({participantes.length})</h2>
        <div className="bg-[#E3E6ED] rounded-lg pt-6  ">
          <DynamicTable
            configuration={configurationData}
            data={currentItems}
            onSort={handleSort}
          />
        </div>
        <div className="flex justify-center space-x-2 mt-4  ">
          {renderPaginationButtons()}
        </div>
      </div>



    </div>

  )
}

