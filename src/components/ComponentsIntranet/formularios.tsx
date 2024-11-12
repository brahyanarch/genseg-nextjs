import { Search, PenSquare, Trash2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface FormEntry {
  id: number
  nombre: string
  fechaCreacion: string
  abreviatura: string
  active: boolean
}

export default function Component() {
  const forms: FormEntry[] = [
    {
      id: 1,
      nombre: "Formulario proyecto 2024",
      fechaCreacion: "12-02-2024",
      abreviatura: "F120224",
      active: true,
    },
    {
      id: 2,
      nombre: "Formulario proyecto 2",
      fechaCreacion: "13-02-2024",
      abreviatura: "F130224",
      active: false,
    },
    {
      id: 3,
      nombre: "Formulario proyecto 3",
      fechaCreacion: "14-02-2024",
      abreviatura: "F140224",
      active: false,
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Edicion de formulario</h1>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <Button className="bg-blue-500 hover:bg-blue-600">
          + nuevo
        </Button>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 w-[300px]"
          />
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha de creacion</TableHead>
              <TableHead>Abreviatura</TableHead>
              <TableHead className="text-right">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.id}</TableCell>
                <TableCell>{form.nombre}</TableCell>
                <TableCell>{form.fechaCreacion}</TableCell>
                <TableCell>{form.abreviatura}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Circle className={`h-4 w-4 ${form.active ? "fill-primary" : ""}`} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled>
          Anterior
        </Button>
        <Button variant="outline" className="px-4">
          1
        </Button>
        <Button variant="outline">
          Siguiente
        </Button>
      </div>
    </div>
  )
}