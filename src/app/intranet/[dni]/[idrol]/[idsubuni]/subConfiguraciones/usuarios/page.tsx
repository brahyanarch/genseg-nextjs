'use client'
import { Button } from "@/components/ui/button"
import { Edit, X, Trash2, CirclePlus } from "lucide-react"
import { useState, useEffect } from "react"
import { API_USERS, API_CREATE_USERS } from "@/config/apiconfig";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicTable from "@/components/DynamicTable";
import { BreadcrumbWithDropdown } from "@/components/breadcrumb";
import { User } from "@/tipos/typos"
import { usePathname, useParams } from "next/navigation";
import Swal from 'sweetalert2';
// Modal para agregar un nuevo Usuario
export const EditModal = ({ isOpen, closeModal, onSaveUser, editingUser }: any) => {
  const [dni, setDni] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idRol, setIdRol] = useState('');
  const {idsubuni} = useParams();
  useEffect(() => {
    if (editingUser) {
      setDni(editingUser.dni);
      setName(editingUser.usuario);
      setEmail(editingUser.email);
      setPassword(editingUser.password)
      setIdRol(editingUser.rol_id);
    }
  }, [editingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Abre el SweetAlert para confirmar la acción
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Este cambio no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      
    });
  
    if (result.isConfirmed) {
      // Aquí construimos el objeto con los datos a guardar
      const updatedUser = {
        dni: dni,  // dni del usuario
        usuario: name,  // nombre del usuario
        email: email,  // email del usuario
        password: password,
        rol_id: idRol,  // rol_id, lo debes pasar como está en el objeto de usuario
        id_sub: idsubuni,  // subunidad_id_subuni
      };
  
      try {
        const response = await fetch(editingUser ? `${API_CREATE_USERS}/${editingUser.dni}` : API_CREATE_USERS, {
          method: editingUser ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });
  
        if (response.ok) {
          const savedUser = await response.json();
          onSaveUser(savedUser);
          Swal.fire('Guardado!', 'El usuario se ha guardado correctamente.', 'success');
          closeModal();
        } else {
          Swal.fire('Error', 'Hubo un problema al guardar el usuario.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error al conectar con la API: ' + error, 'error');
      }
    } else {
      // Si el usuario cancela la operación
      Swal.fire('Cancelado', 'El usuario no fue guardado.', 'info');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-[50%] h-[80%]">
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
              placeholder="Permiso"
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
              placeholder="Permiso"
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
              placeholder="Ins o Vacío"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="text"
              id="name"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Permiso"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Id Rol
            </label>
            <input
              type="text"
              id="name"
              value={idRol}
              onChange={(e) => setIdRol(e.target.value)}
              placeholder="Permiso"
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
  const [itemsPerPage] = useState(4);
  const totalPages = Math.ceil(Users.length / itemsPerPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  /// navegacion rutas
  const {dni, idrol,idsubuni} = useParams();
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
      sortable: true,
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
    const interval = setInterval(fetchUser, 5000); // Cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

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
  ///recortar rutas
  const recortarRutaHastaSegmento = (ruta: string, segmento: string): string => {
    const partes = ruta.split('/'); // Divide la ruta en partes
    const indice = partes.indexOf(segmento); // Encuentra el índice del segmento clave
    if (indice === -1) return ruta; // Si no encuentra el segmento, retorna la ruta completa
    return partes.slice(0, indice + 1).join('/'); // Toma hasta el segmento + un nivel
  };
  //recortamos las rutas requeridas
  const configuracion = recortarRutaHastaSegmento(pathname, 'subConfiguraciones');
  const inicio = recortarRutaHastaSegmento(pathname, 'intranet');
  //definimos valores para el breadCrumb
  const breadcrumbData = [
    { type: "link", label: "Inicio", href:`${inicio}/${dni}/${idrol}/${idsubuni}` },
    {
      type: "dropdown",
      label: "Sub configuraciones",
      items: [
        { label: "Formularios", href: `${configuracion}/Formularios` },
      ],
    },
    { type: "page", label: "Usuarios" },
  ];
  ////////////
  return (
    <div className=" w-[90%] mx-auto  py-4  space-y-4 text-gray-800  dark:text-white min-h-screen">
      <BreadcrumbWithDropdown items={breadcrumbData} />
      <div >
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>

      <Button variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-lg h-12 w-32 " onClick={() => {
        setEditingUser(null);
        toggleModal();
      }} >
        <CirclePlus className="h-8 w-8 " />
        <span className="mx-2"></span> {/* Añadir margen entre los elementos */}
        <p className="font-bold" >Nuevo</p>
      </Button>
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