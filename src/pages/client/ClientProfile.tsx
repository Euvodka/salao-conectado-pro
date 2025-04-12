
import { useState, useRef } from "react";
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  LogOut, 
  Calendar,
  CheckCircle,
  X,
  Clock,
  MapPin
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock appointments data
const MOCK_APPOINTMENTS = [
  {
    id: "1",
    professionalId: "101",
    professionalName: "Salão Beleza Total",
    service: "Corte Feminino",
    date: "2025-04-25T14:00:00",
    status: "confirmed" as const,
    price: 120,
  },
  {
    id: "2",
    professionalId: "102",
    professionalName: "Studio Márcia Hair",
    service: "Manicure",
    date: "2025-04-30T10:00:00",
    status: "pending" as const,
    price: 60,
  }
];

export default function ClientProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        toast({
          title: "Imagem atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const saveName = () => {
    setIsEditingName(false);
    toast({
      title: "Nome atualizado",
      description: "Seu nome foi atualizado com sucesso"
    });
  };

  const saveInfo = () => {
    setIsEditingInfo(false);
    toast({
      title: "Informações atualizadas",
      description: "Suas informações foram atualizadas com sucesso"
    });
  };

  const cancelAppointment = (id: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id 
        ? { ...appointment, status: 'cancelled' as const } 
        : appointment
    ));
    toast({
      title: "Agendamento cancelado",
      description: "Seu agendamento foi cancelado com sucesso"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Avatar className="w-24 h-24 border-4 border-white shadow">
                    <AvatarImage src={profileImage} alt={name} />
                    <AvatarFallback className="text-2xl bg-salon-200 text-salon-700">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={triggerFileInput}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center md:text-left">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-xl font-bold max-w-[200px]"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={saveName}>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setIsEditingName(false)}>
                        <X className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold text-salon-800">{name}</h1>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setIsEditingName(true)}
                        className="ml-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Gerencie suas informações de perfil</CardDescription>
                  </div>
                  {!isEditingInfo ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingInfo(true)}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={saveInfo}
                        className="flex items-center gap-2 text-green-600 border-green-600"
                      >
                        <CheckCircle className="h-4 w-4" /> Salvar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingInfo(false)}
                        className="flex items-center gap-2 text-red-600 border-red-600"
                      >
                        <X className="h-4 w-4" /> Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nome completo</Label>
                  {isEditingInfo ? (
                    <Input 
                      id="fullName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p>{name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  {isEditingInfo ? (
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p>{email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditingInfo ? (
                    <Input 
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p>{phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Meus Agendamentos</CardTitle>
                <CardDescription>Visualize e gerencie seus agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between flex-col sm:flex-row gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <h3 className="font-bold text-lg">{appointment.service}</h3>
                                <div className="ml-2">{getStatusBadge(appointment.status)}</div>
                              </div>
                              <p className="text-muted-foreground">{appointment.professionalName}</p>
                              <div className="flex items-center gap-5">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-1 text-salon-600" /> 
                                  {formatDate(appointment.date)}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-salon-600" /> 
                                  {formatTime(appointment.date)}
                                </div>
                              </div>
                              <div className="font-medium">
                                {formatPrice(appointment.price)}
                              </div>
                            </div>
                            
                            <div className="flex flex-row sm:flex-col justify-between gap-2">
                              <Button 
                                variant="default" 
                                className="w-full"
                                onClick={() => navigate(`/professionals/${appointment.professionalId}`)}
                              >
                                Ver profissional
                              </Button>
                              {appointment.status !== 'cancelled' && (
                                <Button 
                                  variant="outline" 
                                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => cancelAppointment(appointment.id)}
                                >
                                  Cancelar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">Você ainda não tem agendamentos.</p>
                    <p className="text-sm">Encontre profissionais e agende serviços para visualizá-los aqui.</p>
                  </div>
                )}
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
