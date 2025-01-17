'use client'
import { Button } from "@/components/ui/button"
import { Edit, X, Trash2, CirclePlus, CheckIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { API_USERS, API_CREATE_USERS, API_URL, API_ROLES, API_SUBUNIDADES } from "@/config/apiconfig";
import DynamicTable from "@/components/DynamicTable";
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { User } from "@/tipos/typos"
import { usePathname } from "next/navigation";
import Swal from 'sweetalert2';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BreadcrumbItemType } from '@/tipos/typos';
import SkeletonTable from "@/components/skeletonTable";
import { Rol, Subunidad } from "@/tipos/typos";
import { CaretSortIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
//tipos de datos
type ComboboxData = Rol | Subunidad;

interface ComboboxDemoProps {
  tipo: "rol" | "subunidad";
  data: ComboboxData[];
  value: number | null;
  setValue: (value: number) => void;
}
//comboBox 
export function ComboboxDemo({ data, value, setValue, tipo }: ComboboxDemoProps) {
  const [open, setOpen] = useState(false);

  const getDisplayText = (item: ComboboxData | undefined): string => {
    if (!item) {
      return "Valor no encontrado"; // Valor por defecto
    }
    return tipo === "rol"
      ? (item as Rol).n_rol
      : (item as Subunidad).n_subuni;
  };

  const getId = (item: ComboboxData): number => {
    return tipo === "rol"
      ? (item as Rol).id_rol
      : (item as Subunidad).id_subuni;
  };

  return (
    <>
      {data && data.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between bg-slate-100 text-gray-800"
            >
              {value !== null
                ? getDisplayText(data.find((item) => getId(item) === value))
                : `Seleccionar ${tipo === "rol" ? "un rol" : "una subunidad"}`}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={getId(item)}
                      value={getId(item).toString()}
                      onSelect={() => {
                        setValue(getId(item));
                        setOpen(false);
                      }}
                    >
                      {getDisplayText(item)}
                      <CheckIcon
                        className={clsx(
                          "ml-auto h-4 w-4",
                          value === getId(item) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}



// Modal para agregar un nuevo Usuario
export const EditModal = ({ isOpen, closeModal, onSaveUser, editingUser }: any) => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [subUnidades, setSubUnidades] = useState<Subunidad[]>([]);
  const [dni, setDni] = useState("");
  const [name, setName] = useState("");
  const [aPaterno, setAPaterno] = useState("");
  const [aMaterno, setAMaterno] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRol, setIdRol] = useState<number | null>(null);
  const [idSubUni, setIdSubUni] = useState<number | null>(null);

  useEffect(() => {
    if (editingUser) {
      setDni(editingUser.dni);
      setName(editingUser.nombre);
      setAPaterno(editingUser.APaterno);
      setAMaterno(editingUser.AMaterno);
      setEmail(editingUser.email);
      setPassword(editingUser.password);
      setIdRol(editingUser.rol_id);
      setIdSubUni(editingUser.subunidad_id_subuni);
    } else {
      setDni("");
      setName("");
      setAPaterno("");
      setAMaterno("");
      setEmail("");
      setPassword("");
      setIdRol(null);
      setIdSubUni(null);
    }
  }, [editingUser]);
  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch(`${API_ROLES}`);
      const data = await response.json();
      setRoles(data);
    };

    const fetchSubUnits = async () => {
      const response = await fetch(`${API_SUBUNIDADES}`);
      const data = await response.json();
      setSubUnidades(data);
    };

    fetchRoles();
    fetchSubUnits();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: editingUser ? "Guardar los cambios del usuario" : "Agregar un nuevo usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const updatedUser = {
      dni: dni,  // dni del usuario
      nombre: name,  // nombre del usuario
      email: email,  // email del usuario
      password: password,
      rol_id: idRol,  // rol_id, lo debes pasar como está en el objeto de usuario
      id_sub: idSubUni,  // subunidad_id_subuni
      aPaterno: aPaterno,
      aMaterno: aMaterno
    };

    try {
      const response = await fetch(
        editingUser ? `${API_CREATE_USERS}/${dni}` : API_CREATE_USERS,
        {
          method: editingUser ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        const savedUser = await response.json();
        onSaveUser(savedUser);
        Swal.fire("¡Éxito!", "Usuario guardado correctamente", "success");
        closeModal();
      } else {
        throw new Error("Error al guardar el usuario");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al guardar el usuario", "error");
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-[50%] h-[80%] overflow-auto">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">
          {editingUser ? "Editar Usuario" : "Agregar Usuario"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              DNI
            </label>
            <input
              type="text"
              id="name"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="DNI"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="aPaterno" className="block text-sm font-medium text-gray-300 mb-1">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="aPaterno"
              value={aPaterno}
              onChange={(e) => setAPaterno(e.target.value)}
              placeholder="apellido paterno"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="aMaterno" className="block text-sm font-medium text-gray-300 mb-1">
              Apellido Materno
            </label>
            <input
              type="text"
              id="aMaterno"
              value={aMaterno}
              onChange={(e) => setAMaterno(e.target.value)}
              placeholder="apellido materno"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              id="abbreviation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
         { !editingUser ? (
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="text"
              id="name"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="contraseña"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          ): null
          }
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Id Rol
            </label>
            <ComboboxDemo data={roles} value={idRol} setValue={setIdRol} tipo={"rol"} />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Id Sub Unidad
            </label>
            <ComboboxDemo data={subUnidades} value={idSubUni} setValue={setIdSubUni} tipo={"subunidad"} />
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
  const [itemsPerPage] = useState(4);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState('');
  /// navegacion rutas
  const pathname = usePathname();
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
  // Función para filtrar los datos basados en el término de búsqueda
  const getFilteredData = () => {
    if (!searchTerm) return sortedUsers;

    return sortedUsers.filter((user) =>
      Object.values(user).some((value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  const filteredUsers = getFilteredData();

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Ensure currentPage is within the valid range after filtering

  // Configuración de la tabla
  const configurationUser = [
    {
      key: "index",
      label: "ID",
      render: (item: User) => <>{Users.indexOf(item) + 1}</>,

    },
    {
      key: "n_usu",
      label: "Nombre",
      render: (item: User) => item.n_usu,
      sortable: true,
    },
    {
      key: "rol?.n_rol",
      label: "Rol",
      render: (item: User) => item.rol?.n_rol,
      sortable: true,
    },
    {
      key: "sub_uni?.n_subuni",
      label: "Sub Unidad",
      render: (item: User) => item.sub_uni?.n_subuni,
      sortable: true,
    },
    {
      key: "estado",
      label: "Estado",
      render: (item: User) => (item.estado ? <Button className="bg-green-500" onClick={() => toggleStateUser(item.dni, item.rol_id, item.subunidad_id_subuni)} >Activo</Button> : <Button className="bg-red-400" onClick={() => toggleStateUser(item.dni, item.rol_id, item.subunidad_id_subuni)}  >Desactivo</Button>),
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: User) => (
        <>
          <Button variant="ghost" size="icon" onClick={() => openEditModal(item)} >
            <Edit className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteUser(item.dni)}
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
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(maxVisiblePages / 2));

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
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-black dark:text-white h-10 w-24  "
      >
        Siguiente
      </Button>
    );

    return pageButtons;
  };
  let isFetching = false; // Variable global para rastrear si hay una solicitud en curso

  // Funcion asíncrona para obtener los datos
  const fetchUser = async () => {
    if (isFetching) return; // Si ya está en curso, no ejecutar otra solicitud
    isFetching = true;
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
      isFetching = false;
      setLoading(false);
    }
  };
  // useEffect para obtener los permisos desde la API al montar el componente
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredUsers, totalPages]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const openEditModal = (User: any) => {
    setEditingUser(User);
    setIsModalOpen(true);
  };
  const saveUser = (savedUser: any) => {
    setUsers((prevUsers) => {
      // Si estás editando un usuario, actualiza el usuario correspondiente
      if (editingUser) {
        return prevUsers.map((user: any) =>
          user.dni === savedUser.dni &&
            user.rol_id === savedUser.rol_id &&
            user.subunidad_id_subuni === savedUser.subunidad_id_subuni
            ? savedUser
            : user
        );
      } else {
        return [...prevUsers, savedUser];
      }
    });
    setEditingUser(null);
    fetchUser();  // Recarga los usuarios actualizados
  };


  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`${API_USERS}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualiza la lista de usuarios eliminando el usuario
        setUsers((prevUsers) => prevUsers.filter((user: any) => user.dni !== id));
        console.log('Usuario eliminado correctamente');
      } else {
        console.error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };
  const toggleStateUser = async (dni: string, rol_id: number, subunidad_id_subuni: number) => {
    try {
      // Encuentra el usuario por su DNI
      const user = Users.find((user) => user.dni === dni && user.rol_id === rol_id && user.subunidad_id_subuni === subunidad_id_subuni);
      if (!user) throw new Error("Usuario no encontrado");

      // Invertir el estado actual del usuario
      const updatedUser = { ...user, estado: !user.estado };

      // Realiza la petición PUT para actualizar el estado del usuario
      const response = await fetch(`${API_USERS}/toggle`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: updatedUser.dni,
          rol_id: rol_id, // Asume que rol_id y subunidad_id_subuni son parte de los datos del usuario
          subunidad_id_subuni: subunidad_id_subuni,
          estado: updatedUser.estado, // El estado que se invertirá
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Actualiza el estado local de los usuarios en el frontend
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.dni === dni && u.rol_id === rol_id && u.subunidad_id_subuni === subunidad_id_subuni
              ? { ...u, estado: updatedUser.estado } // Cambia el estado del usuario
              : u
          )
        );
        console.log("Estado actualizado:", updatedData);
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar el estado del usuario:", errorData.message);
      }
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
    }
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
  const breadcrumbData: BreadcrumbItemType[] = [
    { type: "link", label: "Inicio", href: inicio },
    {
      type: "page", label: "Configuración",
    },
    { type: "page", label: "Usuarios" },
  ];
  ////////////
  if (loading) {
    return (
      <SkeletonTable />
    )
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className=" w-[90%] mx-auto  py-4  space-y-4 text-gray-800  dark:text-white min-h-screen">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      <div >
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-32 " onClick={() => {
          setEditingUser(null);
          toggleModal();
        }} >
          <CirclePlus className="h-8 w-8 " />
          <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
          <p className="font-bold" >Nuevo</p>
        </Button>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            type="text"
            className="pl-8 w-[250px] bg-background text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
        </div>
      </div>

      <div className="bg-[#E3E6ED] rounded-lg ">
        <DynamicTable
          configuration={configurationUser}
          data={currentItems}
          onSort={handleSort}
        />
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {renderPaginationButtons()}
      </div>
      <EditModal
        isOpen={isModalOpen}
        closeModal={toggleModal}
        onSaveUser={saveUser}
        editingUser={editingUser}
      />
    </div>
  )
}