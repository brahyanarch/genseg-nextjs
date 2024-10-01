import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, CirclePlus } from "lucide-react"

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
    <div className=" w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <div >
        <h1 className="text-2xl font-bold">Permisos</h1>
      </div>
      <Button variant="secondary" size="sm" >
      <CirclePlus className="h-4 w-4" />
          nuevo
      </Button>
      <div className="bg-[#E3E6ED] rounded-lg">
      <Table className="w-[90%] mx-auto my-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 border-l border-gray-900">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-900">
          {permissions.map((permission) => (
            <TableRow key={`${permission.id}-${permission.nombre}`}>
              <TableCell className=" px-4 border-l border-gray-900">{permission.id}</TableCell>
              <TableCell>{permission.nombre}</TableCell>
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