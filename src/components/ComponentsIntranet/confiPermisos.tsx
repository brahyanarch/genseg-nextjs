'use client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Edit, Trash2, CirclePlus } from "lucide-react";
import { useState, useEffect } from 'react';
import { API_PERMISOS } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import BreadcrumbItems from "@/components/breadcrumb";

// Modal para agregar o editar un Permiso
export const EditModal = ({ isOpen, closeModal, onSavePermission, editingPermission }: any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  useEffect(() => {
    if (editingPermission) {
      setName(editingPermission.n_per);
      setAbbreviation(editingPermission.abrev);
    }
  }, [editingPermission]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedPermission = {
      n_per: name,
      abrev: abbreviation
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
        console.log('Permiso guardado correctamente');
        onSavePermission(savedPermission);
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
  const [Permisos, setPermisos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /// función para obtener datos desde la API
  const fetchPermisos = async () => {
    try {
      const response = await fetch(API_PERMISOS);
      if (!response.ok) {
        throw new Error('Error al obtener los Permisos');
      }
      const data = await response.json();
      setPermisos(data);
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
    setPermisos((prevPermisos:any) => {
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
    try {
      const response = await fetch(`${API_PERMISOS}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPermisos((prevPermisos) => prevPermisos.filter((permiso:any) => permiso.id_per !== id));
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
    <div className="w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <BreadcrumbItems items={["Inicio", "Configuración", "Permisos"]} />
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Permisos</h1>
      </div>
      <Button variant="secondary" size="sm" onClick={() => { setEditingPermission(null); toggleModal(); }}>
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
            {Permisos.map((permission: any) => (
              <TableRow key={permission.id_per}>
                <TableCell className="px-4 border-l border-gray-900">{permission.id_per}</TableCell>
                <TableCell>{permission.n_per}</TableCell>
                <TableCell className="border-r border-gray-900">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(permission)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deletePermission(permission.id_per)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSavePermission={savePermission} editingPermission={editingPermission} />
    </div>
  );
}
///