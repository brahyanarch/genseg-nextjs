import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, MoreVertical } from "lucide-react"

const users = [
  { id: 1, nombre: "Jose Roberto Mamani Zaa", rol: "Sub administrador", abreviatura: "JRMZ", estado: "Activo" },
  { id: 2, nombre: "David Rodolfo Laruta", rol: "Coordinador", abreviatura: "DRL", estado: "Activo" },
  { id: 3, nombre: "Ever Laurencio Sorocco", rol: "Personal de planta", abreviatura: "ELS", estado: "Activo" },
]

export default function Component() {
  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button variant="secondary" size="sm">
          nuevo
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Abreviatura</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-24">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>{user.abreviatura}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                  {user.estado}
                </span>
              </TableCell>
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