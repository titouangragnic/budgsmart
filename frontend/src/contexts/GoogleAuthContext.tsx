import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { googleOAuthConfig } from '../config/google-oauth-config';

declare global {
  interface Window {
    google: any;
  }
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
  register?: (userData: any) => Promise<void>; // Pour compatibility avec l'ancienne interface
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  // Charger Google Identity Services
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleAuth();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initializeGoogleAuth;
      document.head.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleOAuthConfig.clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Vérifier si l'utilisateur est déjà connecté
        const savedUser = localStorage.getItem('google_user');
        const savedToken = localStorage.getItem('google_token');
        
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setAccessToken(savedToken);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Décoder le JWT token de Google
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const googleUser: User = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        name: payload.name,
        picture: payload.picture,
      };

      // Sauvegarder dans localStorage
      localStorage.setItem('google_user', JSON.stringify(googleUser));
      localStorage.setItem('google_token', credential);

      setUser(googleUser);
      setAccessToken(credential);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
    }
  };

  const login = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: ouvrir la popup de connexion
            window.google.accounts.oauth2.initTokenClient({
              client_id: googleOAuthConfig.clientId,
              scope: googleOAuthConfig.scope,
              callback: (response: any) => {
                if (response.access_token) {
                  // Récupérer les infos utilisateur avec le token
                  fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`)
                    .then(res => res.json())
                    .then(userInfo => {
                      const googleUser: User = {
                        id: userInfo.id,
                        email: userInfo.email,
                        firstName: userInfo.given_name,
                        lastName: userInfo.family_name,
                        name: userInfo.name,
                        picture: userInfo.picture,
                      };

                      localStorage.setItem('google_user', JSON.stringify(googleUser));
                      localStorage.setItem('google_token', response.access_token);

                      setUser(googleUser);
                      setAccessToken(response.access_token);
                      setIsAuthenticated(true);
                      resolve();
                    })
                    .catch(reject);
                }
              },
            }).requestAccessToken();
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('Google Identity Services not loaded'));
      }
    });
  };

  const logout = (): void => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    localStorage.removeItem('google_user');
    localStorage.removeItem('google_token');
    
    setUser(null);
    setAccessToken(undefined);
    setIsAuthenticated(false);
  };

  const getAccessToken = async (): Promise<string | undefined> => {
    return accessToken;
  };

  // Fonction register pour compatibilité (pas utilisée avec Google OAuth)
  const register = async (userData: any): Promise<void> => {
    throw new Error('Register not available with Google OAuth. Use login instead.');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAccessToken,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
