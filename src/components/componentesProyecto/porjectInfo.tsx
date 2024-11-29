import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search, ChevronDown,X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"


interface GeneralDataProps {
  projectNumber: string;
  studentName: string;
  studentImage?: string;
  policyTitle: string;
  location: string;
  groupNumber: string;
  responsible: string;
  projectId: string;
  checklistDescription: string;
}

export const GeneralData = ({
  projectNumber,
  studentName,
  studentImage,
  policyTitle,
  location,
  groupNumber,
  responsible,
  projectId,
  checklistDescription
}: GeneralDataProps) => {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-lg font-medium">Datos Generales</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">N° {projectNumber}</span>
          <Avatar className="h-6 w-6">
            <AvatarImage src={studentImage} alt={studentName} />
            <AvatarFallback>{studentName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm">{policyTitle}</p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Alumno:</span>
              <span className="col-span-2">{studentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Local:</span>
              <span className="col-span-2">{location}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Grupo:</span>
              <span className="col-span-2">{groupNumber}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Responsabilidades:</span>
              <span className="col-span-2">{responsible}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Proyecto:</span>
              <span className="col-span-2">{projectId}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Checklist</h3>
          <p className="text-sm text-muted-foreground">{checklistDescription}</p>
        </div>
      </CardContent>
    </>
    
  )
}
//
interface Task {
  id: number
  number: number
  title: string
  status: "COMPLETADO" | "EN CURSO" | "PENDIENTE"
  date: string
  time: string
  checked?: boolean
  hasSubtasks?: boolean
}

const tasks: Task[] = [
  {
    id: 1,
    number: 2,
    title: "Convacatorio",
    status: "COMPLETADO",
    date: "12 Nov, 2024",
    time: "12:00 PM",
    checked: true,
  },
  {
    id: 2,
    number: 2,
    title: "Llenado de datos",
    status: "COMPLETADO",
    date: "12 Nov, 2024",
    time: "12:00 PM",
    checked: true,
    hasSubtasks: true,
  },
  {
    id: 3,
    number: 4,
    title: "Actividad 3",
    status: "EN CURSO",
    date: "12 Dec, 2024",
    time: "05:00 AM",
  },
  {
    id: 4,
    number: 3,
    title: "Actividad 4",
    status: "PENDIENTE",
    date: "12 Nov, 2024",
    time: "12:00 PM",
  },
  {
    id: 5,
    number: 3,
    title: "Actividad 5",
    status: "PENDIENTE",
    date: "1 Nov, 2024",
    time: "12:00 PM",
  },
  {
    id: 6,
    number: 3,
    title: "Actividad 6",
    status: "PENDIENTE",
    date: "13 Nov, 2024",
    time: "10:00 PM",
  },
]

export function TaskList() {
  return (
    <Card className="w-full max-w-2xl p-6 bg-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lista de Tareas (6)</h2>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar tareas" className="pl-9" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
              <span>6 Tareas</span>
            </div>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
              Ordenar
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 py-2"
            >
              <Checkbox checked={task.checked} className="mt-1" />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">#{task.number}</span>
                    <span className="font-medium">{task.title}</span>
                    {task.hasSubtasks && (
                      <span className="text-muted-foreground text-sm">≡ 3</span>
                    )}
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      task.status === "COMPLETADO"
                        ? "bg-green-100 text-green-800"
                        : task.status === "EN CURSO"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {task.status}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>{task.date},</span>
                  <span>{task.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0">
          + Agregar nuevo plan
        </Button>
      </div>
    </Card>
  )
}