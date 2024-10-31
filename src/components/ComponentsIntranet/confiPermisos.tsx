'use client'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X,Edit, Trash2, CirclePlus, Plus } from "lucide-react"
import {useState, useEffect} from 'react'
import { API_PERMISOS } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import BreadcrumbItems from "@/components/breadcrumb";


const permissions = [
  { id: 1, nombre: "Insertar Proyecto" },
  { id: 2, nombre: "Editar Proyecto" },
  { id: 3, nombre: "Eliminar Proyecto" },
  { id: 1, nombre: "habilitación de solicitud para modificación" },
  { id: 2, nombre: "aceptar solicitud para eliminación" },
  { id: 3, nombre: "Crear formulario para la inserción de proyectos" },
]

// Modal para agregar un nuevo Permiso
export const EditModal = ({ isOpen, closeModal }:any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const newPer = {
      n_per: name,
      abrev: abbreviation
    };

    try {
      //Haciendo la Solicitud
      const response = await fetch(API_PERMISOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPer)
      });

      if (response.ok) {
        console.log('Permiso agregado correctamente');
        closeModal();
        // Puedes actualizar la lista de roles aquí si es necesario
      } else {
        console.error('Error al agregar el permiso');
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
        <h2 className="text-2xl font-bold mb-4 text-white">Editar</h2>
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
  const [Permisos, setPermisos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(API_PERMISOS);
        if (!response.ok) {
          throw new Error('Error al obtener los Permisos');
        }
        const data = await response.json();
        setPermisos(data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (loading) {
    return <>
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
          <Plus className="h-4 w-4" />
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
    </>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <BreadcrumbItems items={["Inicio", "Configuración", "Permisos"]} />
      <div >
        <h1 className="text-2xl font-bold text-black dark:text-white">Permisos</h1>
      </div>
      <Button variant="secondary" size="sm" onClick={toggleModal}>
      <CirclePlus className="h-4 w-4"  />
          nuevo
      </Button>
      <div className="bg-[#E3E6ED] rounded-lg">
      <Table className="w-[90%] mx-auto my-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 border-l border-gray-900">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-900">
          {Permisos.map((permission:any) => (
            <TableRow key={`${permission.id_per}-${permission.n_per}`}>
              <TableCell className=" px-4 border-l border-gray-900">{permission.id_per}</TableCell>
              <TableCell>{permission.n_per}</TableCell>
              <TableCell className="border-r border-gray-900">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <div className="flex justify-center items-center space-x-2">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} />
    </div>
  )
}