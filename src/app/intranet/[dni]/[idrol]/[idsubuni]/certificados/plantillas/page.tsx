'use client'
import { Search, PenSquare, Trash2, CirclePlus } from "lucide-react";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DynamicTable from "@/components/DynamicTable";
import { API_URL } from "@/config/apiconfig";
import { useParams, usePathname, useRouter } from "next/navigation";
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { BreadcrumbItemType } from "@/tipos/typos";
import Swal from 'sweetalert2';
import SkeletonTable from "@/components/skeletonTable";
type FormEntry = {
  idf: number;
  nombre: string;
  tipo: string;
  createdAt: string;
}
///datos locales para la prueba
/*const forms: FormEntry[] = [
  {
    idf: 1,
    nmForm: "Formulario proyecto 2024",
    Fcreate: "12-02-2024",
    abre: "F120224",
    estado: true,
  },
  {
    idf: 2,
    nmForm: "Formulario proyecto 2",
    Fcreate: "13-02-2024",
    abre: "F130224",
    estado: false,
  },
  {
    idf: 3,
    nmForm: "Formulario proyecto 3",
    Fcreate: "14-02-2024",
    abre: "F140224",
    estado: false,
  },
];*/
// modal para editar o añadir  un formulario

export default function PlantillaCertificado() {
  const [form, setForm] = useState<FormEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { dni, idsubuni, idrol } = useParams();
  ///variables necesarios para la tabla dinámica
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(form.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!sortColumn) return form;

    return [...form].sort((a, b) => {
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
  // Configuración de la tabla
  const configurationUser = [
    {
      key: "idp",
      label: "ID",
      render: (item: FormEntry) => <>{form.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "nmPlantilla",
      label: "Nombre",
      render: (item: FormEntry) => <div className="w-32 truncate">{item.nombre}</ div>,
      sortable: true,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (item: FormEntry) => <div className="w-32 truncate">{item.tipo}</ div>,
      sortable: true,
    },
    {
      key: "Fcreate",
      label: "Fecha Creación",
      render: (item: FormEntry) => new Date(item.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: FormEntry) => (
        <>
          <Button variant="ghost" size="icon" onClick={() => editPlantilla(item.idf)}>
            <PenSquare className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteForm(item.idf)}>
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
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
  //función para obtener datos desde la API
  const fetchPlantillas = async () => {
    try {
      const response = await fetch(`${API_URL}/plantilla/${idsubuni}`);
      if (!response.ok) {
        throw new Error("Error al obtener los Formularios");
      }
      const data = await response.json();
      setForm(data);
    } catch (err: any) {

    } finally {
      setLoading(false);
    }
  };

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    fetchPlantillas();
  }, []);

  const editPlantilla = (idPlant: number) => {
    router.push(`${pathname}/editaPlantilla/${idPlant}`);
  };
  //función para insertar una nueva plantilla
  const insertPlantilla = () => {
    router.push(`${pathname}/insertPlantilla`);
  }

  //función para eliminar un Rol
  const deleteForm = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/form/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setForm((prevForms: any) =>
          prevForms.filter((form: any) => form.idf !== id)
        );
        // Si el servidor no responde bien, mostrar un SweetAlert de error
        Swal.fire({
          icon: 'success',
          title: 'Formulario eliminado correctamente',
          text: 'El formulario se ha creado correctamente.',
          confirmButtonText: 'OK',
        });
        fetchPlantillas();
      } else {
        // Si el servidor no responde bien, mostrar un SweetAlert de error
        Swal.fire({
          icon: 'error',
          title: 'El formulario no se eliminio correctamente',
          text: 'Hubo un problema al eliminar el formulario.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      // Si el servidor no responde bien, mostrar un SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'El formulario no se eliminio correctamente',
        text: 'Hubo un problema al eliminar el formulario.',
        confirmButtonText: 'OK',
      });
    }
  };

  if (loading) {
    return (
      <SkeletonTable />
    );
  }

  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  //recortamos las rutas requeridas
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData: BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: `${inicio}/${dni}/${idrol}/${idsubuni}` },
    {
      type: "page",
      label: "Certificados",

    },
    { type: "page", label: "Plantillas" },
  ];

  return (
    <div className="w-[90%] max-w-6xl mx-auto p-4 text-black dark:text-white space-y-4">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      <h1 className="text-2xl font-bold  ">Plantillas</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-52 "
          onClick={insertPlantilla}
        >
          <CirclePlus className="h-8 w-8 " />
          <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
          <p className="font-bold" >Nueva Plantilla</p>
        </Button>
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
      <div className="bg-[#E3E6ED] rounded-lg  ">
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
  );
}
