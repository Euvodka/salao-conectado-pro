
import { useState } from "react";
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, User, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Mock data for professionals and services
const PROFESSIONALS = [
  {
    id: "1",
    name: "Salão Beleza Total",
    image: "https://images.unsplash.com/photo-1580618864194-0fb637e8f5da?q=80&w=1469&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 42,
    categories: ["Cabelo", "Maquiagem", "Unhas"],
    location: "São Paulo, SP",
  },
  {
    id: "2",
    name: "Studio Márcia Hair",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1374&auto=format&fit=crop",
    rating: 4.5,
    reviewCount: 28,
    categories: ["Cabelo", "Tratamentos"],
    location: "São Paulo, SP",
  },
  {
    id: "3",
    name: "Nails Design",
    image: "https://images.unsplash.com/photo-1634283144126-a43aa004da84?q=80&w=1374&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 63,
    categories: ["Unhas", "Podologia"],
    location: "Guarulhos, SP",
  },
];

const SERVICES = [
  {
    id: "1",
    name: "Corte Feminino",
    professionals: 15,
    priceRange: "R$ 90 - R$ 150",
  },
  {
    id: "2",
    name: "Coloração",
    professionals: 12,
    priceRange: "R$ 150 - R$ 300",
  },
  {
    id: "3",
    name: "Manicure",
    professionals: 22,
    priceRange: "R$ 40 - R$ 80",
  },
  {
    id: "4",
    name: "Pedicure",
    professionals: 18,
    priceRange: "R$ 50 - R$ 90",
  },
  {
    id: "5",
    name: "Tratamento Capilar",
    professionals: 9,
    priceRange: "R$ 100 - R$ 200",
  },
];

export default function ClientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filteredProfessionals, setFilteredProfessionals] = useState(PROFESSIONALS);
  const { toast } = useToast();

  const handleSearch = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredProfessionals(PROFESSIONALS);
      } else {
        const filtered = PROFESSIONALS.filter(
          pro => pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pro.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProfessionals(filtered);
      }
      setIsSearching(false);
      setShowResults(true);
    }, 500);
  };

  const handleLocationAccess = () => {
    toast({
      title: "Acesso à localização",
      description: "Solicitando acesso à sua localização atual...",
    });
    
    // Simulate geolocation API
    setTimeout(() => {
      toast({
        title: "Profissionais encontrados",
        description: "Encontramos 8 profissionais em um raio de 5km.",
      });
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-salon-800 mb-6">Pesquisar</h1>
        
        <div className="flex rounded-md mb-6">
          <Input 
            placeholder="Buscar por profissionais ou serviços..." 
            className="rounded-r-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button className="rounded-l-none" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="professionals">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="professionals" className="flex-1">Profissionais</TabsTrigger>
            <TabsTrigger value="nearby" className="flex-1">Próximos a mim</TabsTrigger>
            <TabsTrigger value="services" className="flex-1">Serviços</TabsTrigger>
          </TabsList>
          
          <TabsContent value="professionals" className="mt-0">
            {showResults ? (
              filteredProfessionals.length > 0 ? (
                <div className="space-y-4">
                  {filteredProfessionals.map(pro => (
                    <Card key={pro.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-32 h-32 sm:h-auto overflow-hidden bg-gray-100">
                            <img 
                              src={pro.image} 
                              alt={pro.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-medium">{pro.name}</h3>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-amber-500 mr-1 fill-current" />
                                <span className="text-sm">{pro.rating} ({pro.reviewCount})</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{pro.location}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {pro.categories.map(cat => (
                                <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                              ))}
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button size="sm">Ver perfil</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Nenhum profissional encontrado com esses termos.</p>
                    <p className="text-sm mb-4">Tente outros termos ou categorias de serviço.</p>
                    <Button onClick={() => setSearchTerm("")}>Limpar pesquisa</Button>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Use a barra de pesquisa acima para encontrar profissionais por nome ou tipo de serviço.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="nearby" className="mt-0">
            {showResults ? (
              <div className="space-y-4">
                <div className="mb-4 p-3 bg-salon-50 rounded-md flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sua localização atual</p>
                    <p className="text-xs text-muted-foreground">São Paulo, SP</p>
                  </div>
                  <Button size="sm" variant="outline">Alterar</Button>
                </div>
                
                {PROFESSIONALS.map(pro => (
                  <Card key={pro.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-32 h-32 sm:h-auto overflow-hidden bg-gray-100">
                          <img 
                            src={pro.image} 
                            alt={pro.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium">{pro.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-amber-500 mr-1 fill-current" />
                              <span className="text-sm">{pro.rating} ({pro.reviewCount})</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{pro.location}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {pro.categories.map(cat => (
                              <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">Distância: 2.4 km</span>
                            <Button size="sm">Ver perfil</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-salon-500 mb-4" />
                <p className="text-muted-foreground mb-4">Encontre profissionais próximos a você.</p>
                <Button onClick={handleLocationAccess}>Permitir localização</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            {showResults ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map(service => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground mb-3">
                        <span>{service.professionals} profissionais</span>
                        <span>{service.priceRange}</span>
                      </div>
                      <Button className="w-full">Ver profissionais</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-muted-foreground">Use a barra de pesquisa acima para encontrar serviços específicos.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
