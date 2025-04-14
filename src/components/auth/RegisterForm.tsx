
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface RegisterFormProps {
  role: UserRole;
  onBack: () => void;
}

export function RegisterForm({ role, onBack }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    cpf: "",
    cnpj: "",
    zipCode: "",
    street: "",
    number: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não correspondem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }
    
    const requiredFields = role === 'client'
      ? ['name', 'email', 'phone', 'username', 'cpf', 'password']
      : ['name', 'email', 'phone', 'username', 'zipCode', 'street', 'number', 'city', 'state', 'password'];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        role,
        ...(role === 'client' ? { cpf: formData.cpf } : { 
          cnpj: formData.cnpj || formData.cpf,
          address: {
            street: formData.street,
            number: formData.number,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          }
        }),
      };
      
      await register(userData, formData.password);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua conta foi criada. Bem-vindo(a)!",
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Houve um problema ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-salon-200 shadow-lg animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-salon-800">Novo Cadastro</CardTitle>
        <CardDescription>
          {role === "client"
            ? "Crie sua conta como cliente"
            : "Crie sua conta como profissional"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo*</Label>
            <Input
              id="name"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail*</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone*</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="(11) 98765-4321"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nome de usuário*</Label>
            <Input
              id="username"
              name="username"
              placeholder="seu.usuario"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {role === "client" ? (
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF*</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="123.456.789-00"
                value={formData.cpf}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ ou CPF*</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="12.345.678/0001-90 ou CPF"
                  value={formData.cnpj}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP*</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="12345-678"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Rua*</Label>
                <Input
                  id="street"
                  name="street"
                  placeholder="Nome da rua"
                  value={formData.street}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número*</Label>
                  <Input
                    id="number"
                    name="number"
                    placeholder="123"
                    value={formData.number}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade*</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Sua cidade"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado*</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Estado"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Senha*</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha*</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            type="submit"
            className="w-full bg-salon-600 hover:bg-salon-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full border-salon-500 text-salon-600 hover:bg-salon-50"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
