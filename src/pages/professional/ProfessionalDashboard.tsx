
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ClientRemarketingCard } from "@/components/dashboard/ClientRemarketingCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, DollarSign, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
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

  const handleNewPost = () => {
    navigate('/professional/feed');
    toast({
      title: "Criar nova publicação",
      description: "Redirecionando para a página de publicações.",
    });
  };

  const handleSettings = () => {
    navigate('/professional/profile');
    toast({
      title: "Configurações",
      description: "Redirecionando para a página de perfil.",
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'appointment':
        navigate('/professional/calendar');
        toast({
          title: "Novo Agendamento",
          description: "Redirecionando para a agenda.",
        });
        break;
      case 'client':
        toast({
          title: "Adicionar Cliente",
          description: "Abrindo formulário de novo cliente.",
        });
        break;
      case 'payment':
        toast({
          title: "Registrar Pagamento",
          description: "Abrindo formulário de pagamento.",
        });
        break;
      default:
        break;
    }
  };

  const handleViewSchedule = () => {
    navigate('/professional/calendar');
    toast({
      title: "Ver Agenda",
      description: "Redirecionando para a agenda completa.",
    });
  };

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
            <Button onClick={handleNewPost}>Nova Publicação</Button>
            <Button variant="outline" onClick={handleSettings}>Configurações</Button>
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
                <PerformanceChart />

                {/* Client remarketing section */}
                <ClientRemarketingCard />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Upcoming appointments */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
                    <p className="text-sm text-muted-foreground">Veja o que está programado para hoje e amanhã</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            toast({
                              title: "Detalhes do agendamento",
                              description: `Agendamento de ${appointment.client} para ${appointment.service}.`,
                            });
                          }}
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
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleViewSchedule}
                      >
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
                    <Button 
                      className="w-full justify-start"
                      onClick={() => handleQuickAction('appointment')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Novo Agendamento
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleQuickAction('client')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Adicionar Cliente
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleQuickAction('payment')}
                    >
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
