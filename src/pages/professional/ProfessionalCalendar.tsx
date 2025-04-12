
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Clock } from "lucide-react";
import { useState } from "react";

export default function ProfessionalCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Sample appointments for the selected date
  const appointments = [
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
  ];

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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
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
                className="rounded-md"
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
                  {date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              
              <TabsContent value="day" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agendamentos do Dia</CardTitle>
                    <CardDescription>
                      Visualize e gerencie os agendamentos para {date?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
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
                                <Button size="sm" className="bg-salon-600">Confirmar</Button>
                              ) : (
                                <Button size="sm" variant="outline">Detalhes</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
