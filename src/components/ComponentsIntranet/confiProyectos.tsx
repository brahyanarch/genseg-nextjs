import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, MoreVertical, CirclePlus } from "lucide-react"

interface Project {
    id: number;
    nombre: string;
    escuelaProfesional: string;
    fecha: string;
    estado: 'PENDIENTE' | 'ARCHIVADO' | 'COMPLETADO' | 'EN CURSO';
  }
  
  const proyectos: Project[] = [
    { id: 1, nombre: "Proyecto campos verdes", escuelaProfesional: "EPIS", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
    { id: 2, nombre: "Limpieza en el bosque", escuelaProfesional: "EPIME", fecha: "11/02/24 - 26/11/24", estado: "ARCHIVADO" },
    { id: 3, nombre: "Nombre del proyecto", escuelaProfesional: "EPEE", fecha: "11/02/24 - 26/11/24", estado: "COMPLETADO" },
    { id: 1, nombre: "Nombre del proyecto", escuelaProfesional: "EPE", fecha: "11/02/24 - 26/11/24", estado: "EN CURSO" },
    { id: 2, nombre: "Nombre del proyecto", escuelaProfesional: "EPN", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
    { id: 3, nombre: "Nombre del proyecto", escuelaProfesional: "EPMH", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
  ]
export default function Component() {
  const getStatusClass = (status: Project["estado"]) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-orange-100 text-orange-800 border-2 border-orange-300 dark:bg-orange-900 dark:text-orange-200 "
      case "ARCHIVADO":
        return "bg-red-100 text-red-800 border-2 border-red-300 dark:bg-red-900 dark:text-red-200"
      case "COMPLETADO":
        return "bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900 dark:text-green-200"
      case "EN CURSO":
        return "bg-blue-100 text-blue-800 border-2 border-blue-300 dark:bg-blue-900 dark:text-blue-200"
    }
  }
  return (
    <div className=" w-[90%] m-4 p-4 space-y-4 text-white min-h-screen">
      <div >
        <h1 className="text-2xl font-bold text-black dark:text-white">Proyectos</h1>
      </div>
      <Button variant="secondary" size="sm" >
      <CirclePlus className="h-4 w-4" />
          nuevo
      </Button>
      <div className="bg-[#E3E6ED] rounded-lg ">
      <Table className="w-[90%] mx-auto my-6">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 border-l border-gray-900">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Escuela Profesional</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-gray-900">
          {proyectos.map((proyect) => (
            <TableRow key={proyect.id}>
              <TableCell className="px-4 border-l border-gray-900">{proyect.id}</TableCell>
              <TableCell>{proyect.nombre}</TableCell>
              <TableCell>{proyect.escuelaProfesional}</TableCell>
              <TableCell>{proyect.fecha}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(proyect.estado)}`}>
                    {proyect.estado}
                </span>
              </TableCell>
              <TableCell className="border-r border-gray-900">
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
      </div>
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