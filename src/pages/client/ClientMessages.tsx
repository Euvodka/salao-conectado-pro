
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Send, 
  Calendar, 
  Clock, 
  ChevronRight,
  Check
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock conversation data
const CONVERSATIONS = [
  {
    id: "1",
    professional: {
      id: "101",
      name: "Salão Beleza Total",
      image: "https://images.unsplash.com/photo-1580618864194-0fb637e8f5da?q=80&w=1469&auto=format&fit=crop",
    },
    lastMessage: "Olá! Temos horário disponível na quinta-feira às 14h.",
    time: "10:42",
    unread: true,
  },
  {
    id: "2",
    professional: {
      id: "102",
      name: "Studio Márcia Hair",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1374&auto=format&fit=crop",
    },
    lastMessage: "Seu agendamento foi confirmado. Aguardamos você!",
    time: "Ontem",
    unread: false,
  },
];

// Mock messages for a conversation
const MESSAGES = [
  {
    id: "m1",
    senderId: "user",
    text: "Olá, gostaria de saber se tem horário disponível para quinta-feira à tarde?",
    time: "10:30",
  },
  {
    id: "m2",
    senderId: "101",
    text: "Olá! Temos horário disponível na quinta-feira às 14h.",
    time: "10:42",
  },
];

// Mock services
const SERVICES = [
  { id: "s1", name: "Corte Feminino", duration: 60, price: 120 },
  { id: "s2", name: "Coloração", duration: 120, price: 200 },
  { id: "s3", name: "Hidratação", duration: 45, price: 80 },
];

// Mock available times
const AVAILABLE_TIMES = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

export default function ClientMessages() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeMessages, setActiveMessages] = useState(MESSAGES);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `m${activeMessages.length + 1}`,
      senderId: "user",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setActiveMessages([...activeMessages, message]);
    setNewMessage("");
    
    // Simulate response after a delay
    setTimeout(() => {
      const response = {
        id: `m${activeMessages.length + 2}`,
        senderId: "101",
        text: "Perfeito! Vou reservar esse horário para você. Poderia confirmar seu nome completo?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActiveMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleViewProfile = () => {
    const professionalId = CONVERSATIONS.find(c => c.id === selectedConversation)?.professional.id;
    if (professionalId) {
      navigate(`/professionals/${professionalId}`);
    }
  };

  const handleBookAppointment = () => {
    if (selectedService && bookingDate && bookingTime) {
      const service = SERVICES.find(s => s.id === selectedService);
      
      // Add message to chat about the appointment request
      const bookingMessage = {
        id: `m${activeMessages.length + 1}`,
        senderId: "user",
        text: `Gostaria de agendar um horário para ${service?.name} no dia ${formatDate(bookingDate)} às ${bookingTime}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setActiveMessages([...activeMessages, bookingMessage]);
      
      // Simulate response after a delay
      setTimeout(() => {
        const response = {
          id: `m${activeMessages.length + 2}`,
          senderId: "101",
          text: `Agendamento confirmado! Esperamos você no dia ${formatDate(bookingDate)} às ${bookingTime} para ${service?.name}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setActiveMessages(prev => [...prev, response]);
      }, 1500);
      
      toast({
        title: "Agendamento enviado!",
        description: "O profissional confirmou seu horário.",
      });
      
      setIsBookingOpen(false);
      // Reset form
      setBookingDate(null);
      setBookingTime(null);
      setSelectedService(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Filter conversations based on search term
  const filteredConversations = CONVERSATIONS.filter(convo => 
    convo.professional.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render booking button in message
  const renderBookingButton = () => {
    return (
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogTrigger asChild>
          <Button 
            className="mt-4 bg-salon-500 hover:bg-salon-600" 
            leftIcon={<Calendar className="mr-2 h-4 w-4" />}
          >
            Agendar Horário
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar Horário</DialogTitle>
            <DialogDescription>
              Selecione o serviço, data e horário desejados para seu agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="service" className="text-sm font-medium">
                Serviço
              </label>
              <Select onValueChange={setSelectedService} value={selectedService || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Data
              </label>
              <Input 
                id="date" 
                type="date" 
                value={bookingDate || ''} 
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">
                Horário
              </label>
              <Select onValueChange={setBookingTime} value={bookingTime || undefined} disabled={!bookingDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_TIMES.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleBookAppointment}
              disabled={!selectedService || !bookingDate || !bookingTime}
              className="bg-salon-500 hover:bg-salon-600"
            >
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-5xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-salon-800 mb-6">Mensagens</h1>
        
        {filteredConversations.length > 0 || selectedConversation ? (
          <div className="grid md:grid-cols-3 gap-4 h-[70vh]">
            {/* Conversations list */}
            <Card className={`md:col-span-1 overflow-hidden ${selectedConversation ? 'hidden md:block' : ''}`}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Buscar conversa..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-auto">
                <div className="space-y-1">
                  {filteredConversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-gray-100 ${
                        conversation.id === selectedConversation ? 'bg-salon-50' : ''
                      } ${conversation.unread ? 'bg-salon-50/50' : ''}`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={conversation.professional.image} alt={conversation.professional.name} />
                          <AvatarFallback>{conversation.professional.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">{conversation.professional.name}</h3>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <p className="truncate text-sm text-muted-foreground">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <Badge variant="default" className="bg-salon-500 h-2 w-2 rounded-full p-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Message thread */}
            {selectedConversation ? (
              <Card className="md:col-span-2 flex flex-col h-full overflow-hidden">
                <CardHeader className="p-4 border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </Button>
                      <Avatar>
                        <AvatarImage 
                          src={filteredConversations.find(c => c.id === selectedConversation)?.professional.image} 
                          alt="Professional" 
                        />
                        <AvatarFallback>SP</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {filteredConversations.find(c => c.id === selectedConversation)?.professional.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Online</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewProfile}
                      className="gap-1"
                    >
                      Ver perfil
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeMessages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] rounded-lg p-3 ${
                          message.senderId === 'user' 
                            ? 'bg-salon-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'user' ? 'text-salon-100' : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {renderBookingButton()}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Digite sua mensagem..." 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="md:col-span-2 hidden md:flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">Selecione uma conversa para visualizar as mensagens.</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não tem mensagens.</p>
            <p className="text-sm">Visite o perfil de um profissional e clique em "Mandar mensagem" para iniciar uma conversa.</p>
          </div>
        )}
      </main>
    </div>
  );
}
