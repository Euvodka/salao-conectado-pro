
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";
import { Service } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface ServiceCardProps {
  service: Service;
  isProfessionalView?: boolean;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
}

export function ServiceCard({ 
  service, 
  isProfessionalView = false,
  onEdit,
  onDelete
}: ServiceCardProps) {
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDuration = (durationMinutes: number) => {
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}min`;
  };

  const handleBooking = () => {
    toast({
      title: "Solicitação enviada!",
      description: "Aguarde a confirmação do profissional.",
    });
  };

  return (
    <Card 
      className={`overflow-hidden transition-all ${
        isProfessionalView ? 'hover:shadow-md' : ''
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {service.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={service.image} 
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out" 
          />
        </div>
      )}
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-bold text-salon-800">{service.name}</CardTitle>
        <CardDescription className="flex items-center mt-1 text-muted-foreground">
          <Clock size={16} className="mr-1" /> {formatDuration(service.duration)}
          <span className="mx-2">•</span>
          <DollarSign size={16} className="mr-1" /> {formatPrice(service.price)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600">{service.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {isProfessionalView ? (
          <div className="flex space-x-2 w-full justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit && onEdit(service)}
            >
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete && onDelete(service.id)}
            >
              Excluir
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full bg-salon-600 hover:bg-salon-700"
            onClick={handleBooking}
          >
            Agendar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
