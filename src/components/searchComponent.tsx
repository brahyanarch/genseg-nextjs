import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

interface SearchComponentProps {
  onSearchChange: (searchTerm: string) => void
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleResetSearch = () => {
    setSearchTerm('')
    onSearchChange('')
  }

  return (
    <div className="flex items-center space-x-2 w-[30%]">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Buscar certificados..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 text-gray-800 pr-4 py-2 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      {/*
      <Button onClick={handleResetSearch} variant="outline" size="sm">
        Limpiar
      </Button>
       */}
    </div>
  )
}

