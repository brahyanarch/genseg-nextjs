'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Search, Trash2 } from "lucide-react";
import DynamicTable from "@/components/DynamicTable";
import { useState, useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { API_PROJECT_ACTIVITIES, API_ACTIVITIES } from "@/config/apiconfig"
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { BreadcrumbItemType } from "@/tipos/typos";
import Swal from 'sweetalert2';

interface Activities {
  idActivi: number;
  name: string;
  fInit: string;
  fFin: string;
  estado: string;
  idString: string;
  idproj: number;
  idres: number;
}
interface ProjectDetails {
  plan: string;
  estado: string;
  fInit: string;
  fFin: string;
  idString: string;
  prgest: {
    nmPE: string;
  };
}



export default function ProjectForm() {
  /// variables importantes
  const [activitiesProject, setActivitiesProjects] = useState<Activities[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const { idProject } = useParams();
  ///variables necesarios para la tabla dinámica
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(activitiesProject.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();
  const pathname = usePathname();
  const { idrol, idsubuni, dni } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  //función para insertar una actividad
  const insertActivity = () => {
    router.push(`${pathname}/insertActivity`);
  }
  //función para editar una actividad
  const editActivity = (id: number) => {
    router.push(`${pathname}/editActivity/${id}`);
  }
  //función para eliminar una actividad
  const deleteActivity = async (id: number) => {
    // Confirmación de SweetAlert antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta Actividad será eliminado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_ACTIVITIES}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const actividadesNuevas = await response.json();
          /*setActivitiesProjects((prevProjects: Activities[]) =>
            prevProjects.filter((form: Activities) => form.idActivi !== id)
          );*/
          setActivitiesProjects(actividadesNuevas.actividades);
          // Mostrar un SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'La Actividad fue eliminada correctamente.',
            confirmButtonText: 'OK'
          });
          fetchActivitiesProject();
        } else {
          // Si el servidor no responde correctamente
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la Actividad.',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        // Si ocurre un error de conexión
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al conectar con la API. ${error}`,
          confirmButtonText: 'OK'
        });
      }
    } else {
      // Si el usuario cancela la operación
      Swal.fire({
        icon: 'info',
        title: 'Operación cancelada',
        text: 'La actividad no fue eliminado.',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSaveChange = async () => {
    // Confirmación de SweetAlert antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Estos cambios serán guardados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'No guardar cambios',
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded',
      },
    });
    if (result.isConfirmed) {
      const recortada = recortarRutaHastaSegmento(pathname, 'proyectos');
      router.push(recortada);
      // Mostrar un SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Los cambios fueron guardados correctamente.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        },
      });
    }
  }
  const handleCancelChange = async () => {
    // Confirmación de SweetAlert antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Estos cambios serán Eliminados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar cambios',
      cancelButtonText: 'No Eliminar cambios',
      background: 'bg-gray-800', // Fondo para modo oscuro
      color: 'text-gray-200', // Texto claro
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded',
      },
    });
    if (result.isConfirmed) {
      const recortada = recortarRutaHastaSegmento(pathname, 'proyectos');
      router.push(recortada);
      // Mostrar un SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Los cambios fueron Eliminados correctamente.',
        confirmButtonText: 'OK',
        background: 'bg-gray-800', // Fondo para modo oscuro
        color: 'text-gray-200', // Texto claro
        customClass: {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
        },
      });
    }
  }
  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  /// Fucion para cambiar a interfaz de detalles de una actividad 
  //función para obtener datos desde la API
  const fetchActivitiesProject = async () => {
    try {
      const response = await fetch(`${API_PROJECT_ACTIVITIES}/${idProject}`);
      if (response.ok) {
        const data = await response.json();
        setActivitiesProjects(data.actividades);
        setProjectDetails(data.datasProject);

      } else {
        // Si el servidor no responde correctamente
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener las actividades del Proyecto.',
          confirmButtonText: 'OK'
        });
      }
    } catch (err: any) {
      // Si ocurre un error de conexión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al conectar con la API. ${err}`,
        confirmButtonText: 'OK'
      });
    }
  };
  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    fetchActivitiesProject();
  }, []);


  // Función para acceder a propiedades anidadas
  const getNestedProperty = (obj: any, key: string) => {
    return key.split('.').reduce((value, part) => value && value[part], obj);
  };

  // Función para ordenar los datos
  const getSortedData = () => {
    if (!sortColumn) return activitiesProject;

    return [...activitiesProject].sort((a, b) => {
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

  const sortedUsers = getSortedData();

  // Función para filtrar los datos basados en el término de búsqueda
  const getFilteredData = () => {
    if (!searchTerm) return sortedUsers;
  
    return sortedUsers.filter((user) =>
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
  // Configuración de la tabla
  const configurationUser = [
    {
      key: "idActivi",
      label: "ID",
      render: (item: Activities) => <>{activitiesProject.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "name",
      label: "Nombre",
      render: (item: Activities) => item.name,
      sortable: true,
    },
    {
      key: "fInit",
      label: "Fecha Inicio",
      render: (item: Activities) => formatearFecha(item.fInit),
      sortable: true,
    },
    {
      key: "fFin",
      label: "Fecha Final",
      render: (item: Activities) => formatearFecha(item.fFin),
      sortable: true,
    },
    {
      key: "status",
      label: "Estado",
      render: (item: Activities) => item.estado,
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: Activities) => (
        <div className=" flex justify-center items-center">
          <Button variant="ghost" size="icon" onClick={() => { editActivity(item.idActivi) }} >
            <Edit className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteActivity(item.idActivi)}
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
          </Button>
        </div>
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
    const maxVisiblePages = 5;
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

  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'proyectos');
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData:BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "link", label: "Proyectos", href: configuracion },
    { type: "page", label: "Insertar actividades" },
  ];
  return (
    <div className="flex-1 bg-background py-4 pl-4  text-black dark:text-white">
      <div className=" flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>
      <div className="w-full space-y-6">
        <div className="flex-1 w-[90%]  mx-auto flex flex-col justify-between ">
          <div className="  w-[100%] flex flex-1 justify-around items-center">
            <div className="text-center my-4">
              <h1 className="text-3xl font-bold">Insertar Actividades en el Proyecto {idProject}</h1>
              <p className="text-sm text-gray-400 text-muted-foreground">
                Administra y registra las actividades necesarias para completar el proyecto.
              </p>
            </div>

          </div>
        </div>
        <div className="w-[90%] mx-auto my-4">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                type="text"
                className="pl-8 w-[250px] bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                
              />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 h-12 w-32 " onClick={insertActivity} >
            Registrar Actividad
            </Button>
          </div>
          <h2 className="text-lg font-bold my-3 ">
            Lista de actividades registradas:
          </h2>
          <div className="bg-[#E3E6ED] rounded-lg ">

            <DynamicTable
              configuration={configurationUser}
              data={currentItems}
              onSort={handleSort}
            />
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            {renderPaginationButtons()}
          </div>
        </div>
        <div className="w-[90%] flex justify-end gap-8 items-center mx-auto">
          <Button className="bg-red-500 hover:bg-red-600  w-32 h-12 " onClick={handleCancelChange} >
            Cancelar Cambios
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 h-12 w-32 " onClick={handleSaveChange} >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}

