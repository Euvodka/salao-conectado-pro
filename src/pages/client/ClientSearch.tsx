
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientSearch() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-salon-800 mb-6">Pesquisar</h1>
        
        <div className="flex rounded-md mb-6">
          <Input placeholder="Buscar por profissionais ou serviços..." className="rounded-r-none" />
          <Button className="rounded-l-none">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs defaultValue="professionals">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="professionals" className="flex-1">Profissionais</TabsTrigger>
            <TabsTrigger value="nearby" className="flex-1">Próximos a mim</TabsTrigger>
            <TabsTrigger value="services" className="flex-1">Serviços</TabsTrigger>
          </TabsList>
          
          <TabsContent value="professionals" className="mt-0">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-muted-foreground">Use a barra de pesquisa acima para encontrar profissionais por nome.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="nearby" className="mt-0">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto text-salon-500 mb-4" />
              <p className="text-muted-foreground mb-4">Encontre profissionais próximos a você.</p>
              <Button>Permitir localização</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-muted-foreground">Use a barra de pesquisa acima para encontrar serviços específicos.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
