'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {AvisoContext} from "@/context/avisoContext"
import { useState, useContext } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import {API_PROJECTS } from "@/config/apiconfig"
export default function ProjectForm() {
  const activities = [
    { id: 1, nombre: "Actividad 1", escuela: "EPIS", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
    { id: 2, nombre: "Actividad 2", escuela: "EPIME", fecha: "11/02/24 - 26/11/24", estado: "ARCHIVADO" },
    { id: 3, nombre: "Actividad 3", escuela: "EPEE", fecha: "11/02/24 - 26/11/24", estado: "COMPLETADO" },
    { id: 1, nombre: "Actividad 4", escuela: "EPE", fecha: "11/02/24 - 26/11/24", estado: "EN CURSO" },
    { id: 2, nombre: "Actividad 5", escuela: "EPN", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
    { id: 3, nombre: "Actividad 6", escuela: "EPMH", fecha: "11/02/24 - 26/11/24", estado: "PENDIENTE" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-orange-500/10 text-orange-500'
      case 'archivado':
        return 'bg-red-500/10 text-red-500'
      case 'completado':
        return 'bg-green-500/10 text-green-500'
      case 'en curso':
        return 'bg-blue-500/10 text-blue-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }
  /// variables importantes
  const [idProject, setIdProject] = useState<number>();
  const [loading, setLoading] = useState(false);
  const {mostrarAviso} = useContext<any>(AvisoContext);
  const [escuelaProfesional, setEscuelaProfesional] = useState<string>();
  const [planProyecto, setPlanProyecto] = useState(null);
  const {idrol,idsubuni, dni} = useParams();
  const router = useRouter();
  const pathname = usePathname();
  //// funciones importantes
  const handleFileChange = (event) => {
    setPlanProyecto(event.target.value);
  };
  const insertActivity = ()=>{
    router.push(`${pathname}/${idProject}/insertActivity`);
  }
  const handleNewProyect = async (event: any) => {
      event.preventDefault();
      const newProject = {
        plan:String(planProyecto), 
        dni:dni, 
        id_rol:Number(idrol), 
        subunidad:Number(idsubuni), 
        EP:escuelaProfesional
      };
      
      try {
        const response = await fetch(API_PROJECTS, {
          method:'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProject)
        });
  
        if (response.ok) {
          const resIdProject = await response.json();
          mostrarAviso('succefull', 'Proyecto guardado correctamente.');
          setIdProject(resIdProject.idproj);
         
        } else {
          mostrarAviso('warning', 'Error al guardar el proyecto.');
        }
      } catch (error) {
        mostrarAviso('warning', `Error al conectar con la API:${error}`);
      }
    };
    if (loading) {
      return (
        <div className="p-6 space-y-6">
          <h2>Cargando...</h2>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="text-sm breadcrumbs mb-6 text-muted-foreground">
        <span>Inicio</span> {' > '} 
        <span>Proyectos</span> {' > '} 
        <span>Insertar</span>
      </div>
      <h2>{idProject}</h2>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold mb-8">Insertar Proyecto</h1>
        
        <div className="grid gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Escuela Profesional
              </label>
              <Input 
                type="text"
                id="name"
                value={escuelaProfesional}
                onChange={(e) => setEscuelaProfesional(e.target.value)}
                placeholder="Nombre del Proyecto"
                className="bg-background w-[50%]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Insertar el plan
              </label>
              <Input 
                type="file"
                onChange={handleFileChange}
                className="bg-background w-[50%]"
              />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleNewProyect} >
              Crear Proyecto
            </Button>
          </div>
          { idProject !== undefined && (
            <>
            <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar..."
                className="pl-8 w-[250px] bg-background"
              />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={insertActivity} >
              Nueva Actividad
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Escuela Profesional</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-24">Opciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={`${activity.id}-${activity.nombre}`}>
                    <TableCell>{activity.id}</TableCell>
                    <TableCell>{activity.nombre}</TableCell>
                    <TableCell>{activity.escuela}</TableCell>
                    <TableCell>{activity.fecha}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(activity.estado)}>
                        {activity.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="destructive" 
                className="bg-[#F08080] hover:bg-[#E07070]"
              >
                Cancelar
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Guardar Cambios
              </Button>
            </div>
          </div>
          </>
          )
          }
        </div>
      </div>
    </div>
  )
}

