
import { useState } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { ServiceCard } from "@/components/feed/ServiceCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { Service } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Mock services data
const INITIAL_SERVICES: Service[] = [
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
  {
    id: "4",
    name: "Manicure Completa",
    description: "Cuidado completo para as unhas. Inclui lixamento, cutícula e esmaltação.",
    price: 60,
    duration: 60,
    image: "https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=1374&auto=format&fit=crop",
  },
];

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      image: "",
    });
    setCurrentService(null);
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      image: service.image || "",
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
    toast({
      title: "Serviço excluído",
      description: "O serviço foi removido com sucesso.",
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.description || !formData.price || !formData.duration) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create or update service
      if (isEditing && currentService) {
        // Update existing service
        const updatedService: Service = {
          ...currentService,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          image: formData.image || currentService.image,
        };
        
        setServices((prev) =>
          prev.map((service) =>
            service.id === currentService.id ? updatedService : service
          )
        );
        
        toast({
          title: "Serviço atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } else {
        // Create new service
        const newService: Service = {
          id: `service-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          image: formData.image || undefined,
        };
        
        setServices((prev) => [...prev, newService]);
        
        toast({
          title: "Serviço criado",
          description: "O novo serviço foi adicionado com sucesso.",
        });
      }
      
      // Reset form and close dialog
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o serviço.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-salon-800">Serviços</h1>
            <p className="text-muted-foreground">Gerencie os serviços oferecidos pelo seu salão</p>
          </div>
          <CustomDialog
            open={isOpen}
            onOpenChange={handleOpenChange}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Serviço
              </Button>
            }
            title={isEditing ? "Editar Serviço" : "Novo Serviço"}
            description="Preencha os detalhes do serviço que você oferece. Clique em salvar quando terminar."
            footer={
              <>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Salvando..." : "Criando..."}
                    </>
                  ) : (
                    isEditing ? "Salvar Alterações" : "Criar Serviço"
                  )}
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do serviço*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Corte Feminino"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva os detalhes do serviço"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (minutos)*</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="60"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">URL da imagem</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Adicione uma URL de imagem para mostrar seu serviço.
                </p>
              </div>
            </div>
          </CustomDialog>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos os Serviços</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="promoted">Em Promoção</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isProfessionalView={true}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
            {services.length === 0 && (
              <div className="text-center p-8 border rounded-md bg-white">
                <p className="text-muted-foreground mb-2">Nenhum serviço cadastrado</p>
                <Button onClick={() => setIsOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Serviço
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="active">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isProfessionalView={true}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="promoted">
            <div className="text-center p-8 border rounded-md bg-white">
              <p className="text-muted-foreground">Você ainda não tem serviços em promoção</p>
              <Button className="mt-4" variant="outline">
                Criar promoção
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
