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
  phone?: string;
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
        console.log("Auth state change event:", event);
        setSession(newSession);
        
        if (newSession?.user) {
          try {
            // Get user profile data
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', newSession.user.id)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
              throw userError;
            }

            if (userData) {
              console.log("User data found:", userData);
              setUser({
                id: newSession.user.id,
                name: userData.nome,
                email: userData.email,
                role: userData.tipo === 'cliente' ? 'client' : 'professional',
                username: userData.email.split('@')[0], // Fallback username
                phone: userData.telefone,
                profileImage: userData.avatar_url || undefined
              });
            } else {
              console.log("No user data found despite valid session");
              setUser(null);
              // If we have a session but no user data, log the user out
              if (event !== 'SIGNED_OUT') {
                await supabase.auth.signOut();
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            setUser(null);
            if (event !== 'SIGNED_OUT') {
              await supabase.auth.signOut();
            }
          }
        } else {
          console.log("No session or user found");
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session exists" : "No session");
      setSession(currentSession);

      if (currentSession?.user) {
        try {
          // Get user profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching initial user data:', userError);
            throw userError;
          }

          if (userData) {
            console.log("Initial user data found:", userData);
            setUser({
              id: currentSession.user.id,
              name: userData.nome,
              email: userData.email,
              role: userData.tipo === 'cliente' ? 'client' : 'professional',
              username: userData.email.split('@')[0], // Fallback username
              phone: userData.telefone,
              profileImage: userData.avatar_url || undefined
            });
          } else {
            console.log("No initial user data found despite valid session");
            // If we have a session but no user data, log the user out
            await supabase.auth.signOut();
            setUser(null);
          }
        } catch (error) {
          console.error('Error in initial session check:', error);
          await supabase.auth.signOut();
          setUser(null);
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
      console.log(`Attempting login with email: ${email}, role: ${role}`);
      
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(authError.message || "E-mail ou senha incorretos. Verifique suas credenciais.");
      }

      if (!authData.user) {
        console.error('No user returned from authentication');
        throw new Error('Erro ao autenticar. Por favor, tente novamente.');
      }

      console.log('Authentication successful, checking user data');
      
      // Verify the user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        await supabase.auth.signOut();
        throw new Error('Usuário não encontrado. Por favor, verifique suas credenciais.');
      }
      
      if (!userData) {
        console.error('No user data found');
        await supabase.auth.signOut();
        throw new Error('Usuário não encontrado. Por favor, verifique suas credenciais.');
      }
      
      // Get user role from database
      const userRole = userData.tipo === 'cliente' ? 'client' : 'professional';
      console.log(`User role from database: ${userRole}`);
      
      setUser({
        id: authData.user.id,
        name: userData.nome,
        email: userData.email,
        role: userRole,
        username: userData.email.split('@')[0],
        phone: userData.telefone,
        profileImage: userData.avatar_url || undefined
      });

      // Redirect based on role
      navigate(userRole === 'client' ? '/client' : '/professional');
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta, ${userData.nome}.`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: UserRegistrationData, password: string) => {
    try {
      console.log('Registering user with data:', userData);
      
      // First register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
      });

      if (authError) {
        console.error('Auth error during registration:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('No user returned from registration');
        throw new Error('No user returned from registration');
      }

      // Prepare user profile data
      // Importante: Garantir que endereço e CEP não sejam nulos para qualquer tipo de usuário
      let endereco = '';
      let cep = '';
      
      if (userData.role === 'professional' && userData.address) {
        endereco = `${userData.address.street}, ${userData.address.number}`;
        cep = userData.address.zipCode;
      } else if (userData.role === 'client') {
        // Para clientes, definir valores padrão para endereço e CEP
        endereco = 'Endereço não informado';
        cep = '00000-000';
      }
      
      console.log('Inserting user profile with address:', endereco, 'cep:', cep);
      
      // Then create the user profile in our users table
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          nome: userData.name,
          email: userData.email,
          telefone: userData.phone,
          cpf_cnpj: userData.role === 'client' ? userData.cpf : userData.cnpj,
          tipo: userData.role === 'client' ? 'cliente' : 'profissional',
          endereco: endereco,
          cep: cep,
          criado_em: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error('Insert error during profile creation:', insertError);
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
