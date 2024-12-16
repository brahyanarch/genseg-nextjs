'use client'
import { Card } from "@/components/ui/card"
import { Edit, Trash2, Eye,Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {useState} from "react"
import DynamicTable from "@/components/DynamicTable";
//
interface Task {
  id: number
  name: string
  escuelaPro: string
  date: string
  status: "COMPLETADO" | "EN CURSO" | "PENDIENTE"
}

const tasks: Task[] = [
  {
    id: 1,
    name: "Convacatorio",
    escuelaPro: "EPIS",
    date: "12 Nov, 2024",
    status: "COMPLETADO",
  },
  {
    id: 2,
    name: "Convacatorio",
    escuelaPro: "EPIS",
    date: "12 Nov, 2024",
    status: "COMPLETADO",
  },
  {
    id: 3,
    name: "Convacatorio",
    escuelaPro: "EPIS",
    date: "12 Nov, 2024",
    status: "COMPLETADO",
  },
  {
    id: 4,
    name: "Convacatorio",
    escuelaPro: "EPIS",
    date: "12 Nov, 2024",
    status: "COMPLETADO",
  },
  {
    id: 5,
    name: "Convacatorio",
    escuelaPro: "EPIS",
    date: "12 Nov, 2024",
    status: "COMPLETADO",
  },
  {
    id: 6,
    name: "Convacatorio",
    escuelaPro: "EPIS",
    date: "12 Nov, 2024",
    status: "COMPLETADO",
  },
]

export function TaskList({toggleOpenDetsAct}) {
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Función para acceder a propiedades anidadas
  const getNestedProperty = (obj: any, key: string) => {
    return key.split('.').reduce((value, part) => value && value[part], obj);
  };

  // Función para ordenar los datos
  const getSortedData = () => {
    if (!sortColumn) return tasks;

    return [...tasks].sort((a, b) => {
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
      render: (item: Task) => <>{tasks.indexOf(item) + 1}</>,
      sortable:true,
    },
    {
      key: "n_usu",
      label: "Nombre",
      render: (item: Task) => item.name,
      sortable: true,
    },
    {
      key: "abrev.abrev",
      label: "Escuela Profesional",
      render: (item: Task) => item.escuelaPro,
      sortable: true,
    },
    {
      key: "dateNow",
      label: "Fecha",
      render: (item: Task) => item.date,
      sortable: true,
    },
    {
      key: "status",
      label: "Estado",
      render: (item: Task) => item.status,
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: Task) => (
        <div className=" flex justify-center items-center">
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
          <Button variant="ghost" size="icon" onClick={()=>toggleOpenDetsAct(item.id)} >
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
            <div className="flex items-center gap-1 text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
              <span>6 Tareas</span>
            </div>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
              Ordenar
            </Button>
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
        <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0">
          + Agregar nuevo plan
        </Button>
      </div>
    </Card>
  )
}