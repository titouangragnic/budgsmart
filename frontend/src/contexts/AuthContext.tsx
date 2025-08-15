import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { googleOAuthConfig } from '../config/google-oauth-config';
import ApiService from '../services/ApiService';

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

  // Token getter function
  const getAccessToken = async (): Promise<string | undefined> => {
    return accessToken;
  };

  // Configure ApiService to use our token getter
  useEffect(() => {
    ApiService.setTokenGetter(getAccessToken);
  }, [accessToken]);

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
        try {
          window.google.accounts.id.initialize({
            client_id: googleOAuthConfig.clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            // Add FedCM configuration to suppress warnings
            use_fedcm_for_prompt: true,
            // Additional configuration for better compatibility
            itp_support: true,
            ux_mode: 'popup', // Prefer popup mode for better reliability
          });

          // Vérifier si l'utilisateur est déjà connecté
          const savedUser = localStorage.getItem('google_user');
          const savedToken = localStorage.getItem('google_token');
          
          if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setAccessToken(savedToken);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Failed to initialize Google Auth:', error);
        }
      }
      setIsLoading(false);
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send Google ID token to backend for verification and user creation/login
      const credential = response.credential;
      
      const authResponse = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.message || 'Failed to authenticate with backend');
      }

      const { user: backendUser, token: jwtToken } = await authResponse.json();

      const googleUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
        picture: backendUser.picture,
      };

      // Save JWT token from backend (not Google token)
      localStorage.setItem('google_user', JSON.stringify(googleUser));
      localStorage.setItem('google_token', jwtToken);

      setUser(googleUser);
      setAccessToken(jwtToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
      alert('Erreur lors de la connexion: ' + (error as Error).message);
    }
  };

  const login = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      try {
        // Use the modern approach with better error handling
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.info('Google One Tap was not displayed - this is normal with FedCM migration');
            // Don't reject, just resolve - the user can use the rendered button
            resolve();
          } else if (notification.isSkippedMoment()) {
            console.info('Google One Tap was skipped - user can still use the sign-in button');
            // Don't reject, just resolve - the user can use the rendered button
            resolve();
          } else if (notification.isDismissedMoment()) {
            console.info('Google One Tap was dismissed by user');
            resolve();
          } else {
            // One Tap was displayed successfully
            resolve();
          }
        });
      } catch (error) {
        console.error('Error with Google One Tap:', error);
        // Don't reject - just resolve and let the user use the rendered button
        resolve();
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

  // Fonction register pour compatibilité (pas utilisée avec Google OAuth)
  const register = async (_userData: any): Promise<void> => {
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
