
import { ClientNavbar } from "@/components/client/ClientNavbar";

export default function ClientMessages() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-salon-800 mb-6">Mensagens</h1>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-muted-foreground mb-4">Você ainda não tem mensagens.</p>
          <p className="text-sm">Visite o perfil de um profissional e clique em "Mandar mensagem" para iniciar uma conversa.</p>
        </div>
      </main>
    </div>
  );
}
