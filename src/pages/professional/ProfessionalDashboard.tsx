
import { useState, useEffect } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Sample appointments data
  const upcomingAppointments = [
    {
      id: "1",
      client: "Ana Silva",
      service: "Corte e Escova",
      time: "Hoje, 14:30",
      price: "R$ 150,00",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop"
    },
    {
      id: "2",
      client: "João Pereira",
      service: "Barba",
      time: "Hoje, 16:00",
      price: "R$ 50,00",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374&auto=format&fit=crop"
    },
    {
      id: "3",
      client: "Maria Oliveira",
      service: "Manicure e Pedicure",
      time: "Amanhã, 10:15",
      price: "R$ 80,00",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-salon-800">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta, {user?.name.split(' ')[0]}!</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
            <Button>Nova Publicação</Button>
            <Button variant="outline">Configurações</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-lg shadow"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Agendamentos Hoje"
                value="5"
                icon={CalendarIcon}
                description="2 concluídos, 3 pendentes"
              />
              <StatCard
                title="Clientes Ativos"
                value="48"
                icon={Users}
                description="+12% desde o mês passado"
              />
              <StatCard
                title="Faturamento Mensal"
                value="R$ 3.850"
                icon={DollarSign}
                description="+8% desde o mês passado"
              />
              <StatCard
                title="Tempo Médio de Serviço"
                value="45 min"
                icon={Clock}
                description="Redução de 5 min"
              />
            </div>

            {/* Main dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Performance chart section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Análise de Desempenho</CardTitle>
                    <CardDescription>Visualize o crescimento do seu negócio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[240px] flex items-center justify-center bg-gray-100 rounded-md">
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Gráfico de desempenho</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="text-sm text-green-600 font-medium">Agendamentos</p>
                        <p className="text-lg font-bold">+18%</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm text-blue-600 font-medium">Faturamento</p>
                        <p className="text-lg font-bold">+12%</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-md">
                        <p className="text-sm text-purple-600 font-medium">Novos clientes</p>
                        <p className="text-lg font-bold">+15%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client remarketing section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clientes e Remarketing</CardTitle>
                    <CardDescription>Gerencie seus clientes e envie mensagens personalizadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="active">
                      <TabsList className="mb-4">
                        <TabsTrigger value="active">Clientes Ativos</TabsTrigger>
                        <TabsTrigger value="inactive">Inativos (30+ dias)</TabsTrigger>
                        <TabsTrigger value="new">Novos Clientes</TabsTrigger>
                      </TabsList>
                      <TabsContent value="active" className="space-y-4">
                        <div className="rounded-md border">
                          <div className="p-4">
                            <div className="font-medium">Lista de clientes ativos</div>
                            <div className="text-sm text-muted-foreground">
                              Clientes que agendaram serviços nos últimos 30 dias
                            </div>
                          </div>
                          <div className="border-t">
                            {/* Sample active client list */}
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {String.fromCharCode(65 + i)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">Cliente Ativo {i + 1}</p>
                                    <p className="text-sm text-muted-foreground">Último agendamento: há {3 + i} dias</p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">Enviar mensagem</Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">Ver todos os clientes ativos</Button>
                      </TabsContent>
                      <TabsContent value="inactive">
                        <div className="bg-amber-50 p-4 rounded-md mb-4">
                          <p className="text-amber-800">26 clientes não agendaram nos últimos 30 dias.</p>
                        </div>
                        <Button>Enviar campanha de remarketing</Button>
                      </TabsContent>
                      <TabsContent value="new">
                        <div className="bg-green-50 p-4 rounded-md mb-4">
                          <p className="text-green-800">8 novos clientes este mês!</p>
                        </div>
                        <Button>Enviar mensagem de boas-vindas</Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Upcoming appointments */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
                    <CardDescription>Veja o que está programado para hoje e amanhã</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 rounded-md border"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={appointment.avatar} />
                              <AvatarFallback>{appointment.client[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.client}</p>
                              <p className="text-sm">{appointment.service}</p>
                              <p className="text-xs text-muted-foreground">{appointment.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.price}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        Ver Agenda Completa
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Novo Agendamento
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Adicionar Cliente
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Registrar Pagamento
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
