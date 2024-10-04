'use client'
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Edit, Trash2, List, CirclePlus } from "lucide-react";

// Modal para agregar un nuevo Rol
export const EditModal = ({ isOpen, closeModal }:any) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const newRole = {
      n_rol: name,
      abrev: abbreviation
    };

    try {
      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRole)
      });

      if (response.ok) {
        console.log('Rol agregado correctamente');
        closeModal();
        // Puedes actualizar la lista de roles aquí si es necesario
      } else {
        console.error('Error al agregar el rol');
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
              placeholder="Sub administrador"
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Component = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/roles');
        if (!response.ok) {
          throw new Error('Error al obtener los roles');
        }
        const data = await response.json();
        setRoles(data);
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
    return <p>Cargando roles...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4 m-4 space-y-4 w-[90%] mt-4 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" size="sm" onClick={toggleModal}>
          <CirclePlus className="h-4 w-4" />
          Nuevo
        </Button>
        <Input className="w-64" placeholder="Buscar..." />
      </div>
      <div className="bg-[#E3E6ED] rounded-lg">
        <Table className="w-[90%] mx-auto my-6 border-1">
          <TableHeader className="bg-gray-900 text-white">
            <TableRow>
              <TableHead className="border-l border-gray-900">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Abreviatura</TableHead>
              <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#FFFFFF] text-[#141824]">
            {roles.map((role:any) => (
              <TableRow key={role.id_rol}>
                <TableCell className="px-6 border-l border-gray-900">{role.id_rol}</TableCell>
                <TableCell>{role.n_rol}</TableCell>
                <TableCell>{role.abrev}</TableCell>
                <TableCell className="px-2 border-r border-gray-900">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <List className="h-4 w-4" />
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

      <EditModal isOpen={isModalOpen} closeModal={toggleModal} />
    </div>
  );
};

export default Component;
