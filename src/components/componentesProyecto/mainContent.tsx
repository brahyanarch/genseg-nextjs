import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X} from 'lucide-react'
import {GeneralData, TaskList} from '@/components/componentesProyecto/porjectInfo'
import Image from 'next/image'
///

export default function ProjectDetails({isOpenModalProject}:any) {
  return (
    <>
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <Card className=" w-[60%] h-[80%] mx-auto shadow-lg absolute overflow-y-auto top-20 z-50  ">
      <CardContent className="">
        <Image src={"/resources/images/6.jpg"} alt="imagen header" width={300} height={200} ></Image>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Limpieza del bosque (LP451)
          <button className="bg-red-600 py-2 px-5 rounded-md"  onClick={isOpenModalProject} >Cerrar</button>
        </CardTitle>
        <Progress value={64} className="h-2 mt-2" />
        <span className="text-sm text-muted-foreground mt-1">64%</span>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="text-sm">
              <div className="font-medium">Fecha Inicio</div>
              <div className="text-muted-foreground py-2 px-4 rounded-lg border-2 border-gray-500 border-opacity-30 "><input type="date" ></input> </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm">
              <div className="font-medium">Fecha final</div>
              <div className="text-muted-foreground py-2 px-4 rounded-lg border-2 border-gray-500 border-opacity-30"><input type="date" ></input></div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Asignados</h3>
          <div className="flex items-center gap-2">
           
            <span className="text-sm">L</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Estados</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-yellow-200">PENDIENTE</Badge>
            <Badge variant="outline" className="bg-green-200">COMPLETADO</Badge>
            <Badge variant="outline" className="bg-gray-200">ARCHIVADO</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Descripción</h3>
          <p className="text-sm text-muted-foreground">
            El proyecto de limpieza en el bosque tiene como objetivo limpiar todo el bosque para el cumplimiento de uno de los requisitos para el licenciamiento de la universidad teniendo como objetivo principal la acreditación.
          </p>
          <button className="text-sm text-primary mt-2">leer más...</button>
        </div>
      </CardContent>
      <GeneralData projectNumber={"451"}
        studentName={"Luis Mamani Coari"}
        policyTitle={"Eje de Política 5: Educación formativa ambiental"}
        location={"Local"}
        groupNumber={"45"}
        responsible={"Luis Mamani Coari"}
        projectId={"SGLGA-01"}
        checklistDescription={"Concientizar a la población universitaria sobre los activismos del periodo que son nuestro bosque."} />
        <TaskList/>
    </Card>
    </>
    
  )
}

