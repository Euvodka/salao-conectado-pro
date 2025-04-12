
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

// Sample data for the chart
const monthlyData = [
  { name: "Jan", agendamentos: 65, faturamento: 3200, clientes: 12 },
  { name: "Fev", agendamentos: 59, faturamento: 2900, clientes: 10 },
  { name: "Mar", agendamentos: 80, faturamento: 3800, clientes: 15 },
  { name: "Abr", agendamentos: 81, faturamento: 3900, clientes: 16 },
  { name: "Mai", agendamentos: 90, faturamento: 4300, clientes: 18 },
  { name: "Jun", agendamentos: 86, faturamento: 4100, clientes: 17 },
];

const weeklyData = [
  { name: "Seg", agendamentos: 12, faturamento: 600, clientes: 3 },
  { name: "Ter", agendamentos: 15, faturamento: 750, clientes: 4 },
  { name: "Qua", agendamentos: 8, faturamento: 400, clientes: 2 },
  { name: "Qui", agendamentos: 14, faturamento: 700, clientes: 3 },
  { name: "Sex", agendamentos: 20, faturamento: 1000, clientes: 5 },
  { name: "Sáb", agendamentos: 18, faturamento: 900, clientes: 4 },
  { name: "Dom", agendamentos: 5, faturamento: 250, clientes: 1 },
];

const dailyData = [
  { name: "08h", agendamentos: 2, faturamento: 100, clientes: 2 },
  { name: "10h", agendamentos: 4, faturamento: 200, clientes: 4 },
  { name: "12h", agendamentos: 3, faturamento: 150, clientes: 3 },
  { name: "14h", agendamentos: 6, faturamento: 300, clientes: 5 },
  { name: "16h", agendamentos: 5, faturamento: 250, clientes: 4 },
  { name: "18h", agendamentos: 4, faturamento: 200, clientes: 3 },
  { name: "20h", agendamentos: 1, faturamento: 50, clientes: 1 },
];

type ChartPeriod = "day" | "week" | "month";

export function PerformanceChart() {
  const [period, setPeriod] = useState<ChartPeriod>("month");
  
  const data = 
    period === "day" ? dailyData :
    period === "week" ? weeklyData :
    monthlyData;
  
  const getGrowthPercentage = (metric: string): number => {
    if (period === "month") {
      const currentValue = monthlyData[monthlyData.length - 1][metric as keyof typeof monthlyData[0]];
      const previousValue = monthlyData[monthlyData.length - 2][metric as keyof typeof monthlyData[0]];
      
      if (typeof currentValue === 'number' && typeof previousValue === 'number') {
        return Math.round(((currentValue - previousValue) / previousValue) * 100);
      }
    } else if (period === "week") {
      const currentWeekTotal = weeklyData.reduce((sum, day) => sum + (day[metric as keyof typeof weeklyData[0]] as number), 0);
      const previousWeekEstimate = currentWeekTotal * 0.9; // Simulate previous week data
      
      return Math.round(((currentWeekTotal - previousWeekEstimate) / previousWeekEstimate) * 100);
    } else {
      const currentDayTotal = dailyData.reduce((sum, hour) => sum + (hour[metric as keyof typeof dailyData[0]] as number), 0);
      const previousDayEstimate = currentDayTotal * 0.85; // Simulate previous day data
      
      return Math.round(((currentDayTotal - previousDayEstimate) / previousDayEstimate) * 100);
    }
    
    return 0;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Análise de Desempenho</CardTitle>
            <CardDescription>Visualize o crescimento do seu negócio</CardDescription>
          </div>
          <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as ChartPeriod)}>
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="agendamentos" stroke="#6366f1" activeDot={{ r: 8 }} name="Agendamentos" />
                <Line type="monotone" dataKey="faturamento" stroke="#06b6d4" name="Faturamento (R$)" />
                <Line type="monotone" dataKey="clientes" stroke="#f97316" name="Novos Clientes" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-md">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Gráfico de desempenho</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-600 font-medium">Agendamentos</p>
            <p className="text-lg font-bold">+{getGrowthPercentage('agendamentos')}%</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-600 font-medium">Faturamento</p>
            <p className="text-lg font-bold">+{getGrowthPercentage('faturamento')}%</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="text-sm text-purple-600 font-medium">Novos clientes</p>
            <p className="text-lg font-bold">+{getGrowthPercentage('clientes')}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
