
import { useState } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/feed/PostCard";
import { ServiceCard } from "@/components/feed/ServiceCard";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Star, MessageSquare, Calendar as CalendarIcon, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Post, Service } from "@/types";

// Mock posts data
const POSTS: Post[] = [
  {
    id: "1",
    professionalId: "101",
    professionalName: "Salão Beleza Total",
    professionalImage: "https://images.unsplash.com/photo-1580618864194-0fb637e8f5da?q=80&w=1469&auto=format&fit=crop",
    content: "Transformação completa! Corte + mechas + tratamento. Agende seu horário!",
    image: "https://images.unsplash.com/photo-1595163153849-537b3572145c?q=80&w=1470&auto=format&fit=crop",
    likes: 42,
    comments: 5,
    createdAt: "2023-04-10T14:48:00",
  },
  {
    id: "2",
    professionalId: "101",
    professionalName: "Salão Beleza Total",
    professionalImage: "https://images.unsplash.com/photo-1580618864194-0fb637e8f5da?q=80&w=1469&auto=format&fit=crop",
    content: "Penteado para noivas e madrinhas! Preparada para o grande dia? 👰🏻‍♀️✨",
    image: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?q=80&w=1470&auto=format&fit=crop",
    likes: 87,
    comments: 12,
    createdAt: "2023-04-09T09:30:00",
  },
];

// Mock services data
const SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte Feminino",
    description: "Corte moderno com acabamento premium. Inclui lavagem e finalização.",
    price: 120,
    duration: 60,
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Coloração",
    description: "Coloração completa com produtos de alta qualidade. Resultado duradouro.",
    price: 180,
    duration: 120,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1472&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Tratamento Capilar",
    description: "Hidratação profunda para cabelos danificados. Recupere o brilho e a saúde dos fios.",
    price: 90,
    duration: 45,
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?q=80&w=1528&auto=format&fit=crop",
  },
];

