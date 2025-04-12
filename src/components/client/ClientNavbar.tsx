
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ClientNavbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Agendamento confirmado",
      content: "Seu horário para Corte Feminino foi confirmado",
      time: "Há 2 horas",
      read: false
    },
    {
      id: 2,
      title: "Novo post",
      content: "Salão Beleza Total publicou um novo post",
      time: "Há 5 horas",
      read: false
    },
    {
      id: 3,
      title: "Promoção",
      content: "Aproveite 20% de desconto em serviços de coloração",
      time: "Ontem",
      read: true
    }
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full md:relative bg-white border-t md:border-b shadow-sm">
      <div className="container max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/client" className="hidden md:block text-xl font-bold text-salon-700">
          BeautySalon
        </Link>
        
        <div className="flex-1 md:flex-initial w-full md:w-auto">
          <div className="flex md:hidden items-center justify-between w-full">
            <Link
              to="/client"
              className={`flex flex-col items-center px-4 py-2 ${
                location.pathname === '/client' ? 'text-salon-600' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-xs mt-1">Feed</span>
            </Link>
            
            <Link
              to="/client/search"
              className={`flex flex-col items-center px-4 py-2 ${
                location.pathname === '/client/search' ? 'text-salon-600' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="text-xs mt-1">Buscar</span>
            </Link>
            
            <Link
              to="/client/saved"
              className={`flex flex-col items-center px-4 py-2 ${
                location.pathname === '/client/saved' ? 'text-salon-600' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              <span className="text-xs mt-1">Salvos</span>
            </Link>
            
            <Link
              to="/client/messages"
              className={`flex flex-col items-center px-4 py-2 ${
                location.pathname === '/client/messages' ? 'text-salon-600' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-xs mt-1">Mensagens</span>
            </Link>
            
            <Link
              to="/client/profile"
              className={`flex flex-col items-center px-4 py-2 ${
                location.pathname === '/client/profile' ? 'text-salon-600' : 'text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs mt-1">Perfil</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/client"
              className={`px-2 py-1 font-medium ${
                location.pathname === '/client' ? 'text-salon-600' : 'text-gray-600 hover:text-salon-600'
              }`}
            >
              Feed
            </Link>
            <Link
              to="/client/search"
              className={`px-2 py-1 font-medium ${
                location.pathname === '/client/search' ? 'text-salon-600' : 'text-gray-600 hover:text-salon-600'
              }`}
            >
              Buscar
            </Link>
            <Link
              to="/client/saved"
              className={`px-2 py-1 font-medium ${
                location.pathname === '/client/saved' ? 'text-salon-600' : 'text-gray-600 hover:text-salon-600'
              }`}
            >
              Salvos
            </Link>
            <Link
              to="/client/messages"
              className={`px-2 py-1 font-medium ${
                location.pathname === '/client/messages' ? 'text-salon-600' : 'text-gray-600 hover:text-salon-600'
              }`}
            >
              Mensagens
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">Notificações</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              <div className="max-h-96 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b hover:bg-gray-50 ${!notification.read ? 'bg-salon-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-salon-500"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Você não tem notificações
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Link to="/client/profile" className="flex items-center">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={user?.profileImage} alt={user?.name || 'User'} />
              <AvatarFallback className="bg-salon-200 text-salon-700">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
}
