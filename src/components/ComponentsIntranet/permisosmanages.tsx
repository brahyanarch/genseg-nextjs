import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { API_DETALLE_PERMISOS } from "@/config/apiconfig";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
interface PermissionDetail {
  id_per: number;
  n_per: string;
  abreviatura: string;
}

interface Permission {
  id_dper: number;
  estado: boolean;
  permisos: PermissionDetail; // Objeto anidado
}

interface PermissionsManagerProps {
  onClose: () => void;
  id_rol: number;
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  onClose,
  id_rol,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch permissions from API
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_DETALLE_PERMISOS}/${id_rol}`);
      if (!response.ok) {
        throw new Error("Error al obtener los permisos.");
      }

      const data: Permission[] = await response.json();
      setPermissions(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [id_rol]);

  // Handle checkbox state change
  const handleCheckboxChange = (id_dper: number) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.id_dper === id_dper
          ? { ...permission, estado: !permission.estado }
          : permission
      )
    );
  };

  // Depurar cambios en el estado de permisos
  useEffect(() => {
    console.log("Estado actualizado de permisos:", permissions);
  }, [permissions]);

  // Save changes to the backend
  const handleSave = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro de actualizar permisos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      customClass: {
        cancelButton: 'bg-red-500 text-white hover:bg-red-600',
        confirmButton: 'bg-blue-500 text-white hover:bg-blue-600',
      },
    });

    if (result.isConfirmed) {
      try {
        const responses = await Promise.all(
          permissions.map((permiso) =>
            fetch(`${API_DETALLE_PERMISOS}/toggle/${permiso.id_dper}/`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ estado: permiso.estado }),
            })
          )
        );

        const allSuccess = responses.every((res) => res.ok);
        if (allSuccess) {
          // Mostrar un SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: 'Permisos actualizados correctamente.',
            confirmButtonText: 'OK',
            customClass: {

              confirmButton: 'bg-blue-500 text-white hover:bg-blue-600',
            },
          });
          onClose();
        } else {
          // Si hay un error al guardar el rol
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar permisos.',
            confirmButtonText: 'OK',
            customClass: {

              confirmButton: 'bg-blue-500 text-white hover:bg-blue-600',
            },
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al conectar con la API',
          text: 'erro: ' + error,
          confirmButtonText: 'OK',
        });
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Permisos</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        {loading && <p className="text-center">Cargando permisos...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="border rounded-md">
            <div className="grid grid-cols-[80px_1fr_40px] bg-muted px-4 py-2 border-b">
              <div className="font-medium">ID</div>
              <div className="font-medium">Nombre</div>
              <div></div>
            </div>

            <div className="divide-y">
              {permissions.map(({ id_dper, permisos, estado }) => (
                <div
                  key={id_dper}
                  className="grid grid-cols-[80px_1fr_40px] px-4 py-2 items-center"
                >
                  <div>{id_dper}</div>
                  <div>{permisos.n_per}</div>
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={estado} // Refleja el estado correctamente
                      onChange={() => handleCheckboxChange(id_dper)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            className="bg-[#4285f4] hover:bg-[#3367d6] text-white"
            onClick={handleSave}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManager;
