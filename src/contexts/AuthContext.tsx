
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define the types for our context
type User = {
  id: string;
  email?: string;
  role?: 'client' | 'professional';
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'client' | 'professional') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    checkSession();

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string, role: 'client' | 'professional') => {
    try {
      // Try to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }

      if (!data || !data.user) {
        return { success: false, error: "Login failed. Please try again." };
      }

      // In a real app, you'd check user role in the database
      // For now, we'll just trust the role selection
      // Handle user role selection here

      // Set user and session
      const updatedUser = { 
        ...data.user, 
        role 
      } as User;
      
      setUser(updatedUser);
      setSession(data.session);

      // Redirect based on role
      if (role === "client") {
        navigate("/client");
      } else {
        navigate("/professional");
      }

      return { success: true };
    } catch (error) {
      console.error("Login exception:", error);
      return { 
        success: false, 
        error: "An unexpected error occurred. Please try again." 
      };
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    navigate("/auth/login");
  };

  // Provide auth context values
  const value = {
    session,
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
