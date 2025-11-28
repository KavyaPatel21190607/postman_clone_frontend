import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../utils/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('api_tool_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await authApi.register({ name, email, password });

      const userToStore = {
        id: data._id,
        name: data.name,
        email: data.email,
        token: data.token
      };

      setUser(userToStore);
      localStorage.setItem('api_tool_user', JSON.stringify(userToStore));
      return true;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await authApi.login({ email, password });

      const userToStore = {
        id: data._id,
        name: data.name,
        email: data.email,
        token: data.token
      };

      setUser(userToStore);
      localStorage.setItem('api_tool_user', JSON.stringify(userToStore));
      return true;
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('api_tool_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
