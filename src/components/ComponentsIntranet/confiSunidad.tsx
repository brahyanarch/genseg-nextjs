'use client' 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, CirclePlus, X } from "lucide-react";

const subUnidades = [
  { id: 1, nombre: "Proyeccion social y extension Universitaria", abreviatura: "PSEU" },
  { id: 2, nombre: "Seguimiento y Desarrollo del Graduado", abreviatura: "SDG" },
  { id: 3, nombre: "Gestion Ambiental", abreviatura: "GA" },
];

// Modal para agregar una nueva Sub Unidad
function AddSubUnidadModal({ isOpen, closeModal, addSubUnidad }: any) {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const newRole = {
      nombre: name,
      abreviatura: abbreviation
    };

    try {
      const response = await fetch('http://localhost:3000/api/subunidad', {
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
        <h2 className="text-2xl font-bold mb-4 text-white">Agregar Sub Unidad</h2>
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
              placeholder="Nombre de la sub unidad"
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
              placeholder="Abreviatura"
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
}

export default function Component() {
  const [SubUnidad, setSubUnidad] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para obtener los roles desde la API al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/subunidad');
        if (!response.ok) {
          throw new Error('Error al obtener las Sub Unidades');
        }
        const data = await response.json();
        setSubUnidad(data);
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
    return <p>Cargando la Lista de Sub Unidades...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Sub Unidad</h1>
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
              <TableHead>Abreviatura</TableHead>
              <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-900">
            {SubUnidad.map((subUnidad:any) => (
              <TableRow key={subUnidad.id_subUni}>
                <TableCell className="px-4 border-l border-gray-900">{subUnidad.id_subUni}</TableCell>
                <TableCell>{subUnidad.n_subUni}</TableCell>
                <TableCell>{subUnidad.abrev}</TableCell>
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
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>

      {/* Modal para agregar una nueva sub unidad */}
      <AddSubUnidadModal isOpen={isModalOpen} closeModal={toggleModal}  />
    </div>
  );
}
