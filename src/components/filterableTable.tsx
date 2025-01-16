import React, { useState, useMemo } from 'react'
import { FilterComponent } from '@/components/filterComponent'
import DynamicTable from './DynamicTable'

interface FilterableTableProps {
  data: any[]
  columns: any[]
  filterConfig: any[]
}

export const FilterableTable: React.FC<FilterableTableProps> = ({ data, columns, filterConfig }) => {
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const itemValue = item[key]
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }
        if (typeof itemValue === 'number') {
          return itemValue === Number(value)
        }
        return true
      })
    })
  }, [data, filters])

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-4">
      {/* <FilterComponent config={filterConfig} onFilterChange={setFilters} /> */}
      <DynamicTable
        configuration={columns}
        data={sortedData }
        onSort={handleSort}
      />
    </div>
  )
}

