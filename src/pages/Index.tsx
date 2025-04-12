
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, User } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-salon-50 to-salon-100">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-salon-800 sm:text-5xl md:text-6xl mb-4">
            Salão Conectado <span className="text-salon-600">Pro</span>
          </h1>
          <p className="text-xl text-salon-700 mb-8 max-w-2xl mx-auto">
            Conectando profissionais de beleza e clientes em uma plataforma completa para agendamento e promoção de serviços.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-salon-200 cursor-pointer"
              onClick={() => navigate("/?role=client")}
            >
              <div className="bg-salon-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="text-salon-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-salon-800 mb-2">Para Clientes</h3>
              <p className="text-salon-600 mb-4">
                Encontre os melhores profissionais, agende serviços e acompanhe novidades.
              </p>
              <Button className="w-full">Entrar como Cliente</Button>
            </div>
            
            <div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-salon-200 cursor-pointer"
              onClick={() => navigate("/?role=professional")}
            >
              <div className="bg-salon-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Scissors className="text-salon-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-salon-800 mb-2">Para Profissionais</h3>
              <p className="text-salon-600 mb-4">
                Gerencie seu negócio, promova seus serviços e conecte-se com clientes.
              </p>
              <Button className="w-full">Entrar como Profissional</Button>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-salon-600 font-medium mb-4">Powered by Lovable</p>
          </div>
        </div>
      </main>
    </div>
  );
}
