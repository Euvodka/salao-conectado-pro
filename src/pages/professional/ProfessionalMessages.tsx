
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Heart, MessageSquare } from "lucide-react";

export default function ProfessionalMessages() {
  // Sample notification data
  const notifications = [
    {
      id: "1",
      type: "booking",
      content: "Ana Silva solicitou um agendamento para Corte Feminino",
      time: "Há 2 horas",
      icon: Calendar,
      action: "Confirmar",
      user: {
        name: "Ana Silva",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop",
      },
    },
    {
      id: "2",
      type: "like",
      content: "João Pereira curtiu sua publicação",
      time: "Há 3 horas",
      icon: Heart,
      action: "Ver",
      user: {
        name: "João Pereira",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374&auto=format&fit=crop",
      },
    },
    {
      id: "3",
      type: "message",
      content: "Nova mensagem de Maria Oliveira",
      time: "Há 5 horas",
      icon: MessageSquare,
      action: "Responder",
      user: {
        name: "Maria Oliveira",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
      },
    },
  ];

  // Sample message data
  const messages = [
    {
      id: "1",
      user: {
        name: "Ana Silva",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop",
      },
      lastMessage: "Olá! Gostaria de saber se você tem horário disponível para amanhã?",
      time: "10:42",
      unread: true,
    },
    {
      id: "2",
      user: {
        name: "Rafael Santos",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
      },
      lastMessage: "O horário de quinta-feira ainda está disponível?",
      time: "Ontem",
      unread: false,
    },
    {
      id: "3",
      user: {
        name: "Juliana Martins",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1374&auto=format&fit=crop",
      },
      lastMessage: "Obrigada pelo atendimento! Ficou ótimo.",
      time: "21/03",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-salon-800">Mensagens e Notificações</h1>
          <p className="text-muted-foreground">Gerencie suas conversas e fique por dentro das atualizações</p>
        </div>
        
        <Tabs defaultValue="messages">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="messages" className="flex-1">
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">
              Notificações
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {notifications.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`p-3 rounded-md hover:bg-gray-100 cursor-pointer flex items-center ${
                        message.unread ? 'bg-salon-50' : ''
                      }`}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={message.user.image} alt={message.user.name} />
                        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium truncate ${message.unread ? 'text-salon-800' : ''}`}>
                            {message.user.name}
                          </p>
                          <span className={`text-xs ${message.unread ? 'text-salon-800' : 'text-muted-foreground'}`}>
                            {message.time}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${message.unread ? 'font-medium text-salon-800' : 'text-muted-foreground'}`}>
                          {message.lastMessage}
                        </p>
                      </div>
                      {message.unread && (
                        <div className="ml-2 bg-salon-500 h-2 w-2 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Notificações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start space-x-4 p-3 rounded-md border">
                      <div className={`
                        rounded-full p-2 flex-shrink-0
                        ${notification.type === 'booking' ? 'bg-blue-100 text-blue-600' : ''}
                        ${notification.type === 'like' ? 'bg-red-100 text-red-600' : ''}
                        ${notification.type === 'message' ? 'bg-green-100 text-green-600' : ''}
                      `}>
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={notification.user.image} alt={notification.user.name} />
                            <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{notification.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <Button size="sm" className="flex-shrink-0">
                        {notification.action}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver todas as notificações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
