'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function CodeInputForm() {
    const [codes, setCodes] = useState({
        code1: '',
        code2: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí puedes manejar el envío del formulario
        console.log('Códigos enviados:', codes)
    }

    const handleChange = (field: 'code1' | 'code2', value: string) => {
        // Solo permitir números
        if (!/^\d*$/.test(value)) return

        setCodes(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
                <Label htmlFor="code1" className="sr-only">
                    Digité su código
                </Label>
                <Input
                    id="code1"
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={codes.code1}
                    onChange={(e) => handleChange('code1', e.target.value)}
                    placeholder="Digité su código"
                    className={cn(
                        "bg-gray-950 text-white placeholder:text-gray-400",
                        "border-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                    )}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="code2" className="sr-only">
                    Digité su código
                </Label>
                <Input
                    id="code2"
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={codes.code2}
                    onChange={(e) => handleChange('code2', e.target.value)}
                    placeholder="Digité su código"
                    className={cn(
                        "bg-gray-950 text-white placeholder:text-gray-400",
                        "border-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                    )}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
            >
                Participar
            </Button>
        </form>
    )
}

