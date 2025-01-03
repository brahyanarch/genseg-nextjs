'use client';
import { Button } from "@/components/ui/button";
import { X, Edit, Trash2, CirclePlus } from "lucide-react";
import { useState, useEffect, useContext } from 'react';
import { API_SUBUNIDADES } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { AvisoContext } from '@/context/avisoContext'
import DynamicTable from "@/components/DynamicTable";
import { Subunidad } from "@/tipos/typos"
import { usePathname } from "next/navigation";
import Swal from 'sweetalert2';


// Modal para agregar un nuevo Permiso
export const EditModal = ({ isOpen, closeModal, onSaveSubUnidad, editingSubUnidad }: any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const { mostrarAviso } = useContext<any>(AvisoContext);
  useEffect(() => {
    if (editingSubUnidad) {
      setName(editingSubUnidad.n_subuni);
      setAbbreviation(editingSubUnidad.abreviatura);
    }
  }, [editingSubUnidad]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    // Si estamos en modo de edición, no necesitamos mostrar la alerta de confirmación, solo actualizar
    const isEdit = editingSubUnidad ? true : false;
  
    // Si estamos agregando (no editando), preguntamos primero
    if (!isEdit) {
      const result = await Swal.fire({
        title: '¿Estás seguro de agregar una subunidad?',
        text: 'Se creará una nueva subunidad en el sistema.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
      });
  
      // Si el usuario confirma la acción, proceder con la creación
      if (!result.isConfirmed) return;
    }
  
    const updatedSubUnidad = {
      nombre: name,
      abreviatura: abbreviation,
    };
  
    try {
      const response = await fetch(
        isEdit ? `${API_SUBUNIDADES}/${editingSubUnidad.id_subuni}` : API_SUBUNIDADES,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSubUnidad),
        }
      );
  
      if (response.ok) {
        const savedSubUnidad = await response.json();
        onSaveSubUnidad(savedSubUnidad);
  
        // Muestra un mensaje de éxito usando SweetAlert2
        await Swal.fire(
          isEdit ? 'Actualizado!' : 'Guardado!',
          `La subunidad ha sido ${isEdit ? 'actualizada' : 'guardada'} correctamente.`,
          'success'
        );
        closeModal();
      } else {
        // Muestra un mensaje de error si la operación falla
        await Swal.fire('Error', 'Hubo un problema al guardar la subunidad.', 'error');
      }
    } catch (error) {
      // Muestra un mensaje de error si ocurre un problema de conexión
      await Swal.fire('Error', 'Error al conectar con la API: ' + error, 'error');
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
        <h2 className="text-2xl font-bold mb-4 text-white">Agregar Permiso</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Permiso"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-300 mb-1">
              Abreviatura
            </label>
            <input
              type="text"
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="Ins o Vacío"
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Component() {
  const [editingSubUnidad, setEditingSubUnidad] = useState(null);

  const [Data, setData] = useState<Subunidad[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mostrarAviso } = useContext<any>(AvisoContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(Data.length / itemsPerPage);
  ///navegacion de rutas
  const pathname = usePathname();
  // Funcion asíncrona para obtener los datos
  // Función para acceder a propiedades anidadas
  const getNestedProperty = (obj: any, key: string) => {
    return key.split('.').reduce((value, part) => value && value[part], obj);
  };

  const getSortedData = () => {
    if (!sortColumn) return Data;

    return [...Data].sort((a, b) => {
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
  const sortedData = getSortedData();
  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const configurationData = [
    {
      key: "index",
      label: "ID",
      render: (item: Subunidad) => <>{Data.indexOf(item) + 1}</>,
      sortable: true
    },
    {
      key: "n_usu",
      label: "Nombre",
      render: (item: Subunidad) => item.n_subuni,
      sortable: true,
    },
    {
      key: "rol.abrev",
      label: "Abreviatura",
      render: (item: Subunidad) => item.abreviatura,
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: Subunidad) => (
        <>
          <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
            <Edit className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteSubUnidad(item.id_subuni)}
          >
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

  const fetchSubUnidad = async () => {
    try {
      const response = await fetch(API_SUBUNIDADES);
      if (!response.ok) {
        throw new Error('Error al obtener los Permisos');
      }
      const data = await response.json();
      setData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // useEffect para obtener los permisos desde la API al montar el componente
  useEffect(() => {
    fetchSubUnidad();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const openEditModal = (subUnidad: any) => {
    setEditingSubUnidad(subUnidad);
    setIsModalOpen(true);
  };
  const saveSubUnidad = (savedSubUnidad: any) => {
    setData((prevSubUnidad: any) => {
      if (editingSubUnidad) {
        return prevSubUnidad.map((subUnidad: any) =>
          subUnidad.id_subuni === savedSubUnidad.id_subuni ? savedSubUnidad : subUnidad
        );
      } else {
        return [...prevSubUnidad, savedSubUnidad];
      }
    });
    setEditingSubUnidad(null);
    fetchSubUnidad();

  };

  const deleteSubUnidad = async (id: number) => {
    // Confirmación antes de eliminar con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar esta subunidad?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_SUBUNIDADES}/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Elimina la subunidad de la lista
          setData((prevSubUnidad) => prevSubUnidad.filter((subUnidad: any) => subUnidad.id_subuni !== id));
          
          // Muestra un mensaje de éxito usando SweetAlert2
          await Swal.fire('Eliminado!', 'La subunidad ha sido eliminada correctamente.', 'success');
          fetchSubUnidad(); // Vuelve a obtener las subunidades
        } else {
          // Muestra un mensaje de error usando SweetAlert2 si la eliminación falla
          await Swal.fire('Error', 'Hubo un problema al eliminar la subunidad.', 'error');
        }
      } catch (error) {
        // Muestra un mensaje de error si ocurre un problema en la conexión
        await Swal.fire('Error', 'Error al conectar con la API: ' + error, 'error');
      }
    } 
  };
  
  
  

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-4 w-12" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'configuracion');
  const inicio = recortarRutaHastaSegmento(pathname, 'usuarios');
  //definimos valores para el breadCrumb
  const breadcrumbData = [
    { type: "link", label: "Inicio", href: inicio },
    {
      type: "dropdown",
      label: "Configuración",
      items: [
        { label: "Permisos", href: `${configuracion}/permisos` },
        { label: "Roles", href: `${configuracion}/roles` },
        { label: "Usuarios", href: `${configuracion}/usuarios` },
      ],
    },
    { type: "page", label: "SubUbidades" },
  ];
  ////////////


  return (
    <div className="w-[90%] mx-auto  py-4  space-y-4 text-white min-h-screen">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Sub Unidad</h1>
      </div>
      <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-32 " onClick={toggleModal} >
        <CirclePlus className="h-8 w-8 " />
        <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
        <p className="font-bold" >Nuevo</p>
      </Button>
      <div className="bg-[#E3E6ED] rounded-lg">
        <DynamicTable
          configuration={configurationData}
          data={currentItems}
          onSort={handleSort}
        />
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {renderPaginationButtons()}
      </div>
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveSubUnidad={saveSubUnidad} editingSubUnidad={editingSubUnidad} />
    </div>
  );
}
