
import { useState } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Calendar, Heart, MessageSquare, Send, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProfessionalMessages() {
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  
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

  // Sample messages data
  const [conversations, setConversations] = useState([
    {
      id: "1",
      user: {
        name: "Ana Silva",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop",
      },
      messages: [
        { id: "1-1", text: "Olá! Gostaria de saber se você tem horário disponível para amanhã?", sender: "client", time: "10:42" },
        { id: "1-2", text: "Olá Ana! Sim, tenho disponibilidade às 14h ou 16h. Qual horário seria melhor para você?", sender: "professional", time: "10:45" },
      ],
      lastMessage: "Olá Ana! Sim, tenho disponibilidade às 14h ou 16h. Qual horário seria melhor para você?",
      time: "10:45",
      unread: true,
    },
    {
      id: "2",
      user: {
        name: "Rafael Santos",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
      },
      messages: [
        { id: "2-1", text: "O horário de quinta-feira ainda está disponível?", sender: "client", time: "Ontem" },
      ],
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
      messages: [
        { id: "3-1", text: "Obrigada pelo atendimento! Ficou ótimo.", sender: "client", time: "21/03" },
        { id: "3-2", text: "Ficou incrível mesmo! Obrigada pela confiança, Juliana!", sender: "professional", time: "21/03" },
      ],
      lastMessage: "Ficou incrível mesmo! Obrigada pela confiança, Juliana!",
      time: "21/03",
      unread: false,
    },
  ]);

  const handleNotificationAction = (notification: any) => {
    if (notification.type === "booking") {
      toast({
        title: "Agendamento confirmado",
        description: `Agendamento de ${notification.user.name} foi confirmado.`,
      });
    } else if (notification.type === "like") {
      toast({
        title: "Visualizando publicação",
        description: "Redirecionando para a publicação...",
      });
    } else if (notification.type === "message") {
      // Find the conversation with this user and open it
      const conversation = conversations.find(c => c.user.name === notification.user.name);
      if (conversation) {
        setActiveChat(conversation.id);
      }
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat) return;
    
    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === activeChat) {
        const newMessage = {
          id: `${conversation.id}-${conversation.messages.length + 1}`,
          text: messageText.trim(),
          sender: "professional",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        return {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastMessage: messageText.trim(),
          time: "Agora",
          unread: false,
        };
      }
      return conversation;
    });
    
    setConversations(updatedConversations);
    setMessageText("");
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso!",
    });
  };

  const getActiveChatData = () => {
    return conversations.find(conversation => conversation.id === activeChat);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Conversations list */}
              <div className="md:col-span-1">
                <Card className="h-[70vh] md:h-[calc(100vh-240px)] flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle>Conversas</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    <div className="space-y-1">
                      {conversations.map(conversation => (
                        <div 
                          key={conversation.id}
                          className={`p-3 rounded-md hover:bg-gray-100 cursor-pointer flex items-center ${
                            activeChat === conversation.id ? 'bg-salon-50 border-l-4 border-l-salon-500' : (conversation.unread ? 'bg-salon-50' : '')
                          }`}
                          onClick={() => setActiveChat(conversation.id)}
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={conversation.user.image} alt={conversation.user.name} />
                            <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium truncate ${conversation.unread ? 'text-salon-800' : ''}`}>
                                {conversation.user.name}
                              </p>
                              <span className={`text-xs ${conversation.unread ? 'text-salon-800' : 'text-muted-foreground'}`}>
                                {conversation.time}
                              </span>
                            </div>
                            <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-salon-800' : 'text-muted-foreground'}`}>
                              {conversation.lastMessage}
                            </p>
                          </div>
                          {conversation.unread && (
                            <div className="ml-2 bg-salon-500 h-2 w-2 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Active conversation */}
              <div className="md:col-span-2">
                <Card className="h-[70vh] md:h-[calc(100vh-240px)] flex flex-col">
                  {activeChat ? (
                    <>
                      <CardHeader className="pb-2 border-b flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage 
                                src={getActiveChatData()?.user.image} 
                                alt={getActiveChatData()?.user.name} 
                              />
                              <AvatarFallback>
                                {getActiveChatData()?.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{getActiveChatData()?.user.name}</CardTitle>
                              <p className="text-xs text-muted-foreground">Online agora</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setActiveChat(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
                        {getActiveChatData()?.messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender === 'professional' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                message.sender === 'professional' 
                                  ? 'bg-salon-500 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p>{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'professional' 
                                  ? 'text-salon-100' 
                                  : 'text-gray-500'
                              }`}>
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      
                      <div className="p-4 border-t flex">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && messageText.trim()) {
                              handleSendMessage();
                            }
                          }}
                          className="flex-1 mr-2"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Suas mensagens</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Selecione uma conversa para começar a responder ou agendar um serviço.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
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
                      <Button 
                        size="sm" 
                        className="flex-shrink-0"
                        onClick={() => handleNotificationAction(notification)}
                      >
                        {notification.action}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    toast({
                      title: "Notificações",
                      description: "Carregando todas as notificações...",
                    });
                  }}
                >
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
