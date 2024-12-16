'use client'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X} from 'lucide-react'
import { TaskList} from '@/components/componentesProyecto/porjectInfo'
import Image from 'next/image'
import {useState} from "react"
import {usePathname, useRouter } from "next/navigation"
///

export default function ProjectDetails() {
  const route = useRouter();
  const pathname = usePathname();
  /// Fucion para cambiar a interfaz de detalles de una actividad
  const toggleOpenDetailsActivities = (activityId:number)=>{
    route.push(`${pathname}/viewActivity/${activityId}`);
  } 
  return (
    <>
    <Card className=" w-full bg-white dark:bg-gray-900 mx-auto overflow-y-auto p-2 relative">
      <CardContent className="">
        <Image src={"/resources/images/imgActividad.jpg"} alt="imagen header" className="w-[100%] h-44" width={500} height={300} ></Image>
      </CardContent>
      <div className=" w-[90%] mx-auto" >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Limpieza del bosque (LP451)
          <button className="bg-red-600 absolute top-2 right-2 py-2 px-3 rounded-md" ><X className="w-5 h-5" /></button>
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
          <div className="w-10 h-10 flex items-center justify-center bg-gray-400 rounded-full">
            <span className=" text-black font-bold text-lg ">L</span>
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
        <TaskList toggleOpenDetsAct={(id:number)=>toggleOpenDetailsActivities(id)} />
      </CardContent>
      </div>
    </Card>
    </>
    
  )
}

