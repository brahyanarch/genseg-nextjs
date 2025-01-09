'use client'
import { Search, X, PenSquare, Trash2, Circle, CirclePlus, FilePenLine } from "lucide-react";
import { useState, useContext, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicTable from "@/components/DynamicTable";
import { API_FORM , API_GET_FORM_BY_SUBUNI, API_URL} from "@/config/apiconfig";
import { AvisoContext } from '@/context/avisoContext'
import { useParams, usePathname, useRouter } from "next/navigation";
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { BreadcrumbItemType } from "@/tipos/typos";
import Swal from 'sweetalert2';
import { set } from "date-fns";
type FormEntry = {
  idf: number;
  nmForm: string;
  estado: boolean;
  abre: string;
  Fcreate: string;
  Fupdate: string;
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
export const EditModal = ({isOpen,closeModal,onSaveForm,editingForm,}: any) => {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const { mostrarAviso } = useContext<any>(AvisoContext);
  const { dni, idrol, idsubuni } = useParams();
  useEffect(() => {
    if (editingForm) {
      setName(editingForm.nmForm);
      setAbbreviation(editingForm.abre);
    }
    else {
      setName("");
      setAbbreviation("");
    }
  }, [editingForm]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedForm = {
      name: name,
      abrev: abbreviation,
      idsubunidad: idsubuni,
    };
    console.log(updatedForm, "datos del formulario");
    try {
      console.log("entro al try", updatedForm );
      const response = await fetch(
        editingForm ? `${API_URL}/api/form/${editingForm.idf}` : `${API_URL}/api/form`,
        {
          method: editingForm ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedForm),
        }
      );

      if (response.ok) {
        const savedRole = await response.json();
        onSaveForm(savedRole);
        mostrarAviso('succefull', 'Formulario guardado correctamente.');
        // Mostrar un SweetAlert de éxito con el check
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Rol actualizado correctamente.',
          confirmButtonText: 'OK',
        });

        closeModal();
      } else {
        Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al actualizar el Formulario.',
              confirmButtonText: 'OK',
            });
      }
    } catch (error) {
      // Si el servidor no responde bien, mostrar un SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el rol.',
        confirmButtonText: 'OK',
      });
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-[50%] h-[60%]">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">
          {editingForm ? "Editar Formulario" : "Agregar Formulario"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sub administrador"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="abbreviation"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Abreviatura
            </label>
            <input
              type="text"
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="SubAdm"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {editingForm ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default function Component() {
  const [form, setForm] = useState<FormEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { mostrarAviso } = useContext<any>(AvisoContext);
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


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  
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

  const toggleStateForm = async (idf: number) => {
      try {
        
        // Realiza la petición PUT para actualizar el estado del usuario
        const response = await fetch(`${API_URL}/api/form/toggle`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idf: idf,
            idsubuni: idsubuni,
          }),
        });
        console.log("Respuesta del servidor:", response);
  
        if (response.ok) {
          const updatedData = await response.json();
          // Actualiza el estado local de los usuarios en el frontend
          setForm(updatedData.allform);
          console.log("Estado actualizado:", updatedData);
          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: 'El estado del usuario ha sido actualizado correctamente.',
            confirmButtonText: 'OK',
          });

        } else {
          const errorData = await response.json();
          console.error("Error al actualizar el estado del usuario:", errorData.message);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el estado',
            text: 'Hubo un problema al actualizar el estado del usuario.',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {

        console.error("Error al cambiar el estado del usuario:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el estado',
          text: 'Hubo un problema al actualizar el estado del usuario.',
          confirmButtonText: 'OK',
        });
      }
    };

  // Configuración de la tabla
  const configurationUser = [
    {
      key: "idf",
      label: "ID",
      render: (item: FormEntry) => <>{form.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "nmForm",
      label: "Nombre",
      render: (item: FormEntry) => <div className="w-32 truncate">{item.nmForm}</ div>,
      sortable: true,
    },
    {
      key: "abre",
      label: "Abreviatura",
      render: (item: FormEntry) => <div className="w-32 truncate">{item.abre}</ div>,
      sortable: true,
    },
    {
      key: "Fcreate",
      label: "Fecha Creación",
      render: (item: FormEntry) => new Date(item.Fcreate).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: FormEntry) => (
        <>
          <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
            <PenSquare className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteForm(item.idf)}>
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button variant="ghost" size="icon">
            <Circle
              className={`h-5 w-5 ${item.estado ? "fill-primary dark:fill-slate-950" : ""}`}
              strokeWidth={2}
              onClick={ item.estado ? () => {} : () => toggleStateForm(item.idf)}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => editForm(item.idf)} >
            <FilePenLine className="h-5 w-5" strokeWidth={2.5} />
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
  //función para obtener datos desde la API
  const fetchForms = async () => {
    try {
      const response = await fetch(`${API_GET_FORM_BY_SUBUNI}/${idsubuni}`);
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
    fetchForms();
  }, []);

  const editForm = (idForm: number) => {
    router.push(`${pathname}/editForm/${idForm}`);
  };

  const openEditModal = (form: any) => {
    setEditingForm(form);
    setIsModalOpen(true);
  };
  //funcion para editar un Rol
  const saveForm = (savedForm: any) => {
    setForm((prevForms: any) => {
      if (editingForm) {
        return prevForms.map((form: any) =>
          form.id_per === savedForm.idf ? savedForm : form
        );
      } else {
        return [...prevForms, savedForm];
      }
    });
    setEditingForm(null);
    fetchForms();
  };
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
        fetchForms();
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

   ///recortar rutas
   const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'subConfiguraciones');
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData:BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href:`${inicio}/${dni}/${idrol}/${idsubuni}` },
    {
      type: "dropdown",
      label: "Sub configuraciones",
      items: [
        { label: "Usuarios", href: `${configuracion}/usuarios` },
      ],
    },
    { type: "page", label: "Formularios" },
  ];

  return (
    <div className="w-[90%] max-w-6xl mx-auto p-4 text-black dark:text-white space-y-4">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      <h1 className="text-2xl font-bold  ">Formularios</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-32 "   
          onClick={toggleModal}
        >
          <CirclePlus className="h-8 w-8 " />
          <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
          <p className="font-bold" >Nuevo</p>
        </Button>
        
      </div>
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
      
    <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveForm={saveForm} editingForm={editingForm} />
      

    </div>
  );
}
