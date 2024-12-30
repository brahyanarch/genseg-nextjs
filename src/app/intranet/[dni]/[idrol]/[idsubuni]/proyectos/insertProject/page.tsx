'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {AvisoContext} from "@/context/avisoContext"
import { useState, useContext } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import {API_PROJECTS } from "@/config/apiconfig"

export default function ProjectForm() {
  /// variables importantes
  //const [error, setError] = useState(null);
  const {mostrarAviso} = useContext<any>(AvisoContext);
  const [escuelaProfesional, setEscuelaProfesional] = useState<string>();
  const [planProyecto, setPlanProyecto] = useState<File | null>(null);
  const [dirFile, setDirFile] = useState<string>("");
  const {idrol,idsubuni, dni} = useParams();
  const router = useRouter();
  const pathname = usePathname();
  //// funciones importantes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPlanProyecto(event.target.files[0]);
    }
  };
  const handleNewProyect = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData();
      if (planProyecto) {
        formData.append("file", planProyecto);
      }
      formData.append("dni",String(dni));
      formData.append("id_rol", String(idrol));
      formData.append("subunidad", String(idsubuni));
      formData.append("EP", String(escuelaProfesional));
      
      try {
        const response = await fetch(API_PROJECTS, {
          method:'POST',
          body: formData
        });
  
        if (response.ok) {
          const resIdProject = await response.json();
          mostrarAviso('succefull', 'Proyecto guardado correctamente.');
          setDirFile(resIdProject.url);
          if(resIdProject.idproj!== undefined){
            router.push(`${pathname}/${resIdProject.idproj}`);
            console.log(resIdProject.url)
          }
          console.log("este es el archivo enviado")
          console.log(planProyecto)
          
         
        } else {
          mostrarAviso('warning', 'Error al guardar el proyecto.');
        }
      } catch (error) {
        mostrarAviso('warning', `Error al conectar con la API:${error}`);
      }
    };
  return (
    <div className="flex-1 bg-background py-4 pl-4  text-black dark:text-white">
      <div className=" flex gap-4 items-center mx-auto text-sm breadcrumbs mb-6 text-muted-foreground">
        <span>Inicio</span> {' > '} 
        <span>Proyectos</span> {' > '} 
        <span>Insertar</span>
      </div>
      <div className="w-full space-y-6">
        <div className="flex-1 w-[90%]  mx-auto flex flex-col justify-between ">
        <div className="  w-[100%] flex flex-1 justify-around items-center">
          <div className="flex w-[80%] h-[40%] flex-col justify-between items-start">
          <h1 className="text-2xl font-semibold mb-3">Insertar Proyecto</h1>
          <div className="w-full">
            <label className="text-lg font-medium mb-3 block">
              Escuela Profesional
            </label>
            <Input 
              type="text"
              id="name"
              value={escuelaProfesional}
              onChange={(e) => setEscuelaProfesional(e.target.value)}
              placeholder="Nombre del Proyecto"
              className="bg-background w-96 h-10 mb-3"
            />
          </div>

          <div>

            <label className="text-lg font-medium mb-3 block">
              Insertar el plan
            </label>
            <Input 
              type="file"
              onChange={handleFileChange}
              className="bg-background w-96  h-10"
            />
          </div>
          </div>
        
            <form onSubmit={handleNewProyect} className="flex w-full justify-end">
              <Button className="bg-blue-500 hover:bg-blue-600 self-end flex-1 w-32 h-14 " type="submit">
                Crear Proyecto
              </Button>
            </form>
        </div>
        </div>
      </div>
    </div>
  )
}

