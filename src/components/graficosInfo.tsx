'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const projectStatusData = [
  { name: 'Completados', value: 45, color: '#10B981' },
  { name: 'En curso', value: 18, color: '#3B82F6' },
  { name: 'Archivados', value: 9, color: '#EF4444' },
  { name: 'Pendientes', value: 27, color: '#F59E0B' },
]

const projectCompletionData = [
  { semester: 'S1', completed: 3, active: 2 },
  { semester: 'S2', completed: 4, active: 1 },
  { semester: 'S3', completed: 2, active: 3 },
  { semester: 'S4', completed: 5, active: 2 },
  { semester: 'S5', completed: 3, active: 1 },
  { semester: 'S6', completed: 4, active: 2 },
]

//Contador de proyectos
export function ProjectCount({ count }: { count: number }) {
  return (
    <div className= " relative bg-gray-800 p-6 rounded-lg">
      <h2 className="text-gray-400 text-sm font-medium mb-2">Números de Proyectos</h2>
      <p className="absolute text-white text-5xl top-[47%] left-[40%] font-bold">{count}</p>
    </div>
  )
}
///Estados de los proyectos
interface ProjectStatus {
  name: string
  value: number
  color: string
}

export function ProjectStatusChart({ data }: { data: ProjectStatus[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const percentage = Math.round((data[0].value / total) * 100)

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-gray-400 text-sm font-medium mb-2">% de Proyectos</h2>
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-[45%] left-[27%] text-center">
          <p className="text-white text-4xl font-bold">{percentage}%</p>
        </div>
      </div>
    </div>
  )
}

//Proyectos completados

interface ProjectCompletion {
  semester: string
  completed: number
  active: number
}

export function ProjectCompletionChart({ data }: { data: ProjectCompletion[] }) {
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0)
  const totalActive = data.reduce((sum, item) => sum + item.active, 0)
  const total = totalCompleted + totalActive
  const completedPercentage = Math.round((totalCompleted / total) * 100)
  const activePercentage = Math.round((totalActive / total) * 100)

  return (
    <div className= "  bg-gray-800 p-6 rounded-lg">
      <h2 className="text-gray-400 text-sm font-medium mb-2">Total de Proyectos terminados por semestre</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="semester" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="completed" fill="#3B82F6" />
            <Bar dataKey="active" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-400">Completados {completedPercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-400">Activos {activePercentage}%</span>
        </div>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const totalProjects = projectStatusData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-[90%] mt-4 bg-gray-900 h-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProjectCount count={totalProjects} />
        <ProjectStatusChart data={projectStatusData} />
        <div className="md:col-span-2">
          <ProjectCompletionChart data={projectCompletionData} />
        </div>
      </div>
    </div>
  )
}