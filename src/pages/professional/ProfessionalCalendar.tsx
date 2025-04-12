
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Plus, Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProfessionalCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    service: "",
    date: new Date(),
    time: "09:00",
    notes: "",
  });

  // Sample appointments for the selected date
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      time: "09:00",
      client: "Ana Silva",
      service: "Corte e Escova",
      status: "confirmed",
    },
    {
      id: "2",
      time: "11:30",
      client: "Carlos Mendes",
      service: "Barba",
      status: "confirmed",
    },
    {
      id: "3",
      time: "14:00",
      client: "Mariana Ferreira",
      service: "Coloração",
      status: "pending",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewAppointment(prev => ({
        ...prev,
        date: date,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!newAppointment.clientName || !newAppointment.service || !newAppointment.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the new appointment
      const newAppointmentObj = {
        id: `app-${Date.now()}`,
        time: newAppointment.time,
        client: newAppointment.clientName,
        service: newAppointment.service,
        status: "confirmed",
      };
      
      setAppointments(prev => [...prev, newAppointmentObj]);
      
      // Reset form and close dialog
      setNewAppointment({
        clientName: "",
        service: "",
        date: new Date(),
        time: "09:00",
        notes: "",
      });
      
      setIsDialogOpen(false);
      
      toast({
        title: "Agendamento criado!",
        description: "O novo agendamento foi adicionado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento. Tente novamente.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAppointment = (id: string) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id
          ? { ...appointment, status: "confirmed" }
          : appointment
      )
    );
    
    toast({
      title: "Agendamento confirmado",
      description: "O cliente será notificado da confirmação.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-salon-800">Agenda</h1>
            <p className="text-muted-foreground">Gerencie seus agendamentos e horários disponíveis</p>
          </div>
          <div className="mt-4 md:mt-0">
            <CustomDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              }
              title="Novo Agendamento"
              description="Preencha os detalhes para criar um novo agendamento"
              footer={
                <>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar Agendamento"
                    )}
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do Cliente*</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={newAppointment.clientName}
                    onChange={handleInputChange}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Serviço*</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("service", value)}
                    value={newAppointment.service}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corte Feminino">Corte Feminino</SelectItem>
                      <SelectItem value="Corte Masculino">Corte Masculino</SelectItem>
                      <SelectItem value="Coloração">Coloração</SelectItem>
                      <SelectItem value="Hidratação">Hidratação</SelectItem>
                      <SelectItem value="Manicure">Manicure</SelectItem>
                      <SelectItem value="Pedicure">Pedicure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data*</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={handleDateChange}
                        className="rounded-md pointer-events-auto"
                        locale={ptBR}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário*</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("time", value)}
                      value={newAppointment.time}
                    >
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                        <SelectItem value="13:00">13:00</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais sobre o agendamento"
                    rows={3}
                  />
                </div>
              </div>
            </CustomDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar sidebar */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md pointer-events-auto"
                locale={ptBR}
              />
            </CardContent>
          </Card>
          
          {/* Appointments for selected date */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="day">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="day">Dia</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                </TabsList>
                <div className="font-medium">
                  {date && format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              
              <TabsContent value="day" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agendamentos do Dia</CardTitle>
                    <CardDescription>
                      Visualize e gerencie os agendamentos para {date && format(date, "d 'de' MMMM", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div 
                          key={appointment.id}
                          className={`p-4 rounded-md border ${
                            appointment.status === 'pending' 
                              ? 'border-amber-200 bg-amber-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-salon-100 rounded-full p-2">
                                <Clock className="h-5 w-5 text-salon-600" />
                              </div>
                              <div>
                                <p className="font-medium">{appointment.time} - {appointment.client}</p>
                                <p className="text-sm text-muted-foreground">{appointment.service}</p>
                              </div>
                            </div>
                            <div>
                              {appointment.status === 'pending' ? (
                                <Button 
                                  size="sm" 
                                  className="bg-salon-600"
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                >
                                  Confirmar
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline">Detalhes</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {appointments.length === 0 && (
                        <div className="text-center py-8">
                          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                          <p className="mt-2 text-muted-foreground">Não há agendamentos para esta data</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            Criar Agendamento
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="week" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Visualização semanal em desenvolvimento</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="month" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Visualização mensal em desenvolvimento</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
