import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from 'lucide-react'

interface Permission {
  id: number
  nombre: string
  checked?: boolean
}

export default function PermissionsManager({ onClose }: { onClose: () => void }) {
    
  const permissions: Permission[] = [
    { id: 1, nombre: "Insertar Proyecto" },
    { id: 2, nombre: "Editar Proyecto" },
    { id: 3, nombre: "Eliminar proyecto" },
    { id: 4, nombre: "habilitaci...modificacion" },
    { id: 5, nombre: "acpetar ... eliminacion" },
    { id: 6, nombre: "Crear formu...proyectos" },
    { id: 7, nombre: "Principal" },
    { id: 8, nombre: "Generar reportes" },
    { id: 9, nombre: "generar pla...certificado" },
    { id: 10, nombre: "Dar certificado" },
    { id: 11, nombre: "Registrar voluntariados" },
    { id: 12, nombre: "Modificar...voluntariado" },
    { id: 13, nombre: "Eliminar voluntariado" },
    { id: 14, nombre: "Listar proyectos" },
  ]

  return (
    <div className="w-full max-w-md mx-auto bg-background rounded-lg shadow-lg bg-white">
      <div className="p-4 border-b flex justify-between items-center ">
        <h2 className="text-xl font-semibold">Permisos</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="border rounded-md">
          <div className="grid grid-cols-[80px_1fr_40px] bg-muted px-4 py-2 border-b">
            <div className="font-medium">ID</div>
            <div className="font-medium">Nombre</div>
            <div></div>
          </div>
          <div className="divide-y">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="grid grid-cols-[80px_1fr_40px] px-4 py-2 items-center"
              >
                <div>{permission.id}</div>
                <div>{permission.nombre}</div>
                <div className="flex justify-center">
                  <Checkbox />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="bg-[#4285f4] hover:bg-[#3367d6] text-white">
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}

