import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { User } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au démarrage
    const initAuth = async () => {
      try {
        const savedUser = AuthService.getUser();
        if (savedUser && AuthService.isAuthenticated()) {
          // Vérifier que le token est toujours valide en récupérant le profil
          const profileResponse = await AuthService.getProfile();
          setUser(profileResponse.user);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        // Si le token n'est plus valide, nettoyer le localStorage
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string): Promise<void> => {
    try {
      const response = await AuthService.register({ email, password, firstName, lastName });
      setUser(response.user);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = (): void => {
    AuthService.logout();
    setUser(null);
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (AuthService.isAuthenticated()) {
        const profileResponse = await AuthService.getProfile();
        setUser(profileResponse.user);
        AuthService.setUser(profileResponse.user);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      // Si la récupération du profil échoue, déconnecter l'utilisateur
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
