'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, Edit, Trash2, List, CirclePlus, ChevronsUpDown } from "lucide-react"
import { useState } from 'react'

const roles = [
  { id: 1, nombre: "Sub administrador", abreviatura: "SubAdm" },
  { id: 2, nombre: "Coordinador", abreviatura: "Coord" },
  { id: 3, nombre: "Personal de planta", abreviatura: "PP" },
  { id: 4, nombre: "Profesor", abreviatura: "Vol" },
  { id: 5, nombre: "Voluntario", abreviatura: "Prof" },
]

// Modal para agregar un nuevo Rol
export function EditModal({ isOpen, closeModal }:any) {
  const [name, setName] = useState('')
  const [abbreviation, setAbbreviation] = useState('')

  const handleSubmit = (e:any) => {
    e.preventDefault()
    // Manejar la lógica de envío del formulario aquí
    console.log('Submitted:', { name, abbreviation })
    closeModal()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-[50%] h-[60%]">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">Editar</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sub administrador"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-300 mb-1">
              Abreviatura
            </label>
            <input
              type="text"
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="SubAdm"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="p-4 m-4 space-y-4 w-[90%] mt-4 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
      </div>
      <div className="flex justify-between">
        <Button variant="secondary" size="sm" onClick={toggleModal}>
          <CirclePlus className="h-4 w-4" />
          Nuevo
        </Button>
        <Input className="w-64" placeholder="Buscar..." />
      </div>
      <div className="bg-[#E3E6ED] rounded-lg">
        <Table className="w-[90%] mx-auto my-6 border-1">
          <TableHeader className="bg-gray-900 text-white">
            <TableRow>
              <TableHead className="border-l border-gray-900">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Abreviatura</TableHead>
              <TableHead className="w-24 border-r border-gray-900">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#FFFFFF] text-[#141824]">
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="px-6 border-l border-gray-900">{role.id}</TableCell>
                <TableCell>{role.nombre}</TableCell>
                <TableCell>{role.abreviatura}</TableCell>
                <TableCell className="px-2 border-r border-gray-900">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          Anterior
        </Button>
        <span>1</span>
        <Button variant="outline" size="sm">
          Siguiente
        </Button>
      </div>

      {/* Modal para agregar un nuevo rol */}
      <EditModal isOpen={isModalOpen} closeModal={toggleModal} />
    </div>
  )
}
