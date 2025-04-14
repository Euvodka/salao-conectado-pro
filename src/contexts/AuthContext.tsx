
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

// Define the types for our context
type User = {
  id: string;
  email: string;
  role?: 'client' | 'professional';
};

type Session = {
  user: User | null;
  access_token?: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'client' | 'professional') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.info("Auth state change event: INITIAL_SESSION");
    
    // Check for existing session
    const currentSession = supabase.auth.session();
    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user as User);
      console.info("Initial session check: Session found", currentSession);
    } else {
      console.info("Initial session check: No session");
    }

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.info("Auth state change event:", _event);
      setSession(newSession);
      setUser(newSession?.user as User || null);
    });

    setIsLoading(false);

    // Cleanup subscription
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string, role: 'client' | 'professional') => {
    try {
      // Try to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signIn({ email, password });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }

      if (!data || !data.user) {
        return { success: false, error: "Login failed. Please try again." };
      }

      // Check user data from the users table to verify role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("role", role)
        .single();

      if (userError || !userData) {
        // If user doesn't exist or has a different role, sign them out
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: "Account not found with this role. Please check your credentials." 
        };
      }

      // Set user and session
      setUser({ ...data.user, role } as User);
      setSession(data);

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
    navigate("/");
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
