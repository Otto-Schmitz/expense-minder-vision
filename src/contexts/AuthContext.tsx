import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar dados do localStorage ao inicializar
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setRefreshToken(savedRefreshToken);
      
      // Configurar o token no axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const { access_token, refresh_token, user } = response.data;
      
      // Armazenar no state e localStorage
      setUser(user);
      setToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Configurar o token no axios para requisições futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast.success("Login successful");
    } catch (error) {
      let errorMessage = 'Login failed';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar state e localStorage
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Remover o header do axios
    delete axios.defaults.headers.common['Authorization'];
    
    toast.info("Logged out successfully");
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register-user`, {
        username,
        email,
        password
      });
  
      // Se o registro incluir login automático, você pode processar a resposta
      // como fez no login. Caso contrário, apenas mostre uma mensagem de sucesso.
      
      // Exemplo se o backend retornar os tokens diretamente:
      if (response.data.access_token) {
        const { access_token, refresh_token, user } = response.data;
        
        setUser(user);
        setToken(access_token);
        setRefreshToken(refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        toast.success("Account created and logged in successfully");
      } else {
        // Caso precise fazer login separadamente após o cadastro
        toast.success("Account created successfully! Please log in.");
      }
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        token,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
