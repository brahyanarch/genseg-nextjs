'use client';
import {useState, useEffect,useContext} from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { API_PROJECTS } from "@/config/apiconfig";
import {AvisoContext} from '@/context/avisoContext';
import { Edit,X, Trash2, MoreVertical,Eye, CirclePlus } from "lucide-react";
import DynamicTable from "@/components/DynamicTable";
import {usePathname, useRouter, useParams } from "next/navigation";
interface Project {
    idproj: number;
    estado: string;
    escuelaProfesional: string;
    fechaIn: string;
    fechaFin: string;
    nombre: string;
  }
export default function Component() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const {mostrarAviso} = useContext<any>(AvisoContext);
  const pathname = usePathname();
  const router = useRouter();
  const {dni, idsubuni} = useParams();
  ///variables necesarios para la tabla dinámica
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

 // función para ver detalles del proyecto
 const viewProject = (projectId:number) =>{
      router.push(`${pathname}/viewProject/${projectId}`);
 }
 //función para insertar un nuevo proyecto
 const insertProject = () =>{
    router.push(`${pathname}/insertProject`);
 }
 //función para obtener datos desde la API
 const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_PROJECTS}/${dni}/${idsubuni}`);
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

//función para eliminar un Rolgit
const deleteProject = async (id: number) => {
  try {
    const response = await fetch(`${API_PROJECTS}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProjects((prevProjects:any) =>
        prevProjects.filter((form: any) => form.idf !== id)
      );
      mostrarAviso('succefull', 'Proyecto Eliminado correctamente.');
      fetchProjects();
    } else {
      mostrarAviso('warning', 'Error al eliminar el Proyecto.');
    }
  } catch (error) {
    mostrarAviso('warning', "Error al conectar con la API:", error);
  }
};

if (loading) {
  return (
    <>
      <div className="p-6 space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 text-sm">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />

          {/* New button skeleton */}
          <Button variant="outline" disabled className="gap-2">
            <Skeleton className="h-4 w-12" />
          </Button>
        </div>

        {/* Table skeleton */}
        <div className="rounded-lg border">
          {/* Header */}
          <div className="grid grid-cols-[100px_1fr_100px] bg-muted p-4 gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Table row */}
          <div className="grid grid-cols-[100px_1fr_100px] p-4 gap-4 items-center">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2 mt-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </>
  );
}
  //función para identificar estados del proyecto
  const getStatusClass = (status: Project["estado"]) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-orange-100 text-orange-800 border-2 border-orange-300 dark:bg-orange-900 dark:text-orange-200 "
      case "ARCHIVADO":
        return "bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900 dark:text-red-200"
      case "COMPLETADO":
        return "bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900 dark:text-green-200"
      case "EN CURSO":
        return "bg-blue-100 text-blue-800 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-200"
    }
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
 
   // Paginación
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = sortedProjects.slice(indexOfFirstItem, indexOfLastItem);
 
   const handlePageChange = (page: number) => {
     setCurrentPage(page);
   };
 
   // Configuración de la tabla
   const configurationUser = [
     {
       key: "index",
       label: "ID",
       render: (item: Project) => <>{projects.indexOf(item) + 1}</>,
       sortable:true,
     },
     {
       key: "n_usu",
       label: "Nombre",
       render: (item: Project) => item.idString,
       sortable: true,
     },
     {
       key: "fechaIncio",
       label: "Fecha Inicio",
       render: (item: Project) => item.fInit,
       sortable: true,
     },
     {
      key: "fechaFinal",
      label: "Fecha Final",
      render: (item: Project) => item.fFin,
      sortable: true,
    },
    {
      key: "Estado",
      label: "Estado",
      render: (item: Project) => item.estado,
      sortable: true,
    },
     {
       key: "opciones",
       label: "Opciones",
       render: (item: Project) => (
         <>
           <Button variant="ghost" size="icon">
             <Edit className="h-5 w-5"  strokeWidth={2.5} />
           </Button>
           <Button
             variant="ghost"
             size="icon"
             onClick={() => console.log("Eliminar", item.id)}
           >
             <Trash2 className="h-5 w-5"  strokeWidth={2.5}  />
           </Button>
           <Button variant="ghost" size="icon" onClick={()=>viewProject(item.idproj)} >
             <Eye className="h-5 w-5"  strokeWidth={2.5} />
           </Button>
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
         size="sm"
         onClick={() => handlePageChange(currentPage - 1)}
         disabled={currentPage === 1}
         className="text-black dark:text-white"
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
           size="sm"
           onClick={() => handlePageChange(1)}
           className=""
         >
           <p className="text-black dark:text-white">1</p>
         </Button>
       );
       pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
     }
 
     // Rango de páginas cercanas a la actual
     const maxVisiblePages = 5;
     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
     let endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));
 
     if (endPage - startPage < maxVisiblePages) {
       startPage = Math.max(1, endPage - maxVisiblePages + 1);
     }
 
     for (let i = startPage; i <= endPage; i++) {
       pageButtons.push(
         <Button
           key={i}
           variant="outline"
           size="sm"
           onClick={() => handlePageChange(i)}
           className={currentPage === i ? "bg-blue-500 text-white" : "text-black dark:text-white"}
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
           size="sm"
           onClick={() => handlePageChange(totalPages)}
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
         className="text-black dark:text-white "
       >
         Siguiente
       </Button>
     );
 
     return pageButtons;
   };

  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <div >
        <h1 className="text-2xl font-bold text-black dark:text-white">Proyectos</h1>
      </div>
      <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600" size="sm" onClick={insertProject} >
      <CirclePlus className="h-4 w-4"  />
          nuevo
      </Button>
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
     {/** <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveProject={saveProject} editingProject={editingProject} />*/} 
    </div>
  )
}