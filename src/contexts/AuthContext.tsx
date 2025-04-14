
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: UserInfo | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: UserRegistrationData, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username: string;
  profileImage?: string;
}

interface UserRegistrationData {
  name: string;
  email: string;
  phone: string;
  username: string;
  role: UserRole;
  cpf?: string;
  cnpj?: string;
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          try {
            // Get user profile data
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', newSession.user.id)
              .single();

            if (userError) throw userError;

            if (userData) {
              setUser({
                id: newSession.user.id,
                name: userData.nome,
                email: userData.email,
                role: userData.tipo === 'cliente' ? 'client' : 'professional',
                username: userData.email.split('@')[0], // Fallback username
                profileImage: userData.avatar_url || undefined
              });
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);

      if (currentSession?.user) {
        try {
          // Get user profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) throw userError;

          if (userData) {
            setUser({
              id: currentSession.user.id,
              name: userData.nome,
              email: userData.email,
              role: userData.tipo === 'cliente' ? 'client' : 'professional',
              username: userData.email.split('@')[0], // Fallback username
              profileImage: userData.avatar_url || undefined
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No user returned from authentication');
      }

      // Then verify the user exists in our users table with the correct role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .eq('tipo', role === 'client' ? 'cliente' : 'profissional')
        .single();

      if (userError || !userData) {
        // If user doesn't exist with that role, sign out and throw error
        await supabase.auth.signOut();
        throw new Error(`Usuário não encontrado como ${role === 'client' ? 'cliente' : 'profissional'}`);
      }

      // Set user data after successful login
      setUser({
        id: authData.user.id,
        name: userData.nome,
        email: userData.email,
        role: userData.tipo === 'cliente' ? 'client' : 'professional',
        username: userData.email.split('@')[0],
        profileImage: userData.avatar_url || undefined
      });

      // Redirect based on role
      navigate(role === 'client' ? '/client' : '/professional');
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) de volta.",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: UserRegistrationData, password: string) => {
    try {
      // First register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No user returned from registration');
      }

      // Then create the user profile in our users table
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          nome: userData.name,
          email: userData.email,
          telefone: userData.phone,
          cpf_cnpj: userData.role === 'client' ? userData.cpf : userData.cnpj,
          tipo: userData.role === 'client' ? 'cliente' : 'profissional',
          endereco: userData.role === 'professional' ? `${userData.address?.street}, ${userData.address?.number}` : null,
          cep: userData.role === 'professional' ? userData.address?.zipCode : null,
          criado_em: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw insertError;
      }

      // Set user after successful registration
      setUser({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        username: userData.username,
      });

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Sua conta foi criada. Bem-vindo(a)!",
      });

      // Redirect based on role
      navigate(userData.role === 'client' ? '/client' : '/professional');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Houve um problema ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/');
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
