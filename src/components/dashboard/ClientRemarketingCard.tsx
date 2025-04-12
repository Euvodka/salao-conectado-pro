
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type ClientType = {
  id: string;
  name: string;
  avatar?: string;
  lastAppointment: string;
  services: string[];
};

const activeClients: ClientType[] = [
  {
    id: "1",
    name: "Ana Silva",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop",
    lastAppointment: "há 3 dias",
    services: ["Corte", "Escova"]
  },
  {
    id: "2",
    name: "João Pereira",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374&auto=format&fit=crop",
    lastAppointment: "há 5 dias",
    services: ["Barba"]
  },
  {
    id: "3",
    name: "Maria Oliveira",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
    lastAppointment: "há 6 dias",
    services: ["Manicure", "Pedicure"]
  }
];

const inactiveClients: ClientType[] = [
  {
    id: "4",
    name: "Carlos Mendes",
    lastAppointment: "há 45 dias",
    services: ["Corte masculino"]
  },
  {
    id: "5",
    name: "Juliana Santos",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
    lastAppointment: "há 38 dias",
    services: ["Coloração", "Hidratação"]
  },
  {
    id: "6",
    name: "Roberto Alves",
    lastAppointment: "há 52 dias",
    services: ["Corte", "Barba"]
  }
];

const newClients: ClientType[] = [
  {
    id: "7",
    name: "Fernanda Lima",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop",
    lastAppointment: "há 2 dias",
    services: ["Corte", "Coloração"]
  },
  {
    id: "8",
    name: "Pedro Costa",
    lastAppointment: "há 5 dias",
    services: ["Corte masculino"]
  }
];

export function ClientRemarketingCard() {
  const { toast } = useToast();
  const [selectedClients, setSelectedClients] = useState<Record<string, boolean>>({});
  
  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };
  
  const getSelectedCount = (clients: ClientType[]) => {
    return clients.filter(client => selectedClients[client.id]).length;
  };
  
  const sendMessage = (clientType: string, bulk: boolean = false) => {
    toast({
      title: "Mensagem enviada",
      description: bulk 
        ? `Mensagem enviada para ${getSelectedCount(clientType === 'inactive' ? inactiveClients : newClients)} clientes.`
        : "Mensagem enviada com sucesso!",
    });
  };
  
  const sendCampaign = (clientType: string) => {
    toast({
      title: "Campanha enviada",
      description: `Campanha enviada para ${clientType === 'inactive' ? 'clientes inativos' : 'novos clientes'}.`,
    });
  };

  return (
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
                {activeClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback>
                          {client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">Último agendamento: {client.lastAppointment}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Enviar mensagem",
                          description: `Enviando mensagem para ${client.name}...`,
                        });
                      }}
                    >
                      Enviar mensagem
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Ver todos os clientes",
                  description: "Redirecionando para a página de clientes...",
                });
              }}
            >
              Ver todos os clientes ativos
            </Button>
          </TabsContent>
          <TabsContent value="inactive">
            <div className="bg-amber-50 p-4 rounded-md mb-4">
              <p className="text-amber-800">{inactiveClients.length} clientes não agendaram nos últimos 30 dias.</p>
            </div>
            <div className="mb-4 space-y-2">
              {inactiveClients.map((client) => (
                <div key={client.id} className="flex items-center p-2 rounded hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    id={`inactive-${client.id}`} 
                    className="mr-3"
                    checked={!!selectedClients[client.id]}
                    onChange={() => toggleClientSelection(client.id)}
                  />
                  <label htmlFor={`inactive-${client.id}`} className="flex items-center flex-1 cursor-pointer">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">Inativo há {client.lastAppointment.replace('há ', '')}</p>
                    </div>
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => sendMessage('inactive')}
                  >
                    Mensagem
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                disabled={getSelectedCount(inactiveClients) === 0}
                onClick={() => sendMessage('inactive', true)}
              >
                Enviar para selecionados ({getSelectedCount(inactiveClients)})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => sendCampaign('inactive')}
              >
                Enviar campanha para todos
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="new">
            <div className="bg-green-50 p-4 rounded-md mb-4">
              <p className="text-green-800">{newClients.length} novos clientes este mês!</p>
            </div>
            <div className="mb-4 space-y-2">
              {newClients.map((client) => (
                <div key={client.id} className="flex items-center p-2 rounded hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    id={`new-${client.id}`} 
                    className="mr-3"
                    checked={!!selectedClients[client.id]}
                    onChange={() => toggleClientSelection(client.id)}
                  />
                  <label htmlFor={`new-${client.id}`} className="flex items-center flex-1 cursor-pointer">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">Primeiro agendamento: {client.lastAppointment}</p>
                    </div>
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => sendMessage('new')}
                  >
                    Mensagem
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => sendCampaign('new')}
            >
              Enviar mensagem de boas-vindas
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
