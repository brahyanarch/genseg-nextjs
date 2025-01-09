"use client"

import * as React from "react"
import {useState, useEffect} from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { API_PROJECTS_GRAFICOS } from "@/config/apiconfig";
import { useParams } from "next/navigation";
export const description = "Graficos interactivos"

interface GraficoData {
  date: Date | null;
  completado: number;
  pendiente: number;
  archivado: number;
  curso: number;
}

type Item = {
  date: Date
}

/*const chartData = [
  { date: "2022-07-01", completado:130,pendiente: 222, archivado: 150  , curso: 400 },
  { date: "2022-07-02", completado:130,pendiente: 97, archivado: 180 , curso: 400 },
  { date: "2022-07-03", completado:130,pendiente: 167, archivado: 120  , curso: 400 },
  { date: "2022-07-04", completado:130,pendiente: 242, archivado: 260  , curso: 400 },
  { date: "2022-07-05", completado:130,pendiente: 373, archivado: 290  , curso: 400 },
  { date: "2024-07-07", completado:1,pendiente: 0, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 1, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 1 , curso: 0 },
  { date: "2024-07-07", completado:1,pendiente: 0, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 1, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 1 , curso: 0 },
  { date: "2024-07-07", completado:1,pendiente: 0, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 1, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 1 , curso: 0 },
  { date: "2024-07-07", completado:1,pendiente: 0, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 1, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 1 , curso: 0 },
  { date: "2024-07-07", completado:1,pendiente: 0, archivado: 0  , curso: 0 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 0, archivado: 0  , curso: 1 },
  { date: "2024-07-07", completado:0,pendiente: 1, archivado: 0  , curso: 0 },
  { date: "2024-07-09", completado:0,pendiente: 0, archivado: 1 , curso: 0 },
]*/

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  completado: {
    label: "Completado",
    color: "#42962d",
  },
  pendiente: {
    label: "Pendiente",
    color: "#ffcc85",
  },
  archivado: {
    label: "Archivado",
    color: "#ad3929",
  },
  curso: {
    label: "Curso",
    color: "#0097eb",
  },
} satisfies ChartConfig


export default function Component() {
  const [chartData, setchartData] = useState<GraficoData[]>([]);
  const { idsubuni } = useParams();

  const fetchGraficos = async () => {
    try {
      const response = await fetch(`${API_PROJECTS_GRAFICOS}`); // Cambia la ruta si es necesario
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const jsonData: GraficoData[] = await response.json();
      setchartData(jsonData); // Almacenar los datos en el estado
    } catch (err: unknown) {
      // Manejo de errores
      //setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      //setLoading(false); // Termina el estado de carga
    }
  };

  useEffect(() => {
  fetchGraficos();
  }, []);

  const [timeRange, setTimeRange] = React.useState("3a")

  const filteredData = chartData.filter((item) => {
    if (!item.date) {
      // Si `date` es null, excluye este elemento
      return false;
    }
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 1095
    if (timeRange === "2a") {
      daysToSubtract = 730
    } else if (timeRange === "1a") {
      daysToSubtract = 365
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card className="w-[90%] mt-14 z-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Graficas generales de las todas las actividades de la sub unidad</CardTitle>
          <CardDescription>
            Estados de las actividades por mes 
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3a" className="rounded-lg">
              Ultimos 3 años
            </SelectItem>
            <SelectItem value="2a" className="rounded-lg">
              Ultimos 2 años
            </SelectItem>
            <SelectItem value="1a" className="rounded-lg">
              Ultimo año
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
  <defs>
    <linearGradient id="fillCurso" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="var(--color-curso)" stopOpacity={0.8} />
      <stop offset="95%" stopColor="var(--color-curso)" stopOpacity={0.1} />
    </linearGradient>
    <linearGradient id="fillArchivado" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="var(--color-archivado)" stopOpacity={0.8} />
      <stop offset="95%" stopColor="var(--color-archivado)" stopOpacity={0.1} />
    </linearGradient>
    <linearGradient id="fillPendiente" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="var(--color-pendiente)" stopOpacity={0.8} />
      <stop offset="95%" stopColor="var(--color-pendiente)" stopOpacity={0.1} />
    </linearGradient>
    <linearGradient id="fillCompletado" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="var(--color-completado)" stopOpacity={0.8} />
      <stop offset="95%" stopColor="var(--color-completado)" stopOpacity={0.1} />
    </linearGradient>
  </defs>
  <CartesianGrid vertical={true} />
  <XAxis
    dataKey="date"
    tickLine={true}
    axisLine={true}
    tickMargin={8}
    minTickGap={32}
    tickFormatter={(value) => {
      const date = new Date(value);
      return date.toLocaleDateString("es-PE", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }}
  />
   <YAxis
    tickLine={true} // Mostrar líneas de los ticks en el eje
    axisLine={true} // Mostrar la línea del eje
    tickMargin={10} // Margen entre las etiquetas y el eje
    tickFormatter={(value) => {
      return `${value}%`; // Formato del valor, puedes ajustarlo a tus necesidades
    }}
  />
  <ChartTooltip
    cursor={true}
    content={
      <ChartTooltipContent
        labelFormatter={(value) => {
          return new Date(value).toLocaleDateString("es-PE", {
            month: "short",
            day: "numeric",
            year: "numeric"
          });
        }}
        indicator="dot"
        className="bg-slate-100 dark:bg-slate-900"
      />
    }
  />
  {/* Invert the order here */}
  <Area
    dataKey="archivado"
    type="natural"
    fill="url(#fillArchivado)"
    stroke="var(--color-archivado)"
    stackId="a"
  />
  <Area
    dataKey="curso"
    type="natural"
    fill="url(#fillCurso)"
    stroke="var(--color-curso)"
    stackId="a"
  />
  <Area
    dataKey="pendiente"
    type="natural"
    fill="url(#fillPendiente)"
    stroke="var(--color-pendiente)"
    stackId="a"
  />
  <Area
    dataKey="completado"
    type="natural"
    fill="url(#fillCompletado)"
    stroke="var(--color-completado)"
    stackId="a"
  />
  <ChartLegend content={<ChartLegendContent />} />
</AreaChart>

        </ChartContainer>
      </CardContent>
    </Card>
  )
}
