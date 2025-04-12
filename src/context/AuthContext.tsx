
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('salon-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('salon-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    // For now, we'll simulate a successful login
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: role === 'client' ? 'Maria Silva' : 'Salão Beauty Pro',
        email,
        phone: '(11) 98765-4321',
        username: role === 'client' ? 'maria.silva' : 'salaopro',
        role,
        profileImage: role === 'client' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop' 
          : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1469&auto=format&fit=crop',
      };
      
      setUser(mockUser);
      localStorage.setItem('salon-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Falha no login, verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user with the provided data
      const mockUser: User = {
        id: '1',
        name: userData.name || 'Usuário',
        email: userData.email || 'usuario@example.com',
        phone: userData.phone || '',
        username: userData.username || 'usuario',
        role: userData.role || 'client',
        profileImage: undefined,
        ...userData,
      };
      
      setUser(mockUser);
      localStorage.setItem('salon-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Falha no cadastro, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('salon-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
