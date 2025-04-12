
import { useState, useRef } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceCard } from "@/components/feed/ServiceCard";
import { PostCard } from "@/components/feed/PostCard";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Pencil, LogOut, Star, Link as LinkIcon, AlertCircle, Camera, Loader2, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: "Especialista em cortes e coloração há 8 anos.",
    email: "contato@salaoconectado.pro",
    phone: "(11) 99999-9999",
    categories: ["Cabelo", "Maquiagem", "Unhas"],
  });
  
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    image: ""
  });

  const [myPosts, setMyPosts] = useState<Post[]>(posts);

  const handleProfileUpdate = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditProfileOpen(false);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
    }, 1500);
  };
  
  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewProfileImage(event.target.result as string);
          
          toast({
            title: "Imagem atualizada",
            description: "Sua foto de perfil foi atualizada com sucesso!",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddService = () => {
    setIsSubmitting(true);
    
    // Validate required fields
    if (!newService.name || !newService.description || !newService.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const serviceToAdd: Service = {
        id: `service-${Date.now()}`,
        name: newService.name || "",
        description: newService.description || "",
        price: newService.price || 0,
        duration: newService.duration || 30,
        image: newService.image || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1470&auto=format&fit=crop"
      };
      
      // Add the new service to the list
      services.push(serviceToAdd);
      
      // Reset form
      setNewService({
        name: "",
        description: "",
        price: 0,
        duration: 30,
        image: ""
      });
      
      setIsSubmitting(false);
      setIsAddServiceOpen(false);
      
      toast({
        title: "Serviço adicionado",
        description: "Seu novo serviço foi adicionado com sucesso!",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <main className="container max-w-6xl mx-auto px-4 pt-6 pb-20">
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow cursor-pointer" onClick={handleProfileImageClick}>
                    <AvatarImage src={newProfileImage || user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="text-2xl bg-salon-200 text-salon-700">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={handleProfileImageClick}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl font-bold text-salon-800">{profileData.name}</h1>
                  <p className="text-muted-foreground">@{profileData.username}</p>
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
                    {profileData.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </div>
                <div className="md:text-right space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
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
              {myPosts.map(post => (
                <PostCard key={post.id} post={post} userRole="professional" />
              ))}
              {myPosts.length === 0 && (
                <div className="col-span-full text-center p-8 border rounded-md bg-white">
                  <p className="text-muted-foreground mb-2">Você ainda não tem publicações</p>
                  <Button>Criar primeira publicação</Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsAddServiceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
              {services.length === 0 && (
                <div className="col-span-full text-center p-8 border rounded-md bg-white">
                  <p className="text-muted-foreground mb-2">Você ainda não cadastrou nenhum serviço</p>
                  <Button onClick={() => setIsAddServiceOpen(true)}>Adicionar primeiro serviço</Button>
                </div>
              )}
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
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://salaoconectado.pro/@${user?.username}`);
                        toast({
                          title: "Link copiado",
                          description: "Link copiado para a área de transferência!"
                        });
                      }}
                    >
                      Copiar
                    </Button>
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
                  
                  <Button 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Configurações salvas",
                        description: "As configurações do seu link foram salvas com sucesso!"
                      });
                    }}
                  >
                    Salvar Configurações
                  </Button>
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

      {/* Edit Profile Dialog */}
      <CustomDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        title="Editar Perfil"
        description="Atualize suas informações de perfil para que seus clientes possam te conhecer melhor."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleProfileUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome*</Label>
            <Input 
              id="name" 
              value={profileData.name} 
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Seu nome completo" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Nome de usuário*</Label>
            <Input 
              id="username" 
              value={profileData.username} 
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="seu_usuario" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={profileData.bio} 
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Conte um pouco sobre você e sua experiência..." 
              rows={4} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="seu@email.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone*</Label>
              <Input 
                id="phone" 
                value={profileData.phone} 
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Categorias</Label>
            <div className="flex flex-wrap gap-2">
              {profileData.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {category}
                  <button 
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      const newCategories = [...profileData.categories];
                      newCategories.splice(index, 1);
                      setProfileData(prev => ({ ...prev, categories: newCategories }));
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <div className="flex items-center">
                <Input 
                  placeholder="Nova categoria" 
                  className="max-w-[150px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      setProfileData(prev => ({
                        ...prev,
                        categories: [...prev.categories, e.currentTarget.value.trim()]
                      }));
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CustomDialog>

      {/* Add Service Dialog */}
      <CustomDialog
        open={isAddServiceOpen}
        onOpenChange={setIsAddServiceOpen}
        title="Adicionar Serviço"
        description="Cadastre um novo serviço para oferecer aos seus clientes."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleAddService} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Adicionar"
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Nome do serviço*</Label>
            <Input 
              id="service-name" 
              value={newService.name || ''} 
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Corte Feminino" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service-description">Descrição*</Label>
            <Textarea 
              id="service-description" 
              value={newService.description || ''} 
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o serviço em detalhes..." 
              rows={3} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-price">Preço (R$)*</Label>
              <Input 
                id="service-price" 
                type="number" 
                value={newService.price || ''} 
                onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0,00" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-duration">Duração (min)*</Label>
              <Input 
                id="service-duration" 
                type="number" 
                value={newService.duration || ''} 
                onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="30" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service-image">URL da Imagem</Label>
            <Input 
              id="service-image" 
              value={newService.image || ''} 
              onChange={(e) => setNewService(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://exemplo.com/imagem.jpg" 
            />
          </div>
          
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6 text-center">
            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste e solte uma imagem ou clique para selecionar
            </p>
            <Button variant="outline" type="button" size="sm">
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
}
