import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth0, User as Auth0User } from '@auth0/auth0-react';

// Interface pour notre utilisateur (basée sur Auth0)
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  nickname?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
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

// Fonction pour convertir un utilisateur Auth0 en notre format
const convertAuth0User = (auth0User: Auth0User): User => {
  return {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    firstName: auth0User.given_name,
    lastName: auth0User.family_name,
    name: auth0User.name,
    nickname: auth0User.nickname,
    picture: auth0User.picture,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const user = auth0User ? convertAuth0User(auth0User) : null;
  const isAuthenticated = auth0IsAuthenticated;
  const isLoading = auth0IsLoading;

  const login = async (): Promise<void> => {
    await loginWithRedirect();
  };

  const logout = (): void => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin + '/budgsmart'
      }
    });
  };

  const getAccessToken = async (): Promise<string | undefined> => {
    try {
      if (isAuthenticated) {
        return await getAccessTokenSilently();
      }
      return undefined;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return undefined;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
