import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'select'
  options?: string[] // Para filtros de tipo 'select'
}

interface FilterComponentProps {
  config: FilterConfig[]
  onFilterChange: (filters: Record<string, any>) => void
}

export const FilterComponent: React.FC<FilterComponentProps> = ({ config, onFilterChange }) => {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="space-y-4">
      {config.map((filter) => (
        <div key={filter.key} className="flex items-center space-x-2">
          <Label htmlFor={filter.key} className="w-1/4">
            {filter.label}
          </Label>
          {filter.type === 'select' ? (
            <Select
              value={filters[filter.key] || ''}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger className="w-3/4">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={filter.key}
              type={filter.type}
              value={filters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="w-3/4"
            />
          )}
        </div>
      ))}
      <Button onClick={handleResetFilters} variant="outline" className="mt-2">
        Resetear Filtros
      </Button>
    </div>
  )
}

