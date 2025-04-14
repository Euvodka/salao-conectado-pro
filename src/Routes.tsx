
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
import ProfessionalClientView from "@/pages/professional/ProfessionalClientView";

// Common pages
import NotFound from "@/pages/NotFound";

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
            <ClientSaved />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/messages"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientMessages />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/search"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientSearch />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/client/profile"
        element={
          isAuthenticated && user?.role === "client" ? (
            <ClientProfile />
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
            <ProfessionalCalendar />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/feed"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalFeed />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/professional/messages"
        element={
          isAuthenticated && user?.role === "professional" ? (
            <ProfessionalMessages />
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
            <ProfessionalProfile />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      
      {/* Professional profile viewed by clients - public route with some restrictions */}
      <Route
        path="/professionals/:id"
        element={
          isAuthenticated ? (
            <ProfessionalClientView />
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
