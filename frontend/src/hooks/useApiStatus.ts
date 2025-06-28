import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

interface ApiStatusResult {
  isLoading: boolean;
  isApiReady: boolean;
  error: string | null;
  retryCount: number;
  retryManually: () => void;
}

const MAX_RETRIES = 20; // 20 tentatives
const RETRY_INTERVAL = 3000; // 3 secondes entre chaque tentative

export const useApiStatus = (): ApiStatusResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const getErrorMessage = (error: any): string => {
    if (error?.message?.includes('CORS') || error?.name === 'TypeError') {
      return 'Problème de configuration CORS. L\'API ne permet pas l\'accès depuis ce domaine.';
    }
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch')) {
      return 'Erreur réseau. Vérifiez votre connexion internet.';
    }
    return 'L\'API semble indisponible. Veuillez réessayer plus tard.';
  };

  const checkApiHealth = async (): Promise<{ success: boolean; error?: any }> => {
    try {
      await ApiService.healthCheck();
      return { success: true };
    } catch (error) {
      console.log(`Tentative ${retryCount + 1}/${MAX_RETRIES} - API non disponible:`, error);
      return { success: false, error };
    }
  };

  const retryManually = () => {
    setRetryCount(0);
    setError(null);
    setIsLoading(true);
    setIsApiReady(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const performHealthCheck = async () => {
      if (retryCount >= MAX_RETRIES) {
        setError('Nombre maximum de tentatives atteint. Veuillez réessayer manuellement.');
        setIsLoading(false);
        return;
      }

      const result = await checkApiHealth();
      
      if (!isMounted) return;

      if (result.success) {
        setIsApiReady(true);
        setIsLoading(false);
        setError(null);
      } else {
        // Si c'est une erreur CORS, on arrête les tentatives après quelques essais
        if (result.error?.message?.includes('CORS') || result.error?.name === 'TypeError') {
          if (retryCount >= 2) {
            setError(getErrorMessage(result.error));
            setIsLoading(false);
            return;
          }
        }
        
        setRetryCount(prev => prev + 1);
        timeoutId = setTimeout(performHealthCheck, RETRY_INTERVAL);
      }
    };

    performHealthCheck();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [retryCount]);

  return {
    isLoading,
    isApiReady,
    error,
    retryCount,
    retryManually,
  };
};
