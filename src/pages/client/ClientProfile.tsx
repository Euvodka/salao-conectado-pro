
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ClientProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
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
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-salon-800">{user?.name}</h1>
                  <p className="text-muted-foreground">@{user?.username}</p>
                  <div className="flex items-center justify-center md:justify-start mt-2 gap-4">
                    <div>
                      <span className="font-medium">0</span> <span className="text-muted-foreground">seguindo</span>
                    </div>
                  </div>
                </div>
                <div className="ml-auto hidden md:block">
                  <Button variant="outline" className="flex gap-2" onClick={logout}>
                    <LogOut className="h-4 w-4" /> Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="info">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="info" className="flex-1">Informações</TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1">Agendamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Gerencie suas informações de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome completo</p>
                  <p>{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p>{user?.phone}</p>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Editar informações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Meus Agendamentos</CardTitle>
                <CardDescription>Veja seu histórico de agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">Você ainda não tem agendamentos.</p>
                  <p className="text-sm">Encontre profissionais e agende serviços para visualizá-los aqui.</p>
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
