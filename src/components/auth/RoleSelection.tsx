
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scissors, User } from 'lucide-react';
import { UserRole } from '@/types';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  onActionSelect: (action: 'login' | 'register') => void;
}

export function RoleSelection({ onRoleSelect, onActionSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-salon-800 mb-2">Salão Conectado Pro</h1>
        <p className="text-muted-foreground">Conectando profissionais e clientes</p>
      </div>

      <Card className="w-full max-w-md border-salon-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-salon-800">Bem-vindo(a)</CardTitle>
          <CardDescription>Selecione seu tipo de acesso abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="client" 
                onClick={() => handleRoleSelect('client')}
                className="data-[state=active]:bg-salon-500 data-[state=active]:text-white"
              >
                Cliente
              </TabsTrigger>
              <TabsTrigger 
                value="professional" 
                onClick={() => handleRoleSelect('professional')}
                className="data-[state=active]:bg-salon-500 data-[state=active]:text-white"
              >
                Profissional
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client" className="mt-6 space-y-4">
              <div className="flex flex-col items-center text-center p-4 border border-salon-100 rounded-lg">
                <div className="bg-salon-100 p-3 rounded-full mb-4">
                  <User className="w-8 h-8 text-salon-600" />
                </div>
                <h3 className="font-medium text-lg">Acesso como Cliente</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Encontre os melhores profissionais, agende serviços e acompanhe as novidades.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="professional" className="mt-6 space-y-4">
              <div className="flex flex-col items-center text-center p-4 border border-salon-100 rounded-lg">
                <div className="bg-salon-100 p-3 rounded-full mb-4">
                  <Scissors className="w-8 h-8 text-salon-600" />
                </div>
                <h3 className="font-medium text-lg">Acesso como Profissional</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Gerencie sua agenda, promova seus serviços e conecte-se com novos clientes.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full bg-salon-600 hover:bg-salon-700 text-white" 
            disabled={!selectedRole}
            onClick={() => onActionSelect('login')}
          >
            Acessar Conta
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-salon-500 text-salon-600 hover:bg-salon-50"
            disabled={!selectedRole}
            onClick={() => onActionSelect('register')}
          >
            Novo Cadastro
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
