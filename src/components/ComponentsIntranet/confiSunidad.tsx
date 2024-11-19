'use client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Edit, Trash2, CirclePlus } from "lucide-react";
import { useState, useEffect,useContext } from 'react';
import { API_SUBUNIDADES } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import BreadcrumbItems from "@/components/breadcrumb";
import {AvisoContext} from '@/context/avisoContext'
// Modal para agregar un nuevo Permiso
export const EditModal = ({ isOpen, closeModal, onSaveSubUnidad, editingSubUnidad }: any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const {mostrarAviso} = useContext<any>(AvisoContext);
  useEffect(() => {
    if (editingSubUnidad) {
      setName(editingSubUnidad.n_subuni);
      setAbbreviation(editingSubUnidad.abreviatura);
    }
  }, [editingSubUnidad]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedSubUnidad = {
      nombre: name,
      abreviatura: abbreviation
    };

    try {
      const response = await fetch(editingSubUnidad ? `${API_SUBUNIDADES}/${editingSubUnidad.id_subuni}` : API_SUBUNIDADES, {
        method: editingSubUnidad ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSubUnidad)
      });

      if (response.ok) {
        const savedPermission = await response.json();
        onSaveSubUnidad(savedPermission);
        mostrarAviso('succefull', 'SubUnidad guardado correctamente.');
        closeModal();
      } else {
        mostrarAviso('warning', 'Error al guardar la SubUnidad');
      }
    } catch (error) {
      mostrarAviso('warning', 'Error al conectar con la API:', error);
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
  const [subUnidad, setSubUnidad] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubUnidad, setEditingSubUnidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {mostrarAviso} = useContext<any>(AvisoContext);
  // Funcion asíncrona para obtener los datos
  const fetchSubUnidad = async () => {
    try {
      const response = await fetch(API_SUBUNIDADES);
      if (!response.ok) {
        throw new Error('Error al obtener los Permisos');
      }
      const data = await response.json();
      setSubUnidad(data);
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
    setSubUnidad((prevSubUnidad:any) => {
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
    try {
      const response = await fetch(`${API_SUBUNIDADES}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualiza la lista de permisos eliminando el permiso
        setSubUnidad((prevSubUnidad) => prevSubUnidad.filter((subUnidad:any) => subUnidad.id_subuni !== id));
        mostrarAviso('succefull', 'SubUnidad Eliminado correctamente.');
        fetchSubUnidad();
        
      } else {
        console.error('Error al eliminar el permiso');
        mostrarAviso('warning', 'Error al eliminar la SubUnidad');
      }
    } catch (error) {
      mostrarAviso('warning', 'Error al conectar con la API:', error);
    }

  fetchSubUnidad()
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
    <div className="w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <BreadcrumbItems items={["Inicio", "Configuración", "Sub Unidad"]} />
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Sub Unidad</h1>
      </div>
      <Button variant="secondary" size="sm" onClick={toggleModal}>
        <CirclePlus className="h-4 w-4" />
        Nuevo
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
            {subUnidad.map((subUnidad: any, index) => (
              <TableRow key={subUnidad.id_subuni}>
                <TableCell className="px-4 border-l border-gray-900">{index+1}</TableCell>
                <TableCell>{subUnidad.n_subuni}</TableCell>
                <TableCell className="border-r border-gray-900">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(subUnidad)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSubUnidad(subUnidad.id_subuni)}>
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
        <Button variant="outline" size="sm">Anterior</Button>
        <Button variant="outline" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">Siguiente</Button>
      </div>
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveSubUnidad={saveSubUnidad} editingSubUnidad={editingSubUnidad} />
    </div>
  );
}
