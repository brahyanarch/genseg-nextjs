'use client'
import {useState} from 'react'
import { Button } from "@/components/ui/button"
import { useParams, usePathname, useRouter } from "next/navigation"

const DetailsActivities = () => {
    const router = useRouter();
    const pathname = usePathname();
    const toggleOpenDetsAct = () =>{
      router.back();
    }
    return(
        <>
        Este es la interfaz de detalles de una actividad.
        <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 px-0" onClick={toggleOpenDetsAct}>
          Atras
        </Button>
        <h1>
            estamos en la Ruta:
            {pathname}
        </h1>
        </>
    )
}

export default DetailsActivities;