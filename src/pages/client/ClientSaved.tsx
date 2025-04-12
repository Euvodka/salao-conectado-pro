
import { ClientNavbar } from "@/components/client/ClientNavbar";

export default function ClientSaved() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-salon-800 mb-6">Posts Salvos</h1>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-muted-foreground mb-4">Você ainda não salvou nenhum post.</p>
          <p className="text-sm">Ao navegar pelo feed, clique no ícone de marcador para salvar posts que você gostou.</p>
        </div>
      </main>
    </div>
  );
}
