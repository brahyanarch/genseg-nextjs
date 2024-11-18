'use client'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit,X, Trash2, MoreVertical, CirclePlus } from "lucide-react"
import {useState, useEffect} from "react"
import { API_USERS } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  const [user, setUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Funcion asíncrona para obtener los datos
  const fetchSubUnidad = async () => {
    try {
      const response = await fetch(API_USERS);
      if (!response.ok) {
        throw new Error('Error al obtener los Permisos');
      }
      const data = await response.json();
      setUser(data);
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
        setUser((prevSubUnidad) => prevSubUnidad.filter((subUnidad:any) => subUnidad.id_per !== id));
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
      <Table className="w-[90%] mx-auto my-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 border-l border-gray-900">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Abreviatura</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-900">
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-4 border-l border-gray-900">{user.id}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>{user.abreviatura}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                  {user.estado}
                </span>
              </TableCell>
              <TableCell className="border-r border-gray-900">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <span>1</span>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>
    </div>
  )
}