export default function ProfessionalClientView() {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  // Booking state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Deixou de seguir" : "Seguindo",
      description: isFollowing 
        ? "Você deixou de seguir Salão Beleza Total" 
        : "Você começou a seguir Salão Beleza Total",
    });
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    });
    
    setMessage("");
    setMessageDialogOpen(false);
  };
  
  const handleRequestBooking = () => {
    if (!date || !selectedService) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, selecione uma data e um serviço.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Agendamento solicitado",
      description: `Sua solicitação de agendamento para ${format(date, 'dd/MM/yyyy', { locale: ptBR })} foi enviada.`,
    });
    
    setDate(undefined);
    setSelectedService(undefined);
    setNotes("");
    setBookingDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        {/* Professional header/banner */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 md:h-48 bg-gradient-to-r from-salon-500 to-salon-600"></div>
          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white absolute md:relative -top-12 md:top-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0">
                <AvatarImage src="https://images.unsplash.com/photo-1580618864194-0fb637e8f5da?q=80&w=1469&auto=format&fit=crop" alt="Salão Beleza Total" />
                <AvatarFallback className="text-2xl bg-salon-200 text-salon-700">SB</AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left mt-12 md:mt-0 flex-1">
                <h1 className="text-2xl font-bold text-salon-800">Salão Beleza Total</h1>
                <p className="text-muted-foreground">@belezatotal</p>
                
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <Badge variant="secondary">Cabelo</Badge>
                  <Badge variant="secondary">Maquiagem</Badge>
                  <Badge variant="secondary">Unhas</Badge>
                </div>
                
                <div className="flex items-center justify-center md:justify-start mt-2 space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1 fill-current" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground ml-1">(42 avaliações)</span>
                  </div>
                  <div>
                    <span className="font-medium">356</span>
                    <span className="text-muted-foreground ml-1">seguidores</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" /> São Paulo, SP
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing ? "bg-white" : ""}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </Button>
                <CustomDialog
                  open={messageDialogOpen}
                  onOpenChange={setMessageDialogOpen}
                  trigger={<Button variant="outline">Mensagem</Button>}
                  title="Enviar mensagem"
                  description="Envie uma mensagem para Salão Beleza Total"
                  footer={
                    <>
                      <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSendMessage}>Enviar</Button>
                    </>
                  }
                >
                  <div className="space-y-4">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      rows={5}
                    />
                  </div>
                </CustomDialog>
                <CustomDialog
                  open={bookingDialogOpen}
                  onOpenChange={setBookingDialogOpen}
                  trigger={<Button>Agendar</Button>}
                  title="Solicitar agendamento"
                  description="Escolha um serviço e uma data para agendar"
                  footer={
                    <>
                      <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleRequestBooking}>Solicitar</Button>
                    </>
                  }
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Serviço</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                      >
                        <option value="">Selecione um serviço</option>
                        {SERVICES.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data</label>
                      <div className="border rounded-md p-3">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                          className="mx-auto"
                          locale={ptBR}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Observações</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Alguma observação especial para seu agendamento?"
                        rows={3}
                      />
                    </div>
                  </div>
                </CustomDialog>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for content */}
        <Tabs defaultValue="about">
          <TabsList className="w-full mb-6 grid grid-cols-4">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-0">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Sobre nós</h3>
                  <p className="text-gray-600">
                    O Salão Beleza Total é um espaço dedicado à beleza e ao bem-estar, oferecendo serviços completos para cabelo, 
                    maquiagem e unhas. Com mais de 10 anos de experiência, nosso time de profissionais qualificados está 
                    comprometido em proporcionar uma experiência única aos nossos clientes.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 text-salon-600 mb-2" />
                    <h4 className="font-medium">Equipe</h4>
                    <p className="text-sm text-muted-foreground text-center">8 profissionais especializados</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-8 w-8 text-salon-600 mb-2" />
                    <h4 className="font-medium">Horário de funcionamento</h4>
                    <p className="text-sm text-muted-foreground text-center">Seg-Sáb: 9h às 19h</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-8 w-8 text-salon-600 mb-2" />
                    <h4 className="font-medium">Localização</h4>
                    <p className="text-sm text-muted-foreground text-center">Av. Paulista, 1000 - São Paulo</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Contato</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">Telefone: (11) 98765-4321</p>
                    <p className="text-gray-600">Email: contato@salaobelezatotal.com.br</p>
                    <p className="text-gray-600">Instagram: @salaobelezatotal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {POSTS.map(post => (
                <PostCard key={post.id} post={post} userRole="client" />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-salon-800">4.8</div>
                    <div className="flex text-amber-500 justify-center my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">42 avaliações</p>
                  </div>
                  
                  <div className="flex-1 max-w-xs mx-8">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center mb-1">
                        <span className="text-sm min-w-10">{rating} {rating === 1 ? 'estrela' : 'estrelas'}</span>
                        <div className="h-2 bg-gray-200 flex-1 rounded-full overflow-hidden mx-2">
                          <div 
                            className="h-full bg-amber-500 rounded-full" 
                            style={{ 
                              width: `${rating === 5 ? 70 : rating === 4 ? 25 : rating === 3 ? 5 : 0}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm min-w-10 text-right">
                          {rating === 5 ? 70 : rating === 4 ? 25 : rating === 3 ? 5 : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Satisfação do cliente</p>
                    <div className="text-2xl font-bold text-green-600">98%</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>
                            {String.fromCharCode(65 + i)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Cliente {i + 1}</p>
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`h-3 w-3 ${j < 5 - i * 0.5 ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground ml-auto">
                          há {2 + i} {i === 0 ? 'dia' : 'dias'}
                        </p>
                      </div>
                      <p className="text-sm">
                        {i === 0 ? (
                          "Excelente profissional! Amei o resultado do meu cabelo, super recomendo!"
                        ) : i === 1 ? (
                          "Atendimento muito bom e pontual. O serviço ficou ótimo."
                        ) : (
                          "Bom trabalho, mas o horário atrasou um pouco. No geral, fiquei satisfeita."
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
