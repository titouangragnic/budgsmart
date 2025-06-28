import { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

interface ApiStatusResult {
  isLoading: boolean;
  isApiReady: boolean;
  error: string | null;
  retryCount: number;
}

const MAX_RETRIES = 20; // 20 tentatives
const RETRY_INTERVAL = 3000; // 3 secondes entre chaque tentative

export const useApiStatus = (): ApiStatusResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkApiHealth = async (): Promise<boolean> => {
    try {
      await ApiService.healthCheck();
      return true;
    } catch (error) {
      console.log(`Tentative ${retryCount + 1}/${MAX_RETRIES} - API non disponible:`, error);
      return false;
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const performHealthCheck = async () => {
      if (retryCount >= MAX_RETRIES) {
        setError('L\'API semble indisponible. Veuillez réessayer plus tard.');
        setIsLoading(false);
        return;
      }

      const isHealthy = await checkApiHealth();
      
      if (!isMounted) return;

      if (isHealthy) {
        setIsApiReady(true);
        setIsLoading(false);
        setError(null);
      } else {
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
  };
};
