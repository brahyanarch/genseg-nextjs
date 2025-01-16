'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Download } from 'lucide-react'
import { FilterableTable } from '@/components/filterableTable'
import { PaginationButtons } from '@/components/paginationButtons'
import { SearchComponent } from '@/components/searchComponent'
import { API_URL } from '@/config/apiconfig'

interface Certificado {
  id: string
  nombre: string
  tipo: string
  codigo: string
}

export default function ConsultaCertificados() {
  const [dni, setDni] = useState('')
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 5

  const handleConsulta = async () => {
    // Aquí iría la lógica para consultar los certificados con el DNI
    // Por ahora, usaremos datos de ejemplo
    try {
      const response = await fetch(`${API_URL}/api/certificado/${dni}/`);
      if (!response.ok) {
        throw new Error('Error al consultar los certificados');
      }
      const data: Certificado[] = await response.json();
      setCertificados(data);
    } catch (error) {
      console.error('Error:', error);
    }
    /*
    const certificadosEjemplo: Certificado[] = [
      { id: '1', actividad: 'Curso de React', tipo: 'Participación', codigoEstudiante: 'E001' },
      { id: '2', actividad: 'Taller de Diseño UX', tipo: 'Aprobación', codigoEstudiante: 'E001' },
      { id: '3', actividad: 'Conferencia de IA', tipo: 'Asistencia', codigoEstudiante: 'E001' },
      { id: '4', actividad: 'Bootcamp de Node.js', tipo: 'Aprobación', codigoEstudiante: 'E001' },
      { id: '5', actividad: 'Seminario de Blockchain', tipo: 'Participación', codigoEstudiante: 'E001' },
      { id: '6', actividad: 'Curso de Python', tipo: 'Aprobación', codigoEstudiante: 'E001' },
      { id: '7', actividad: 'Taller de Data Science', tipo: 'Asistencia', codigoEstudiante: 'E001' },
    ]
    setCertificados(certificadosEjemplo)*/
    setCurrentPage(1)
    setSearchTerm('')
  }

  const handleVerCertificado = (id: string) => {
    // Lógica para ver el certificado
    console.log(`Ver certificado ${id}`)
  }

  const handleDescargarCertificado = (id: string) => {
    // Lógica para descargar el certificado
    console.log(`Descargar certificado ${id}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: Certificado) => <>{certificados.indexOf(item) + 1}</>,
      sortable: true,
    },
    {
      key: "actividad",
      label: "Actividad",
      render: (item: Certificado) => item.nombre || 'Nombre Certificado',
      sortable: true,
    },
    {
      key: "tipo",
      label: "Tipo de Certificado",
      render: (item: Certificado) => item.tipo,
      sortable: true,
    },
    {
      key: "codigo",
      label: "Código",
      render: (item: Certificado) => item.codigo,
      sortable: true,
    },
    {
      key: "opciones",
      label: "Opciones",
      render: (item: Certificado) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleVerCertificado(item.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDescargarCertificado(item.id)}
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
        </div>
      ),
    },
  ];


const filteredCertificados = useMemo(() => {
  return certificados.filter((cert) =>
    Object.values(cert).some((value) => {
      if (typeof value === 'string') { // Verifica si es una cadena
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false; // Ignora otros tipos de valores
    })
  );
}, [certificados, searchTerm]);

  const totalPages = Math.ceil(filteredCertificados.length / itemsPerPage)
  const paginatedData = filteredCertificados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="bg-gray-300 gap-4 text-gray-800 flex flex-col justify-center items-center mx-auto my-[50px] p-8 rounded-lg shadow-lg w-4/5">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Consulta de Certificados</h2>
      <p className="text-sm bg-blue-100 text-blue-600 p-2 rounded-md w-[90%] text-center mb-4">
        ¡Atención! Los certificados se solicitan una vez que el voluntario participante culminó con las 3 actividades designadas.
        <br /> Ingrese su número de DNI para consultar los certificados disponibles.
      </p>
      <div className="flex justify-between items-center w-[90%] mb-4">
        <h3 className="text-lg"></h3>
        <div className="w-[60%] flex justify-between items-center space-x-8 mx-auto">
          <Input
            type="text"
            placeholder="Ingrese su DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="border border-gray-900 p-2 bg-white rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 max-w-xs"
            maxLength={8}
          />
          <Button
            onClick={handleConsulta}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-md transition duration-300"
          >
            Consultar
          </Button>
        </div>
      </div>
      <p className="text-sm bg-yellow-100 text-yellow-600 p-2 rounded-md w-[90%] text-center mb-2">
        Los certificados se entregarán de manera digital a su correo institucional. Si requiere en físico, apersónese a la oficina de la DPSEC.
      </p>
    
      {certificados.length > 0 && (
        <div className="w-full bg-white rounded-lg p-6 shadow-md mt-2">
          <h3 className="text-gray-700 font-bold text-xl mb-4">
            Certificados encontrados
          </h3>
          <SearchComponent
            onSearchChange={handleSearchChange}
          />
          <div className="mt-4">
            <FilterableTable
              data={paginatedData}
              columns={columns}
              filterConfig={columns}
            />
          </div>
          <div className="mt-4">
            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

