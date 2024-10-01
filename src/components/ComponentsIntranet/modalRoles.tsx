'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function EditModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [abbreviation, setAbbreviation] = useState('')

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Submitted:', { name, abbreviation })
    closeModal()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Edit Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-gray-800 p-6 rounded-lg shadow-xl w-96">
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
              <div className="mb-6">
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
      )}
    </div>
  )
}