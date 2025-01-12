//importando recursos

"use client"
import { useState } from 'react';
//import * as React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckIcon, XIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { API_URL } from '@/config/apiconfig';


interface comboValores {
  id_subuni: number,
  n_subuni: string,
  abreviatura: string,
  createAt: string,
  updateAt: string,
}
interface vectorComboValores {
  value: number,
  setValue: ()=>void,
  data: comboValores[];
}

function ComboboxDemo({ data, value, setValue }: vectorComboValores) {
  const [open, setOpen] = useState(false);
 
  console.log(value)
  return (
    <>
      {data && data.length > 0 ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
            >
              {value !== null
                ? (data.find((item) => item.id_subuni === value)?.n_subuni?.length ?? 0) > 32 ? (data.find((item) => item.id_subuni === value)?.n_subuni?.slice(0,32) +"...") : (data.find((item) => item.id_subuni === value)?.n_subuni)
                : "Seleccionar una subunidad"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No se encontró ninguna subunidad.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item.id_subuni}
                      value={item.id_subuni.toString()}
                      onSelect={() => {
                        setValue(item.id_subuni);
                        setOpen(false);
                      }}
                    >
                      {item.n_subuni}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === item.id_subuni ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : null}
    </>
  );
}


///informacion del certificado
const activities = [
  { id: 1, name: "Limpieza en el bosque", completed: true },
  { id: 2, name: "Capacitación para primeros auxilios", completed: false },
  { id: 3, name: "Mantenimiento de las áreas verdes", completed: true },
  { id: 4, name: "Control de bolas dentro del campus universitario", completed: true },
]
///componente Modal Obtener certificado
export const ObtenerCertificadoModal = ({ isOpen, setIsOpen, infoParticipante, certificado }: any) => {
  return (
    
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[530px] max-w-[350px] bg-white  text-black">
        <DialogHeader>
          <DialogTitle>Estado del Certificado</DialogTitle>
        </DialogHeader>
        { infoParticipante.length > 0 && (
           <div className="grid gap-4 py-4">
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="nombres" className="text-right">
             {infoParticipante[0].alumno.nombre}
             </Label>
             <Input id="nombres" defaultValue="David Brahyan" className="col-span-3" />
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="apellidos" className="text-right">
             {infoParticipante[0].alumno.aPaterno} {infoParticipante[0].alumno.aMaterno}
             </Label>
             <Input id="apellidos" defaultValue="Larota pilco" className="col-span-3" />
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="codigo" className="text-right">
             {infoParticipante[0].alumno.codigo}
             </Label>
             <Input id="codigo" defaultValue="201861" className="col-span-3" />
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="escuela" className="text-right">
             {infoParticipante[0].alumno.prgest.nmPE}
             </Label>
             <Input id="escuela" defaultValue="Ing. Sistemas" value={infoParticipante[0].alumno.prgest.nmPE} className="col-span-3" />
           </div>
         </div>
        )}
        
        <div className="mt-4 ">
          <h3 className="mb-2 font-semibold">Actividades</h3>
          <ul className="space-y-2 h-[150px] p-2 border-black border-[2px] border-opacity-30 rounded-[5px] overflow-auto">
            {infoParticipante.map((activity) => (
              <li
                key={activity.id}
                className={`flex items-center justify-between p-2 rounded ${activity.asistio ? 'bg-green-100' : 'bg-red-100'
                  }`}
              >
                <span>{activity.actividad.name}</span>
                {activity.asistio ? (
                  <CheckIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <XIcon className="h-5 w-5 text-red-600" />
                )}
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-md py-2" onClick={() => setIsOpen(false)}
          {...(certificado ? { disabled: true } : {})}>
          Solicitar
        </Button>
        
      </DialogContent>
    </Dialog>
  )
}

//const PrivilegiosPage = () => {
const ObtenerCertificado = ({ data }: vectorComboValores) => {
  //estado para manejar el el valor de activo e inactivo del modal obtener certificado.
  const [isOpen, setIsOpen] = useState(false)
  const [dni, setDni] = useState('');
  const [value, setValue] = useState<number | null>(null);
  const [infoParticipante, setInfoParticipante] = useState([]);
  const [certificado, setCertificado] = useState(false);
  //funcion para cambiar el esatao(valor) del modal obtener certificado
  const changeModalObCertificado = () => {
    setIsOpen(!isOpen);
    console.log(value);
  }
  //funcion para Consultar el certificado
  const handleCertificate = async () => {
      try{
        const response = await fetch(`${API_URL}/api/completados/actividades/${dni}/${value}`)

        if(response.ok){
         const data = await response.json();
         setInfoParticipante(data.actividadesAsistidas);
         setCertificado(data.certificado);
         console.log("datos obtenidos exitosamente");
         changeModalObCertificado();

        }else{
          console.log("error al obtener los datos del participante");

        }

      }catch(error){

      }
  }
  return (
    <>
      <div className="bg-gray-300 gap-4 text-gray-800 flex flex-col justify-center items-center mx-auto my-[50px] p-8 rounded-lg shadow-lg w-4/5">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Buscar Certificado</h2>
        <p className="text-sm bg-blue-100 text-blue-600 p-2 rounded-md w-[90%] text-center mb-4">
          ¡Atención! Los certificados se solicitan una vez que el voluntario participante culminó con las 3 actividades designadas.
          <br /> seleccione la subunidad y  luego ingrese su número de DNI
        </p>
        <div className="flex justify-between items-center w-[90%]  mb-4">
          <h3 className="text-lg"></h3>
          {/*<ComboboxDemo {data} />*/}
          <ComboboxDemo data={data} value={value} setValue={setValue} />
          <div className="flex space-x-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="DNI"
              value={dni}
              maxLength={8}
              onChange={(e)=>setDni(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
              onClick={handleCertificate}
            >
              Consultar
            </button>
          </div>
        </div>

        <p className="text-sm bg-yellow-100 text-yellow-600 p-2 rounded-md w-[90%] text-center">
          Los certificados se entregarán de manera digital a su correo institucional, si requiere en físico apersonarse a la oficina de la DPSEC.
        </p>
      </div>
      { infoParticipante.length > 0 && (
        <ObtenerCertificadoModal isOpen={isOpen} setIsOpen={setIsOpen} infoParticipante={infoParticipante} certificado={certificado} />
      )
      }
      
    </>
  );
}

export default ObtenerCertificado;