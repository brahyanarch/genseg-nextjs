'use client'
import { Search,X, PenSquare, Trash2, Circle, FilePenLine } from "lucide-react";
import {useState, useContext, useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { API_FORM } from "@/config/apiconfig";
import {AvisoContext} from '@/context/avisoContext'
import { useParams, usePathname, useRouter } from "next/navigation";
interface FormEntry {
  idf: number;
  nombre: string;
  fechaCreacion: string;
  abreviatura: string;
  active: boolean;
}
///datos locales para la prueba
const forms: FormEntry[] = [
  {
    idf: 1,
    nombre: "Formulario proyecto 2024",
    fechaCreacion: "12-02-2024",
    abreviatura: "F120224",
    active: true,
  },
  {
    idf: 2,
    nombre: "Formulario proyecto 2",
    fechaCreacion: "13-02-2024",
    abreviatura: "F130224",
    active: false,
  },
  {
    idf: 3,
    nombre: "Formulario proyecto 3",
    fechaCreacion: "14-02-2024",
    abreviatura: "F140224",
    active: false,
  },
];
// modal para editar o añadir  un formulario
export const EditModal = ({
  isOpen,
  closeModal,
  onSaveForm,
  editingForm,
}: any) => {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const {mostrarAviso} = useContext<any>(AvisoContext);
  useEffect(() => {
    if (editingForm) {
      setName(editingForm.nmForm);
      setAbbreviation(editingForm.abre);
    }
  }, [editingForm]);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const updatedForm = {
      name: name,
      abrev: abbreviation,
    };
    
    try {
      const response = await fetch(
        editingForm ? `${API_FORM}/${editingForm.idf}` : API_FORM,
        {
          method: editingForm ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedForm),
        }
      );
      
      if (response.ok) {
        const savedRole = await response.json();
        onSaveForm(savedRole);
        mostrarAviso('succefull', 'Formulario guardado correctamente.');
        closeModal();
      } else {
        mostrarAviso('warning', 'Error al guardar el Formulario.');
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
          {editingForm ? "Editar Formulario" : "Agregar Formulario"}
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
              placeholder="Sub administrador"
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
              {editingForm ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default function Component() {
  const [form, setForm] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {mostrarAviso} = useContext<any>(AvisoContext);
  /// navegacion rutas
  const router = useRouter();
  const pathname = usePathname();
  const {idForm} = useParams();
 //función para obtener datos desde la API
 const fetchForms = async () => {
  try {
    const response = await fetch(API_FORM);
    if (!response.ok) {
      throw new Error("Error al obtener los Formularios");
    }
    const data = await response.json();
    setForm(data);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// useEffect para obtener los roles desde la API al montar el componente
useEffect(() => {
  fetchForms();
}, []);

const editForm = (idForm:number) => {
   router.push(`${pathname}/editForm/${idForm}`);
};

const openEditModal = (form: any) => {
  setEditingForm(form);
  setIsModalOpen(true);
};
//funcion para editar un Rol
const saveForm = (savedForm: any) => {
  setForm((prevForms: any) => {
    if (editingForm) {
      return prevForms.map((form: any) =>
        form.id_per === savedForm.idf ? savedForm : form
      );
    } else {
      return [...prevForms, savedForm];
    }
  });
  setEditingForm(null);
  fetchForms();
};
//función para eliminar un Rol
const deleteForm = async (id: number) => {
  try {
    const response = await fetch(`${API_FORM}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setForm((prevForms:any) =>
        prevForms.filter((form: any) => form.idf !== id)
      );
      mostrarAviso('succefull', 'Formulario Eliminado correctamente.');
      fetchForms();
    } else {
      mostrarAviso('warning', 'Error al eliminar el Formulario.');
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

if (error) {
  return <p>Error: {error}</p>;
}

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edicion de formulario</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <Button className="bg-blue-500 hover:bg-blue-600" >
          + nuevo
        </Button>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-8 w-[300px]" />
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha de creacion</TableHead>
              <TableHead>Abreviatura</TableHead>
              <TableHead className="text-right">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form:any) => (
              <TableRow key={form.idf}>
                <TableCell>{form.idf}</TableCell>
                <TableCell>{form.nombre}</TableCell>
                <TableCell>{form.fechaCreacion}</TableCell>
                <TableCell>{form.abreviatura}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(form)}>
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={()=>deleteForm(form.idf)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Circle
                        className={`h-4 w-4 ${
                          form.active ? "fill-primary" : ""
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={()=>editForm(form.idf)} >
                      <FilePenLine />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled>
          Anterior
        </Button>
        <Button variant="outline" className="px-4">
          1
        </Button>
        <Button variant="outline">Siguiente</Button>
      </div>
      {/*
    <EditModal isOpen={isModalOpen} closeModal={toggleModal} onSaveForm={saveForm} editingForm={editingForm} />
      */}
      
    </div>
  );
}
