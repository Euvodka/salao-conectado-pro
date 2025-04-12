
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Public pages
import LandingPage from "@/pages/LandingPage";

// Client pages
import ClientFeed from "@/pages/client/ClientFeed";
import ClientSaved from "@/pages/client/ClientSaved";
import ClientMessages from "@/pages/client/ClientMessages";
import ClientSearch from "@/pages/client/ClientSearch";
import ClientProfile from "@/pages/client/ClientProfile";

// Professional pages
import ProfessionalDashboard from "@/pages/professional/ProfessionalDashboard";
import ProfessionalCalendar from "@/pages/professional/ProfessionalCalendar";
import ProfessionalFeed from "@/pages/professional/ProfessionalFeed";
import ProfessionalMessages from "@/pages/professional/ProfessionalMessages";
import ServiceManagement from "@/pages/professional/ServiceManagement";
import ProfessionalProfile from "@/pages/professional/ProfessionalProfile";

// Common pages
import NotFound from "@/pages/NotFound";

// Skeleton components to make the app functional
// These will be replaced with actual implementations later
const ClientSavedPlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Posts Salvos</h1>
    <p>Aqui você encontrará seus posts salvos.</p>
  </div>
);

const ClientMessagesPlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Mensagens</h1>
    <p>Suas conversas com profissionais aparecerão aqui.</p>
  </div>
);

const ClientSearchPlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Pesquisar</h1>
    <p>Busque por profissionais e serviços.</p>
  </div>
);

const ClientProfilePlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
    <p>Gerencie suas informações pessoais.</p>
  </div>
);

const ProfessionalCalendarPlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Agenda</h1>
    <p>Gerencie seus agendamentos e horários disponíveis.</p>
  </div>
);

const ProfessionalFeedPlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Feed</h1>
    <p>Veja publicações de outros profissionais e faça suas próprias publicações.</p>
  </div>
);

const ProfessionalMessagesPlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Mensagens e Notificações</h1>
    <p>Acompanhe suas mensagens e solicitações de agendamento.</p>
  </div>
);

const ProfessionalProfilePlaceholder = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
    <p>Gerencie seu perfil profissional, publicações e reputação.</p>
  </div>
);

export default function AppRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While auth is loading, show nothing
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === "client" ? (
              <Navigate to="/client" replace />
            ) : (
              <Navigate to="/professional" replace />
            )
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Client routes */}
      <Route
        path="/client"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientFeed />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/saved"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientSavedPlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/messages"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientMessagesPlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/search"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientSearchPlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/profile"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientProfilePlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Professional routes */}
      <Route
        path="/professional"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/calendar"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalCalendarPlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/feed"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalFeedPlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/messages"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalMessagesPlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/services"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ServiceManagement />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/profile"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalProfilePlaceholder />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
