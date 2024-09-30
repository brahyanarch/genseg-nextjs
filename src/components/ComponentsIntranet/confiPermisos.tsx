import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"

const permissions = [
  { id: 1, nombre: "Insertar Proyecto" },
  { id: 2, nombre: "Editar Proyecto" },
  { id: 3, nombre: "Eliminar Proyecto" },
  { id: 1, nombre: "habilitación de solicitud para modificación" },
  { id: 2, nombre: "aceptar solicitud para eliminación" },
  { id: 3, nombre: "Crear formulario para la inserción de proyectos" },
]

export default function Component() {
  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permisos</h1>
        <Button variant="secondary" size="sm">
          nuevo
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-24">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={`${permission.id}-${permission.nombre}`}>
              <TableCell>{permission.id}</TableCell>
              <TableCell>{permission.nombre}</TableCell>
              <TableCell>
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
      <div className="flex justify-center items-center space-x-2">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>
    </div>
  )
}