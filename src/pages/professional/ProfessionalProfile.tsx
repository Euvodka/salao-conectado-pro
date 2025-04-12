
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/feed/ServiceCard";
import { PostCard } from "@/components/feed/PostCard";
import { Pencil, LogOut, Star, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Service, Post } from "@/types";

// Mock data
const services: Service[] = [
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
];

const posts: Post[] = [
  {
    id: "1",
    professionalId: "1",
    professionalName: "Salão Conectado Pro",
    professionalImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1469&auto=format&fit=crop",
    content: "Transformação completa! Corte + mechas + tratamento. Agende seu horário!",
    image: "https://images.unsplash.com/photo-1595163153849-537b3572145c?q=80&w=1470&auto=format&fit=crop",
    likes: 42,
    comments: 5,
    createdAt: "2023-04-10T14:48:00",
  },
  {
    id: "2",
    professionalId: "1",
    professionalName: "Salão Conectado Pro",
    professionalImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1469&auto=format&fit=crop",
    content: "Penteado para noivas e madrinhas! Preparada para o grande dia? 👰🏻‍♀️✨",
    image: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?q=80&w=1470&auto=format&fit=crop",
    likes: 87,
    comments: 12,
    createdAt: "2023-04-09T09:30:00",
  },
];

export default function ProfessionalProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <main className="container max-w-6xl mx-auto px-4 pt-6 pb-20">
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-salon-200 text-salon-700">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold text-salon-800">{user?.name}</h1>
                  <p className="text-muted-foreground">@{user?.username}</p>
                  <div className="flex items-center justify-center md:justify-start mt-2 gap-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground ml-1">(42 avaliações)</span>
                    </div>
                    <div>
                      <span className="font-medium">126</span> <span className="text-muted-foreground">seguidores</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="secondary">Cabelo</Badge>
                    <Badge variant="secondary">Maquiagem</Badge>
                    <Badge variant="secondary">Unhas</Badge>
                  </div>
                </div>
                <div className="md:text-right space-y-2">
                  <Button variant="outline" className="w-full md:w-auto">
                    <Pencil className="h-4 w-4 mr-2" /> Editar Perfil
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto hidden md:inline-flex" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" /> Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="posts">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="posts" className="flex-1">Publicações</TabsTrigger>
            <TabsTrigger value="services" className="flex-1">Serviços</TabsTrigger>
            <TabsTrigger value="reputation" className="flex-1">Reputação</TabsTrigger>
            <TabsTrigger value="biolink" className="flex-1">Link Bio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-0">
            <div className="flex justify-end mb-4">
              <Button>Nova Publicação</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} userRole="professional" />
              ))}
              {posts.length === 0 && (
                <div className="col-span-full text-center p-8 border rounded-md bg-white">
                  <p className="text-muted-foreground mb-2">Você ainda não tem publicações</p>
                  <Button>Criar primeira publicação</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="flex justify-end mb-4">
              <Button>Adicionar Serviço</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reputation" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações dos Clientes</CardTitle>
                <CardDescription>Veja o que seus clientes estão falando sobre você</CardDescription>
              </CardHeader>
              <CardContent>
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
                
                <Alert variant="default" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Importante</AlertTitle>
                  <AlertDescription>
                    Apenas clientes que concluíram um serviço com você podem deixar avaliações.
                  </AlertDescription>
                </Alert>
                
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
          
          <TabsContent value="biolink" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2 text-salon-600" />
                  Link para Bio
                </CardTitle>
                <CardDescription>
                  Gere um link personalizado para compartilhar em suas redes sociais e atrair mais clientes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-gray-50 mb-6">
                  <p className="text-sm mb-2">Seu link personalizado:</p>
                  <div className="flex items-center">
                    <code className="bg-white px-3 py-2 rounded border flex-1 text-salon-800">
                      https://salaoconectado.pro/@{user?.username}
                    </code>
                    <Button variant="outline" className="ml-2">Copiar</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Personalize seu link</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Escolha quais informações deseja exibir quando alguém acessar seu link.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center p-3 border rounded-md bg-white">
                        <input type="checkbox" id="showServices" className="mr-3" defaultChecked />
                        <label htmlFor="showServices" className="flex-1">Mostrar serviços</label>
                      </div>
                      <div className="flex items-center p-3 border rounded-md bg-white">
                        <input type="checkbox" id="showPosts" className="mr-3" defaultChecked />
                        <label htmlFor="showPosts" className="flex-1">Mostrar publicações recentes</label>
                      </div>
                      <div className="flex items-center p-3 border rounded-md bg-white">
                        <input type="checkbox" id="showContact" className="mr-3" defaultChecked />
                        <label htmlFor="showContact" className="flex-1">Mostrar informações de contato</label>
                      </div>
                      <div className="flex items-center p-3 border rounded-md bg-white">
                        <input type="checkbox" id="showScheduleButton" className="mr-3" defaultChecked />
                        <label htmlFor="showScheduleButton" className="flex-1">Mostrar botão de agendamento</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Salvar Configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 md:hidden">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </main>
    </div>
  );
}
