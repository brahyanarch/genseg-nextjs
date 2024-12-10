'use client'
import {useState, useEffect,useContext} from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { API_PROJECTS } from "@/config/apiconfig";
import {AvisoContext} from '@/context/avisoContext'
import { Edit,X, Trash2, MoreVertical, CirclePlus } from "lucide-react"

interface Project {
    id: number;
    nombre: string;
    escuelaProfesional: string;
    fecha: string;
    estado: 'PENDIENTE' | 'ARCHIVADO' | 'COMPLETADO' | 'EN CURSO';
  }
  
  const proyectos: Project[] = [
    { id: 1, nombre: "Proyecto campos verdes", escuelaProfesional: "EPIS", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
    { id: 2, nombre: "Limpieza en el bosque", escuelaProfesional: "EPIME", fecha: "11/02/24 - 26/11/24", estado: "ARCHIVADO" },
    { id: 3, nombre: "Nombre del proyecto", escuelaProfesional: "EPEE", fecha: "11/02/24 - 26/11/24", estado: "COMPLETADO" },
    { id: 1, nombre: "Nombre del proyecto", escuelaProfesional: "EPE", fecha: "11/02/24 - 26/11/24", estado: "EN CURSO" },
    { id: 2, nombre: "Nombre del proyecto", escuelaProfesional: "EPN", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
    { id: 3, nombre: "Nombre del proyecto", escuelaProfesional: "EPMH", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
  ]

 
// modal para editar o añadir  un formulario
export const EditModal = ({
  isOpen,
  closeModal,
  onSaveProject,
  editingProject,
}: any) => {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const {mostrarAviso} = useContext<any>(AvisoContext);
  useEffect(() => {
    if (editingProject) {
      setName(editingProject.n_rol);
      setAbbreviation(editingProject.abrev);
    }
  }, [editingProject]);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedForm = {
      n_rol: name,
      abrev: abbreviation,
    };
    
    try {
      const response = await fetch(
        editingProject ? `${API_PROJECTS}/${editingProject.idf}` : API_PROJECTS,
        {
          method: editingProject ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedForm),
        }
      );
      
      if (response.ok) {
        const savedRole = await response.json();
        onSaveProject(savedRole);
        mostrarAviso('succefull', 'Proyecto guardado correctamente.');
        closeModal();
      } else {
        mostrarAviso('warning', 'Error al guardar el Proyecto.');
      }
    } catch (error) {
      mostrarAviso('warning', 'Error al conectar con la API.');
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
          {editingProject ? "Editar Proyecto" : "Agregar Proyecto"}
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
              placeholder="Poyecto 1"
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
              {editingProject ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 


export default function Component() {
  const [projects, setProjects] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {mostrarAviso} = useContext<any>(AvisoContext);

 //función para obtener datos desde la API
 const fetchProjects = async () => {
  try {
    const response = await fetch(API_PROJECTS);
    if (!response.ok) {
      throw new Error("Error al obtener los Proyectos");
    }
    const data = await response.json();
    setProjects(data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// useEffect para obtener los roles desde la API al montar el componente
{/**   useEffect(() => {
    fetchProjects();
  }, []);*/}

const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};
const openEditModal = (Project: any) => {
  setEditingProject(Project);
  setIsModalOpen(true);
};
//funcion para editar un Rol
const saveProject = (savedProject: any) => {
  setProjects((prevProjects: any) => {
    if (editingProject) {
      return prevProjects.map((form: any) =>
        form.id_per === savedProject.idf ? savedProject : form
      );
    } else {
      return [...prevProjects, savedProject];
    }
  }); 
  setEditingProject(null);
  fetchProjects();
};
//función para eliminar un Rolgit
const deleteProject = async (id: number) => {
  try {
    const response = await fetch(`${API_PROJECTS}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProjects((prevProjects:any) =>
        prevProjects.filter((form: any) => form.idf !== id)
      );
      mostrarAviso('succefull', 'Proyecto Eliminado correctamente.');
      fetchProjects();
    } else {
      mostrarAviso('warning', 'Error al eliminar el Proyecto.');
    }
  } catch (error) {
    mostrarAviso('warning', "Error al conectar con la API:", error);
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
  //función para identificar estados del proyecto
  const getStatusClass = (status: Project["estado"]) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-orange-100 text-orange-800 border-2 border-orange-300 dark:bg-orange-900 dark:text-orange-200 "
      case "ARCHIVADO":
        return "bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900 dark:text-red-200"
      case "COMPLETADO":
        return "bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900 dark:text-green-200"
      case "EN CURSO":
        return "bg-blue-100 text-blue-800 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-200"
    }
  }
if (error) {
  return <p>Error: {error}</p>;
}
  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <div >
        <h1 className="text-2xl font-bold text-black dark:text-white">Proyectos</h1>
      </div>
      <Button variant="default" size="sm" className='bg-blue-600'>
      <CirclePlus className="h-4 w-4" onClick={toggleModal} />
          nuevo
      </Button>
      <div className="bg-[#E3E6ED] rounded-lg ">
      <Table className="w-[90%] mx-auto my-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 border-l border-gray-900">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Escuela Profesional</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-900">
          {proyectos.map((proyect) => (
            <TableRow key={proyect.id}>
              <TableCell className="px-4 border-l border-gray-900">{proyect.id}</TableCell>
              <TableCell>{proyect.nombre}</TableCell>
              <TableCell>{proyect.escuelaProfesional}</TableCell>
              <TableCell>{proyect.fecha}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(proyect.estado)}`}>
                    {proyect.estado}
                </span>
              </TableCell>
              <TableCell className="border-r border-gray-900">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(proyect)} >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={()=>deleteProject(proyect.id)}>
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
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveProject={saveProject} editingProject={editingProject} />
    </div>
  )
}