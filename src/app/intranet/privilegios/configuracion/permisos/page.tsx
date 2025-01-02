'use client';
import { Button } from "@/components/ui/button";
import { X, Edit, Trash2, CirclePlus } from "lucide-react";
import { useState, useEffect, useContext } from 'react';
import { API_PERMISOS } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { AvisoContext } from '@/context/avisoContext'
import DynamicTable from "@/components/DynamicTable";
import { Permisos } from "@/tipos/typos"
import { usePathname } from "next/navigation";
import Swal from 'sweetalert2';


// Modal para agregar o editar un Permiso
export const EditModal = ({ isOpen, closeModal, onSavePermission, editingPermission }: any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const { mostrarAviso } = useContext<any>(AvisoContext);

  useEffect(() => {
    if (editingPermission) {
      setName(editingPermission.n_per);
      setAbbreviation(editingPermission.abreviatura);
    }
  }, [editingPermission]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    // Mostrar confirmación de SweetAlert antes de guardar
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${editingPermission ? 'actualizar' : 'guardar'} el permiso?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedPermission = {
          n_per: name,
          abrev: abbreviation,
        };
  
        try {
          const response = await fetch(editingPermission ? `${API_PERMISOS}/${editingPermission.id_per}` : API_PERMISOS, {
            method: editingPermission ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPermission)
          });
  
          if (response.ok) {
            const savedPermission = await response.json();
            onSavePermission(savedPermission);
            Swal.fire('¡Éxito!', 'Permiso guardado correctamente.', 'success');
            closeModal();
          } else {
            Swal.fire('Error', 'Error al guardar el permiso.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', `Error al conectar con la API: ${error}`, 'error');
        }
      }
    });
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-xl w-[50%] h-[60%]">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white dark:text-gray-800">{editingPermission ? 'Editar Permiso' : 'Agregar Permiso'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-800">
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
              {editingPermission ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Component() {
  //const [Permisos, setPermisos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const { mostrarAviso } = useContext<any>(AvisoContext);

  const [Users, setUsers] = useState<Permisos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(Users.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  //manejo de rutas
  const pathname = usePathname();
  /// función para obtener datos desde la API
  const fetchPermisos = async () => {
    try {
      const response = await fetch(API_PERMISOS);
      if (!response.ok) {
        throw new Error('Error al obtener los Permisos');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  ///obtener los datos existentes en la base de datos desde la API
  useEffect(() => {
    fetchPermisos();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openEditModal = (permission: any) => {
    setEditingPermission(permission);
    setIsModalOpen(true);
  };

  const savePermission = (savedPermission: any) => {
    setUsers((prevPermisos: any) => {
      if (editingPermission) {
        return prevPermisos.map((permiso: any) =>
          permiso.id_per === savedPermission.id_per ? savedPermission : permiso
        );
      } else {
        return [...prevPermisos, savedPermission];
      }
    });
    setEditingPermission(null);
    fetchPermisos();

  };

  const deletePermission = async (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Realmente deseas eliminar este permiso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_PERMISOS}/${id}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            setUsers((prevPermisos) => prevPermisos.filter((permiso: any) => permiso.id_per !== id));
            Swal.fire('¡Eliminado!', 'Permiso eliminado correctamente.', 'success');
            fetchPermisos();
          } else {
            Swal.fire('Error', 'Error al eliminar el permiso.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', `Error al conectar con la API: ${error}`, 'error');
        }
      }
    });
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


  // Función para acceder a propiedades anidadas
  const getNestedProperty = (obj: any, key: string) => {
    return key.split('.').reduce((value, part) => value && value[part], obj);
  };

  // Función para ordenar los datos
  const getSortedData = () => {
    if (!sortColumn) return Users;

    return [...Users].sort((a, b) => {
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
      render: (item: Permisos) => <>{Users.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "n_usu",
      label: "Nombre",
      render: (item: Permisos) => item.n_per,
      sortable: true,
    },
    {
      key: "abrev.abrev",
      label: "Abreviatura",
      render: (item: Permisos) => item.abreviatura,
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: Permisos) => (
        <>
          <Button variant="ghost" size="icon"
          onClick={()=>openEditModal(item)}
          >
            <Edit className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deletePermission(item.id_per)}
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
    const maxVisiblePages = 4;
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
  const configuracion = recortarRutaHastaSegmento(pathname, 'configuracion');
  const inicio = recortarRutaHastaSegmento(pathname, 'usuarios');
  //definimos valores para el breadCrumb
  const breadcrumbData = [
    { type: "link", label: "Inicio", href: inicio },
    {
      type: "dropdown",
      label: "Configuración",
      items: [
        { label: "Roles", href: `${configuracion}/roles` },
        { label: "Subunidades", href: `${configuracion}/subUnidades` },
        { label: "Usuarios", href: `${configuracion}/usuarios` },
      ],
    },
    { type: "page", label: "Permisos" },
  ];
  ////////////
  return (
    <div className="w-[90%] mx-auto  py-4  space-y-4 text-white min-h-screen">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Permisos</h1>
      </div>
      <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-32 "  onClick={() => { setEditingPermission(null); toggleModal(); }} >
        <CirclePlus className="h-8 w-8 " />
        <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
            <p  className="font-bold" >Nuevo</p>
      </Button>
      <DynamicTable
        configuration={configurationUser}
        data={currentItems}
        onSort={handleSort}
      />
      <div className="flex justify-center space-x-2 mt-4">
        {renderPaginationButtons()}
      </div>
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSavePermission={savePermission} editingPermission={editingPermission} />
    </div>
  );
}
///