import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      const savedRefreshToken = localStorage.getItem('refreshToken');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setRefreshToken(savedRefreshToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log(`${API_URL}/login`);
      const response = await axios.post(`${API_URL}/login`, {
        email, 
        password
      });

      const { access_token, refresh_token, user } = response.data;
      
      setUser(user);
      setToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast({
        title: "Login realizado",
        description: "Você entrou com sucesso em sua conta.",
      });
    } catch (error) {
      let errorMessage = 'Falha no login';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register-user`, {
        username,
        email,
        password
      });

      if (response.data.access_token) {
        const { access_token, refresh_token, user } = response.data;
        
        setUser(user);
        setToken(access_token);
        setRefreshToken(refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso e você está logado.",
        });
      } else {
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso. Por favor faça login.",
        });
      }
    } catch (error) {
      let errorMessage = 'Falha no registro';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message;
      }
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: "Logout",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    token,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};