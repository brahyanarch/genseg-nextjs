'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { API_URL } from "@/config/apiconfig"
import Swal from "sweetalert2"
interface programaEstudio{
    idpe: number,
    nmPE:string
}
interface infoParticipante {
    idest: number,
    dni: string,
    codigo: string
    nombre: string,
    aPaterno: string,
    aMaterno: string,
    email: string, 
    prgest: programaEstudio
}
export function ParticipateModal({ toggleModal, idActivity }: { toggleModal: () => void, idActivity: number }) {
    const [dni, setDni] = useState('');
    const [codigo, setCodigo] = useState('');
    const [infoParticipate, setInfoParticipate] = useState<infoParticipante>({});
    const [stateinfo, setStateinfo] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Códigos enviados:')
    }

    ///funcion para obtener los datos del estudiante(participante)
    const handleDataParticipate = async () => {
        try {
            const response = await fetch(`${API_URL}/api/estudiante/${codigo}/${dni}`);

            if (response.ok) {
                const data = await response.json();
                setInfoParticipate(data.estudiante);
                setStateinfo(true);

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener los datos del participante'

                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error no se pudo obtener los datos del participante',
                text: 'Compruebe su conexion a internet'

            })
        }
    }
    //funcion para participar en la actividad
    const handleParticipate = async () => {
        try {
            const response = await fetch(`${API_URL}/api/inscripcion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idactividad: idActivity,
                    idestudiante: infoParticipate.idest
                })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Participante registrado',
                    text: 'Usted se ha registrado correctamente en la actividad'
                })

                toggleModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `El usuario ya está registrado`
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error no se pudo registrar al participante',
                text: 'Compruebe su conexion a internet'
            })
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
            {/* Fondo Oscuro */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={toggleModal}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">

                {/* Encabezado */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Participar</h2>
                    <button
                        onClick={toggleModal}
                        className="text-gray-400 hover:text-gray-600 transition">
                        ✕
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="code1" className="block text-sm font-medium text-gray-700">
                            DNI
                        </Label>
                        <Input
                            id="code1"
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="Ingrese su DNI"
                            className={cn(
                                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                                "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            )}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="code2" className="block text-sm font-medium text-gray-700">
                            Código
                        </Label>
                        <Input
                            id="code2"
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Ingrese su código"
                            className={cn(
                                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                                "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            )}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-md py-2"
                        onClick={handleDataParticipate}
                    >
                        Verificar
                    </Button>

                </form>

                {stateinfo && (
                    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
                        {/* Encabezado */}
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">Información del Participante</h1>
                            <p className="text-gray-600">Revise los datos antes de continuar</p>
                        </div>
                        {/* Información del participante */}
                        <div className="space-y-4">
                                    <p className="text-lg font-medium text-gray-800">Nombre: {infoParticipate.nombre}</p>
                                    <p className="text-lg font-medium text-gray-800">Apellido: {infoParticipate.aPaterno}</p>
                                    <p className="text-lg font-medium text-gray-800">DNI: {infoParticipate.dni}</p>
                                    <p className="text-lg font-medium text-gray-800">Código: {infoParticipate.email}</p>
                                    <p className="text-lg font-medium text-gray-800">Programa de estudios: {infoParticipate.prgest.nmPE}</p>
                        </div>
                        {/* Botón */}
                        <div>
                            <Button
                                className="w-full bg-indigo-600 mx-auto text-white hover:bg-indigo-700 transition rounded-md py-3"
                                onClick={handleParticipate}
                            >
                                Participar
                            </Button>
                        </div>
                    </div>
                )

                }
            </div>
        </div>
    )
}
