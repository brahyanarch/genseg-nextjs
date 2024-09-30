import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, MoreVertical } from "lucide-react"

const roles = [
  { id: 1, nombre: "Sub administrador", abreviatura: "SubAdm" },
  { id: 2, nombre: "Coordinador", abreviatura: "Coord" },
  { id: 3, nombre: "Personal de planta", abreviatura: "PP" },
  { id: 4, nombre: "Profesor", abreviatura: "Vol" },
  { id: 5, nombre: "Voluntario", abreviatura: "Prof" },
]

export default function Component() {
  return (
    <div className="p-4 m-4 space-y-4 w-[90%] mt-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
        
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" size="sm">
          Nuevo
        </Button>
        <Input className="w-64" placeholder="Buscar..." />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Abreviatura</TableHead>
            <TableHead className="w-24">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.nombre}</TableCell>
              <TableCell>{role.abreviatura}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
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
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <span>1</span>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>
    </div>
  )
}