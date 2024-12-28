'use client'
import { Card } from "@/components/ui/card"
import { Edit, Trash2, Eye,Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {useState, useEffect} from "react"
import { API_PROJECT_ACTIVITIES } from "@/config/apiconfig";
import {usePathname, useRouter, useParams } from "next/navigation"
import DynamicTable from "@/components/DynamicTable";
//
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

export function TaskList({toggleOpenDetsAct, typeEdit}:any) {

  //variable importantes
  const [activitiesProject, setActivitiesProjects ] = useState<Activities[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(activitiesProject.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const {projectId} = useParams();
  /// Fucion para cambiar a interfaz de detalles de una actividad 
  //función para obtener datos desde la API
 const fetchActivitiesProject = async () => {
  try {
    const response = await fetch(`${API_PROJECT_ACTIVITIES}/${projectId}`);
    if (!response.ok) {
      throw new Error("Error al obtener los Proyectos");
    }
    const data = await response.json();
    setActivitiesProjects(data.actividades);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
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

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Configuración de la tabla
  const configurationUser = [
    {
      key: "index",
      label: "ID",
      render: (item: Activities) => <>{activitiesProject.indexOf(item) + 1}</>,
      sortable:true,
    },
    {
      key: "n_usu",
      label: "Nombre",
      render: (item: Activities) => item.name,
      sortable: true,
    },
    {
      key: "abrev.abrev",
      label: "Escuela Profesional",
      render: (item: Activities) => item.idString,
      sortable: true,
    },
    {
      key: "dateNow",
      label: "Fecha Inicio",
      render: (item: Activities) => item.fInit,
      sortable: true,
    },
    {
      key: "dateNow",
      label: "Fecha Final",
      render: (item: Activities) => item.fFin,
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
          {
            typeEdit && (
              <>
                <Button variant="ghost" size="icon">
                  <Edit className="h-5 w-5"  strokeWidth={2.5} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => console.log("Eliminar", item.id)}
                >
                  <Trash2 className="h-5 w-5"  strokeWidth={2.5} />
                </Button>
              </>
            )
          }
          <Button variant="ghost" size="icon" onClick={()=>toggleOpenDetsAct(item.idActivi)} >
            <Eye className="h-5 w-5"  strokeWidth={2.5}  />
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
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));

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
  
  return (
    <Card className="w-full p-4 bg-white dark:bg-gray-900">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lista de Tareas (6)</h2>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar tareas" className="pl-9" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            {
              typeEdit && (
                <Button className="bg-blue-500 hover:bg-blue-600 h-12 w-32 "  >
                  Nueva Actividad
                </Button>
              )
            }
          </div>
        </div>

        <DynamicTable
        configuration={configurationUser}
        data={currentItems}
        onSort={handleSort}
      />
       <div className="flex justify-center space-x-2 mt-4">
        {renderPaginationButtons()}
      </div>
      </div>
    </Card>
  )
}