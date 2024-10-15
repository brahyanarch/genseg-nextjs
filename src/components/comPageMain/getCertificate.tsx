//importando recursos

"use client"
import { useState } from 'react';
//import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

interface comboValores {
  value: String;
  label: String;
}
interface vectorComboValores {
  data: comboValores[];
}

// Componente de demostración de Combobox
function ComboboxDemo({data}:vectorComboValores) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? data.find((data) => data.value === value)?.label
            : data[0].label.toString() }
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            
            <CommandEmpty>No se encontró ningúna sub unidad.</CommandEmpty>
            <CommandGroup>
              {data.map((framework, index) => (
                <CommandItem
                  key={index}
                  value={framework.value.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

//const PrivilegiosPage = () => {
const ObtenerCertificado = ({data}:vectorComboValores) => {
    return (
      <>
        <div className="bg-gray-300 gap-4 text-gray-800 flex flex-col justify-center items-center mx-auto my-[50px] p-8 rounded-lg shadow-lg w-4/5">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Solicitar Certificado</h2>
          <p className="text-sm bg-blue-100 text-blue-600 p-2 rounded-md w-[90%] text-center mb-4">
            ¡Atención! Los certificados se solicitan una vez que el voluntario participante culminó con las 3 actividades designadas.
            <br/> seleccione la subunidad y  luego ingrese su número de DNI
          </p>
          <div className="flex justify-between items-center w-[90%]  mb-4">
            <h3 className="text-lg"></h3>
            {/*<ComboboxDemo {data} />*/}
            <ComboboxDemo data={data} />
            <div className="flex space-x-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="DNI"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Consultar
              </button>
            </div>
          </div>
  
          <p className="text-sm bg-yellow-100 text-yellow-600 p-2 rounded-md w-[90%] text-center">
            Los certificados se entregarán de manera digital a su correo institucional, si requiere en físico apersonarse a la oficina de la DPSEC.
          </p>
        </div>
      </>
    );
  }
  
export default ObtenerCertificado;