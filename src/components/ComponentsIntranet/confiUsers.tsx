'use client'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit,X, Trash2, MoreVertical, CirclePlus } from "lucide-react"
import {useState, useEffect} from "react"
import { API_USERS } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicTable from "@/components/DynamicTable";
import {User} from "@/tipos/typos"

const users = [
  { id: 1, nombre: "Jose Roberto Mamani Zaa", rol: "Sub administrador", abreviatura: "JRMZ", estado: "Activo" },
  { id: 2, nombre: "David Rodolfo Laruta", rol: "Coordinador", abreviatura: "DRL", estado: "Activo" },
  { id: 3, nombre: "Ever Laurencio Sorocco", rol: "Personal de planta", abreviatura: "ELS", estado: "Activo" },
]

// Modal para agregar un nuevo Permiso
export const EditModal = ({ isOpen, closeModal, onSaveSubUnidad, editingSubUnidad }: any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  useEffect(() => {
    if (editingSubUnidad) {
      setName(editingSubUnidad.n_per);
      setAbbreviation(editingSubUnidad.abrev);
    }
  }, [editingSubUnidad]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedSubUnidad = {
      nombre: name,
      abreviatura: abbreviation
    };

    try {
      const response = await fetch(editingSubUnidad ? `${API_USERS}/${editingSubUnidad.id_per}` : API_USERS, {
        method: editingSubUnidad ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSubUnidad)
      });

      if (response.ok) {
        const savedPermission = await response.json();
        console.log('Permiso guardado correctamente');
        onSaveSubUnidad(savedPermission);
        closeModal();
      } else {
        console.error('Error al guardar el permiso');
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [Users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const totalPages = Math.ceil(Users.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
      render: (item: User) => <>{Users.indexOf(item) + 1}</>,
      sortable:true,
    },
    {
      key: "n_usu",
      label: "Nombre",
      render: (item: User) => item.n_usu,
      sortable: true,
    },
    {
      key: "rol.n_rol",
      label: "Rol",
      render: (item: User) => item.rol?.n_rol,
      sortable: true,
    },
    {
      key: "sub_uni.n_subuni",
      label: "Sub Unidad",
      render: (item: User) => item.sub_uni?.n_subuni,
      sortable: true,
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: User) => (item.estado ? <Button className="bg-green-500">Activo</Button> : <Button className="bg-red-400">Desactivo</Button>),
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: User) => (
        <>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Eliminar", item.dni)}
          >
            <Trash2 className="h-4 w-4" />
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
        >
          1
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
          className={currentPage === i ? "bg-blue-500 text-white" : ""}
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
          {totalPages}
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
      >
        Siguiente
      </Button>
    );

    return pageButtons;
  };

  // Funcion asíncrona para obtener los datos
  const fetchSubUnidad = async () => {
    try {
      const response = await fetch(API_USERS);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsers(data);
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
    setEditingUser(subUnidad);
    setIsModalOpen(true);
  };
  const saveSubUnidad = (savedSubUnidad: any) => {
    setEditingUser((prevSubUnidad:any) => {
      if (editingUser) {
        return prevSubUnidad.map((subUnidad: any) => 
          subUnidad.id_per === savedSubUnidad.id_per ? savedSubUnidad : subUnidad
        );
      } else {
        return [...prevSubUnidad, savedSubUnidad];
      }
    });
    setEditingUser(null);
    fetchSubUnidad();
    
  };

  const deleteSubUnidad = async (id: number) => {
    try {
      const response = await fetch(`${API_USERS}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualiza la lista de permisos eliminando el permiso
        setUsers((prevSubUnidad) => prevSubUnidad.filter((subUnidad:any) => subUnidad.id_per !== id));
        console.log('Permiso eliminado correctamente');
      } else {
        console.error('Error al eliminar el permiso');
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
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

  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <div >
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>
      <Button variant="secondary" size="sm" >
      <CirclePlus className="h-4 w-4" />
          nuevo
      </Button>
      <div className="bg-[#E3E6ED] rounded-lg ">
      <DynamicTable
        configuration={configurationUser}
        data={currentItems}
        onSort={handleSort}
      />
      <div className="flex justify-center space-x-2 mt-4">
        {renderPaginationButtons()}
      </div>
      </div>
      
    </div>
  )
}