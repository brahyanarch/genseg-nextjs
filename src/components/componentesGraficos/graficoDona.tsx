"use client"

import * as React from "react"
import { TrendingUp, Loader } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { API_PROJECTS_DONA } from "@/config/apiconfig";
export const description = "Char tipo dina para los proyectos"

/*const chartData = [
  { browser: "Completado", visitors: 5, fill: "var(--color-chrome)" },
  { browser: "Pendiente", visitors: 3, fill: "var(--color-safari)" },
  { browser: "Archivado", visitors: 1, fill: "var(--color-firefox)" },
  { browser: "EnCurso", visitors: 2, fill: "var(--color-edge)" },
]*/

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Completado",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Pendiente",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Archivado",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "EnCurso",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

type ProjectStates = {
  Completado: number;
  Pendiente: number;
  Archivado: number;
  Curso: number;
  total: number
};

type ChartData = {
  browser: string;
  visitors: number;
  fill: string;
}[];

export default function Component() {
  const { idsubuni } = useParams();
  const [chartData, setChartData] = useState<ChartData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>();
  

  const fetchProjects = async () => {
    try {
        const response = await fetch(`${API_PROJECTS_DONA}/${idsubuni}`);
        if (!response.ok) throw new Error("Error al cargar proyectos");
        const data: ProjectStates = await response.json();

        // Transformar los datos para la gráfica
        const formattedData: ChartData = [
            { browser: "Completado", visitors: data.Completado, fill: "var(--color-chrome)" },
            { browser: "Pendiente", visitors: data.Pendiente, fill: "var(--color-safari)" },
            { browser: "Archivado", visitors: data.Archivado, fill: "var(--color-firefox)" },
            { browser: "EnCurso", visitors: data.Curso, fill: "var(--color-edge)" },
        ];

        setTotal(data.total);
        setChartData(formattedData);
    } catch (error) {
        console.error("Error fetching projects:", error);
    }finally {
      setIsLoading(false); // Finaliza el indicador de carga
    }
};

useEffect(() => {
    fetchProjects();
}, []);
const totalVisitors = React.useMemo(() => {
  return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
}, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gráfico de todos los proyectos</CardTitle>
        <CardDescription>Número de estados por proyecto</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="animate-spin"/> {/* Muestra el spinner mientras carga */}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent  hideLabel className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 dark:shadow-none"/>}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold dark:fill-white"
                          >
                            {//totalVisitors.toLocaleString()
                              
                              total?.toString()
                            }
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground dark:fill-white"
                          >
                            Proyectos
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
