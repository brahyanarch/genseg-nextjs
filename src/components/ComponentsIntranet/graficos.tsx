"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "Graficos interactivos"

const chartData = [
  { date: "2022-07-01", completado:130,pendiente: 222, archivado: 150  , curso: 400 },
  { date: "2022-07-02", completado:130,pendiente: 97, archivado: 180 , curso: 400 },
  { date: "2022-07-03", completado:130,pendiente: 167, archivado: 120  , curso: 400 },
  { date: "2022-07-04", completado:130,pendiente: 242, archivado: 260  , curso: 400 },
  { date: "2022-07-05", completado:130,pendiente: 373, archivado: 290  , curso: 400 },
  { date: "2022-07-06", completado:130,pendiente: 301, archivado: 340  , curso: 400 },
  { date: "2022-07-07", completado:130,pendiente: 245, archivado: 180  , curso: 400 },
  { date: "2022-07-08", completado:130,pendiente: 409, archivado: 320  , curso: 400 },
  { date: "2022-07-09", completado:130,pendiente: 59, archivado: 110 , curso: 400 },
  { date: "2022-07-10", completado:130,pendiente: 261, archivado: 190  , curso: 400 },
  { date: "2022-07-11", completado:130,pendiente: 327, archivado: 350  , curso: 400 },
  { date: "2022-07-12", completado:130,pendiente: 292, archivado: 210  , curso: 400 },
  { date: "2022-07-13", completado:130,pendiente: 342, archivado: 380  , curso: 400 },
  { date: "2022-07-14", completado:130,pendiente: 137, archivado: 220  , curso: 400 },
  { date: "2022-07-15", completado:130,pendiente: 120, archivado: 170  , curso: 400 },
  { date: "2022-07-16", completado:130,pendiente: 138, archivado: 190  , curso: 400 },
  { date: "2022-07-17", completado:130,pendiente: 446, archivado: 360  , curso: 400 },
  { date: "2022-07-18", completado:130,pendiente: 364, archivado: 410  , curso: 400 },
  { date: "2022-07-19", completado:130,pendiente: 243, archivado: 180  , curso: 400 },
  { date: "2022-07-20", completado:130,pendiente: 89, archivado: 150 , curso: 400 },
  { date: "2022-07-21", completado:130,pendiente: 137, archivado: 200  , curso: 400 },
  { date: "2022-07-22", completado:130,pendiente: 224, archivado: 170  , curso: 400 },
  { date: "2022-07-23", completado:130,pendiente: 138, archivado: 230  , curso: 400 },
  { date: "2023-07-24", completado:130,pendiente: 387, archivado: 290  , curso: 400 },
  { date: "2023-07-25", completado:130,pendiente: 215, archivado: 250  , curso: 400 },
  { date: "2023-07-26", completado:130,pendiente: 75, archivado: 130 , curso: 400 },
  { date: "2023-07-27", completado:130,pendiente: 383, archivado: 420  , curso: 400 },
  { date: "2023-07-28", completado:130,pendiente: 122, archivado: 180  , curso: 400 },
  { date: "2023-07-29", completado:130,pendiente: 315, archivado: 240  , curso: 400 },
  { date: "2023-07-30", completado:130,pendiente: 454, archivado: 380  , curso: 400 },
  { date: "2023-08-01", completado:130,pendiente: 165, archivado: 220  , curso: 400 },
  { date: "2023-08-02", completado:100,pendiente: 293, archivado: 310  , curso: 400 },
  { date: "2023-08-03", completado:150,pendiente: 247, archivado: 190  , curso: 400 },
  { date: "2023-08-04", completado:150,pendiente: 385, archivado: 420  , curso: 400 },
  { date: "2023-08-05", completado:150,pendiente: 481, archivado: 390  , curso: 400 },
  { date: "2023-08-06", completado:150,pendiente: 498, archivado: 520  , curso: 400 },
  { date: "2023-08-07", completado:150,pendiente: 388, archivado: 300  , curso: 400 },
  { date: "2023-08-08", completado:250,pendiente: 149, archivado: 210  , curso: 400 },
  { date: "2024-08-09", completado:150,pendiente: 227, archivado: 180  , curso: 400 },
  { date: "2024-08-10", completado:150,pendiente: 293, archivado: 330  , curso: 400 },
  { date: "2024-08-11", completado:150,pendiente: 335, archivado: 270  , curso: 400 },
  { date: "2024-08-12", completado:150,pendiente: 197, archivado: 240  , curso: 400 },
  { date: "2024-08-13", completado:150,pendiente: 197, archivado: 160  , curso: 400 },
  { date: "2024-08-14", completado:150,pendiente: 448, archivado: 490  , curso: 400 },
  { date: "2024-08-15", completado:150,pendiente: 473, archivado: 380  , curso: 400 },
  { date: "2024-08-16", completado:150,pendiente: 338, archivado: 400  , curso: 400 },
  { date: "2024-08-17", completado:100,pendiente: 499, archivado: 420  , curso: 400 },
  { date: "2024-08-18", completado:320,pendiente: 315, archivado: 350  , curso: 400 },
  { date: "2024-08-19", completado:320,pendiente: 235, archivado: 180  , curso: 400 },
  { date: "2024-08-20", completado:320,pendiente: 177, archivado: 230  , curso: 400 },
  { date: "2024-08-21", completado:321,pendiente: 82, archivado: 140 , curso: 400 },
  { date: "2024-08-22", completado:325,pendiente: 81, archivado: 120 , curso: 400 },
  { date: "2024-08-23", completado:326,pendiente: 252, archivado: 290  , curso: 400 },
  { date: "2024-08-24", completado:320,pendiente: 294, archivado: 220  , curso: 400 },
  { date: "2024-08-25", completado:320,pendiente: 201, archivado: 250  , curso: 400 },
  { date: "2024-08-26", completado:320,pendiente: 213, archivado: 170  , curso: 400 },
  { date: "2024-08-27", completado:320,pendiente: 420, archivado: 460  , curso: 400 },
  { date: "2024-08-28", completado:320,pendiente: 233, archivado: 190  , curso: 400 },
  { date: "2024-08-29", completado:320,pendiente: 78, archivado: 130 , curso: 400 },
  { date: "2024-08-30", completado:320,pendiente: 340, archivado: 280  , curso: 400 },
  { date: "2024-08-31", completado:100,pendiente: 178, archivado: 230  , curso: 400 },
  { date: "2024-09-01", completado:100,pendiente: 178, archivado: 200  , curso: 400 },
  { date: "2024-09-02", completado:100,pendiente: 470, archivado: 410  , curso: 400 },
  { date: "2024-09-03", completado:100,pendiente: 103, archivado: 160  , curso: 400 },
  { date: "2024-09-04", completado:100,pendiente: 439, archivado: 380  , curso: 400 },
  { date: "2024-09-05", completado:100,pendiente: 88, archivado: 140 , curso: 400 },
  { date: "2024-09-06", completado:100,pendiente: 294, archivado: 250  , curso: 400 },
  { date: "2024-09-07", completado:100,pendiente: 323, archivado: 370  , curso: 400 },
  { date: "2024-09-08", completado:100,pendiente: 385, archivado: 320  , curso: 400 },
  { date: "2024-09-09", completado:100,pendiente: 438, archivado: 480  , curso: 400 },
  { date: "2024-09-10", completado:100,pendiente: 155, archivado: 200  , curso: 400 },
  { date: "2024-09-11", completado:100,pendiente: 92, archivado: 150 , curso: 400 },
  { date: "2024-09-12", completado:100,pendiente: 492, archivado: 420  , curso: 400 },
  { date: "2024-09-13", completado:100,pendiente: 81, archivado: 130 , curso: 400 },
  { date: "2024-09-14", completado:100,pendiente: 426, archivado: 380  , curso: 400 },
  { date: "2024-09-15", completado:100,pendiente: 307, archivado: 350  , curso: 400 },
  { date: "2024-09-16", completado:100,pendiente: 371, archivado: 310  , curso: 400 },
  { date: "2024-09-17", completado:250,pendiente: 475, archivado: 520  , curso: 400 },
  { date: "2024-09-18", completado:100,pendiente: 107, archivado: 170  , curso: 400 },
  { date: "2024-09-19", completado:100,pendiente: 341, archivado: 290  , curso: 400 },
  { date: "2024-09-20", completado:100,pendiente: 408, archivado: 450  , curso: 400 },
  { date: "2024-09-21", completado:100,pendiente: 169, archivado: 210  , curso: 400 },
  { date: "2024-09-22", completado:100,pendiente: 317, archivado: 270  , curso: 400 },
  { date: "2024-09-23", completado:100,pendiente: 480, archivado: 530  , curso: 400 },
  { date: "2024-09-24", completado:100,pendiente: 132, archivado: 180  , curso: 400 },
  { date: "2024-09-25", completado:100,pendiente: 141, archivado: 190  , curso: 400 },
  { date: "2024-09-26", completado:100,pendiente: 434, archivado: 380  , curso: 400 },
  { date: "2024-09-27", completado:100,pendiente: 448, archivado: 490  , curso: 400 },
  { date: "2024-09-28", completado:100,pendiente: 149, archivado: 200  , curso: 400 },
  { date: "2024-09-29", completado:100,pendiente: 103, archivado: 160  , curso: 400 },
  { date: "2024-09-30", completado:100,pendiente: 446, archivado: 400  , curso: 400 },
]

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
  const [timeRange, setTimeRange] = React.useState("3a")

  const filteredData = chartData.filter((item) => {
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
          <CardTitle>Graficas generales de los proyectos</CardTitle>
          <CardDescription>
            Mirando los estados de proyectos
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
      });
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
          });
        }}
        indicator="dot"
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
