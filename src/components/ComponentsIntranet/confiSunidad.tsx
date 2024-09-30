import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"

const subUnidades = [
  { id: 1, nombre: "Proyeccion social y extension Universitaria", abreviatura: "PSEU" },
  { id: 2, nombre: "Seguimiento y Desarrollo del Graduado", abreviatura: "SDG" },
  { id: 3, nombre: "Gestion Ambiental", abreviatura: "GA" },
]

export default function Component() {
  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sub Unidad</h1>
        <Button variant="secondary" size="sm">
          nuevo
        </Button>
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
          {subUnidades.map((subUnidad) => (
            <TableRow key={subUnidad.id}>
              <TableCell>{subUnidad.id}</TableCell>
              <TableCell>{subUnidad.nombre}</TableCell>
              <TableCell>{subUnidad.abreviatura}</TableCell>
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
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>
    </div>
  )
}