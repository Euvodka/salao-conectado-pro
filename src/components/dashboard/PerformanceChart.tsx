
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

// Sample data for the chart - in a real app, this would come from an API
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
type MetricType = "agendamentos" | "faturamento" | "clientes";

export function PerformanceChart() {
  const [period, setPeriod] = useState<ChartPeriod>("month");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("agendamentos");
  
  const data = 
    period === "day" ? dailyData :
    period === "week" ? weeklyData :
    monthlyData;

  const getGrowthPercentage = (): number => {
    const currentData = data;
    const currentTotal = currentData.reduce((sum, item) => sum + item[selectedMetric], 0);
    const previousTotal = currentTotal * 0.9; // Simulando dados anteriores
    
    return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  };

  const metricLabels = {
    agendamentos: "Agendamentos",
    faturamento: "Faturamento (R$)",
    clientes: "Novos Clientes"
  };

  const metricColors = {
    agendamentos: "#6366f1",
    faturamento: "#06b6d4",
    clientes: "#f97316"
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <CardTitle className="text-lg">Análise de Desempenho</CardTitle>
            <CardDescription>Visualize o crescimento do seu negócio</CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as MetricType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione a métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agendamentos">Agendamentos</SelectItem>
                <SelectItem value="faturamento">Faturamento</SelectItem>
                <SelectItem value="clientes">Novos Clientes</SelectItem>
              </SelectContent>
            </Select>
            <Tabs value={period} onValueChange={(value) => setPeriod(value as ChartPeriod)} className="w-fit">
              <TabsList>
                <TabsTrigger value="day">Dia</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric}
                  stroke={metricColors[selectedMetric]}
                  name={metricLabels[selectedMetric]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-md">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Sem dados disponíveis</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className={`p-3 rounded-md ${
            selectedMetric === "agendamentos" ? "bg-indigo-50" :
            selectedMetric === "faturamento" ? "bg-cyan-50" :
            "bg-orange-50"
          }`}>
            <p className={`text-sm font-medium ${
              selectedMetric === "agendamentos" ? "text-indigo-600" :
              selectedMetric === "faturamento" ? "text-cyan-600" :
              "text-orange-600"
            }`}>
              {metricLabels[selectedMetric]}
            </p>
            <p className="text-lg font-bold">+{getGrowthPercentage()}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
