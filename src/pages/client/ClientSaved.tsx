
import { useState } from "react";
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Bookmark, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Post, Service } from "@/types";

// Mock saved posts data
const SAVED_POSTS: Post[] = [
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
    id: "3",
    professionalId: "103",
    professionalName: "Nails Design",
    professionalImage: "https://images.unsplash.com/photo-1634283144126-a43aa004da84?q=80&w=1374&auto=format&fit=crop",
    content: "Unhas em gel com nail art exclusivo! Qual é o seu favorito? 💅",
    image: "https://images.unsplash.com/photo-1636018943957-6eb25813fde8?q=80&w=1470&auto=format&fit=crop",
    likes: 63,
    comments: 8,
    createdAt: "2023-04-08T16:15:00",
  },
];

// Mock saved services data
const SAVED_SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte Feminino",
    description: "Corte moderno com acabamento premium. Inclui lavagem e finalização.",
    price: 120,
    duration: 60,
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Manicure Completa",
    description: "Cuidado completo para as unhas. Inclui lixamento, cutícula e esmaltação.",
    price: 60,
    duration: 60,
    image: "https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=1374&auto=format&fit=crop",
  },
];

export default function ClientSaved() {
  const [savedPosts, setSavedPosts] = useState(SAVED_POSTS);
  const [savedServices, setSavedServices] = useState(SAVED_SERVICES);

  const handleUnsave = (id: string, type: 'post' | 'service') => {
    if (type === 'post') {
      setSavedPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    } else {
      setSavedServices(prevServices => prevServices.filter(service => service.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const formatDuration = (durationMinutes: number) => {
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}min`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-salon-800 mb-6">Salvos</h1>
        
        <Tabs defaultValue="posts">
          <TabsList className="w-full mb-6 grid grid-cols-2">
            <TabsTrigger value="posts">Posts Salvos</TabsTrigger>
            <TabsTrigger value="services">Serviços Salvos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            {savedPosts.length > 0 ? (
              <div className="space-y-6">
                {savedPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.professionalImage} alt={post.professionalName} />
                          <AvatarFallback>{post.professionalName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{post.professionalName}</h3>
                          <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                        </div>
                        <Button className="ml-auto" variant="ghost" size="sm">
                          Ver perfil
                        </Button>
                      </div>
                      
                      <div>
                        <p className="px-4 pb-3">{post.content}</p>
                        {post.image && (
                          <div className="aspect-video w-full overflow-hidden bg-gray-100">
                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex space-x-4">
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                        <button 
                          className="text-salon-600"
                          onClick={() => handleUnsave(post.id, 'post')}
                        >
                          <Bookmark className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não salvou nenhum post.</p>
                <p className="text-sm mb-4">Ao navegar pelo feed, clique no ícone de marcador para salvar posts que você gostou.</p>
                <Link to="/client">
                  <Button>Explorar feed</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            {savedServices.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {savedServices.map(service => (
                  <Card key={service.id} className="overflow-hidden">
                    {service.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">{service.name}</h3>
                        <button 
                          className="text-salon-600"
                          onClick={() => handleUnsave(service.id, 'service')}
                        >
                          <Bookmark className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" /> 
                          {formatDuration(service.duration)}
                        </div>
                        <div className="font-medium">
                          {formatPrice(service.price)}
                        </div>
                      </div>
                      <Button className="w-full">Agendar</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não salvou nenhum serviço.</p>
                <p className="text-sm mb-4">Ao visualizar perfis de profissionais, você pode salvar serviços para agendar mais tarde.</p>
                <Link to="/client/search">
                  <Button>Buscar profissionais</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
