import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { API_DETALLE_PERMISOS } from "@/config/apiconfig";
import React, { useState, useEffect, useCallback } from "react";

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

const PermissionsManager: React.FC<PermissionsManagerProps> =({ onClose, id_rol }: PermissionsManagerProps)=> {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch permissions from API
  const fetchPermissions = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

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

  const handleSave = async () => {
    try {
      await Promise.all(
        permissions.map((permiso) =>
          fetch(`${API_DETALLE_PERMISOS}/${permiso.id_dper}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado: permiso.estado }),
          })
        )
      );
      alert("Permisos actualizados con éxito.");
    } catch (error) {
      alert("Error al guardar los permisos.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Permisos</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
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
  <div key={id_dper} className="grid grid-cols-[80px_1fr_40px] px-4 py-2 items-center">
    <div>{id_dper}</div>
    <div>{permisos.n_per}</div> {/* Aquí se muestra el nombre del permiso */}
    <div className="flex justify-center">
      <Checkbox checked={estado} onChange={() => handleCheckboxChange(id_dper)} />
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
