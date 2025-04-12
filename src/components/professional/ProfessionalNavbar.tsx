
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bell, 
  Calendar, 
  Grid3X3, 
  Home, 
  LayoutDashboard, 
  MessageSquare, 
  Scissors, 
  Settings, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function ProfessionalNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/professional", icon: LayoutDashboard },
    { name: "Agenda", path: "/professional/calendar", icon: Calendar },
    { name: "Feed", path: "/professional/feed", icon: Home },
    { name: "Mensagens", path: "/professional/messages", icon: MessageSquare },
    { name: "Serviços", path: "/professional/services", icon: Scissors },
    { name: "Perfil", path: "/professional/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile navbar bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center py-2 px-1 ${
                isActive(item.path)
                  ? "text-salon-600"
                  : "text-gray-500 hover:text-salon-500"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop navbar top */}
      <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/professional" className="flex items-center">
              <h1 className="text-xl font-bold text-salon-700">Salão Conectado Pro</h1>
            </Link>
          </div>

          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md flex items-center space-x-1 ${
                  isActive(item.path)
                    ? "bg-salon-100 text-salon-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon size={18} />
                <span className="ml-1">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-0" aria-label="Menu do usuário">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="bg-salon-200 text-salon-700">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback className="bg-salon-200 text-salon-700">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">@{user?.username}</p>
                    </div>
                  </div>
                  <nav className="space-y-2">
                    <Link
                      to="/professional/profile"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Seu perfil
                    </Link>
                    <Link
                      to="/professional/settings"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Configurações
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={() => {
                        // Logout functionality will be implemented later
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sair
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
