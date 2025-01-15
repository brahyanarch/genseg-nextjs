'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { API_GET_PROJECTS } from "@/config/apiconfig";
import { Edit, Trash2, Eye, CirclePlus } from "lucide-react";
import DynamicTable from "@/components/DynamicTable";
import { usePathname, useRouter, useParams } from "next/navigation";
import Swal from 'sweetalert2';
import { BreadcrumbWithDropdown } from '@/components/breadcrumb';
import { BreadcrumbItemType } from '@/tipos/typos';
import StatusBadge from "@/components/componentesGraficos/estadosProyecto";
import { usePermissions } from "@/context/PermissionContext";
import { checkPermission } from "@/components/checkPermission";
import SkeletonTable from '@/components/skeletonTable';

interface Project {
  idproj: number;
  estado: "Completado" | "Pendiente" | "Archivado" | "Curso" | "nothing";
  escuelaProfesional: string;
  fInit: string;
  fFin: string;
  idString: string;
}
interface BreadcrumbItem {
  type: "link" | "dropdown" | "page";
  label: string;
  href?: string;
  items?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

interface BreadcrumbWithDropdownProps {
  items: BreadcrumbItem[];
}
export default function Component() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { dni, idsubuni, idrol } = useParams();
  ///permisos
  const permissions = usePermissions();
  ///variables necesarios para la tabla dinámica
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // función para ver detalles del proyecto
  const viewProject = (projectId: number) => {
    router.push(`${pathname}/viewProject/${projectId}`);
  }
  //función para editar un proyecto
  const editProject = (projectId: number) => {
    router.push(`${pathname}/editProyect/${projectId}`);
  }
  //función para insertar un nuevo proyecto
  const insertProject = () => {
    router.push(`${pathname}/insertProject`);
  }
  //función para obtener datos desde la API
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_GET_PROJECTS}/${dni}/${idsubuni}`);
      if (!response.ok) {
        throw new Error("Error al obtener los Proyectos");
      }
      const data = await response.json();
      setProjects(data.projectSubUnidad);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    fetchProjects();
  }, []);

  //función para eliminar un proyecto
  const deleteProject = async (id: number) => {
    // Confirmación de SweetAlert antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Este Proyecto será eliminado permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_GET_PROJECTS}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setProjects((prevProjects: Project[]) =>
            prevProjects.filter((form: Project) => form.idproj !== id)
          );
          // Mostrar un SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El Proyecto fue eliminado correctamente.',
            confirmButtonText: 'OK'
          });
          fetchProjects();
        } else {
          // Si el servidor no responde correctamente
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el Proyecto.',
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
        text: 'El Proyecto no fue eliminado.',
        confirmButtonText: 'OK'
      });
    }
  };

  if (loading) {
    return (
      <SkeletonTable />
    );
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  //Configuracion de la tabla dinámica

  // Función para acceder a propiedades anidadas
  const getNestedProperty = (obj: any, key: string) => {
    return key.split('.').reduce((value, part) => value && value[part], obj);
  };

  // Función para ordenar los datos
  const getSortedData = () => {
    if (!sortColumn) return projects;

    return [...projects].sort((a, b) => {
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


  // Configuración de la tabla
  const configurationUser = [
    {
      key: "idproj",
      label: "ID",
      render: (item: Project) => <>{projects.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "idString",
      label: "Nombre",
      render: (item: Project) => item.idString,
      sortable: true,
    },
    {
      key: "fInit",
      label: "Fecha Inicio",
      render: (item: Project) => formatearFecha(item.fInit),
      sortable: true,
    },
    {
      key: "fFin",
      label: "Fecha Final",
      render: (item: Project) => formatearFecha(item.fFin),
      sortable: true,
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: Project) => <StatusBadge status={item.estado} />,
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: Project) => (
        <>
          {checkPermission(permissions, "Editar proyecto") &&
            (<Button variant="ghost" size="icon" onClick={() => editProject(item.idproj)}>
              <Edit className="h-5 w-5" strokeWidth={2.5} />
            </Button>)
          }
          {checkPermission(permissions, "Eliminar proyecto") &&
            (<Button variant="ghost" size="icon" onClick={() => deleteProject(item.idproj)}>
              <Trash2 className="h-5 w-5" strokeWidth={2.5} />
            </Button>)
          }
          {
            checkPermission(permissions, "Ver proyecto") && (
              <Button variant="ghost" size="icon" onClick={() => viewProject(item.idproj)} >
                <Eye className="h-5 w-5" strokeWidth={2.5} />
              </Button>)
          }
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
  const breadcrumbData: BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    { type: "page", label: "Proyectos" },
  ];
  return (
    <div className=" w-[90%] mx-auto  py-4  space-y-4 text-black dark:text-white min-h-screen">
      <div className="flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <BreadcrumbWithDropdown items={breadcrumbData} />
      </div>


      <div className="flex flex-col items-center my-8 space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight dark:text-white">
          Gestión de Proyectos
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl text-center">
          Accede a las opciones para editar, eliminar o visualizar más detalles de cada proyecto.
        </p>
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="flex justify-between items-center">
        {
          checkPermission(permissions, "Insertar proyecto") && (
            <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-42 " onClick={insertProject} >
              <CirclePlus className="h-8 w-8 " />
              <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
              <p className="font-bold" >Nuevo Proyecto</p>
            </Button>
          )
        }
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
      </div>
      <div className="bg-[#E3E6ED] rounded-lg ">
        <label className='block text-lg text-center font-semibold text-gray-700 rounded-lg py-2 px-4 shadow-md'>Lista de todos los proyectos asociados que creaste</label>
        <DynamicTable
          configuration={configurationUser}
          data={currentItems}
          onSort={handleSort}
        />
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {renderPaginationButtons()}
      </div>
      {/** <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveProject={saveProject} editingProject={editingProject} />*/}
    </div>
  )
}