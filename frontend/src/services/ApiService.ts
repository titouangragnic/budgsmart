import { getApiBaseUrl } from '../utils/utils';

export class ApiService {
  private static baseUrl: string | null = null;
  private static baseUrlPromise: Promise<string> | null = null;
  private static getAccessToken: (() => Promise<string | undefined>) | null = null;

  // Méthode pour définir la fonction de récupération de token
  static setTokenGetter(tokenGetter: () => Promise<string | undefined>) {
    this.getAccessToken = tokenGetter;
  }

  // Méthode singleton pour récupérer l'URL de base
  private static async getBaseUrl(): Promise<string> {
    if (this.baseUrl) {
      return this.baseUrl;
    }

    if (!this.baseUrlPromise) {
      this.baseUrlPromise = getApiBaseUrl();
    }

    this.baseUrl = await this.baseUrlPromise;
    return this.baseUrl;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    // Récupérer le token Auth0 s'il existe
    let token: string | undefined;
    if (this.getAccessToken) {
      try {
        token = await this.getAccessToken();
      } catch (error) {
        console.warn('Erreur lors de la récupération du token:', error);
      }
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Améliorer la gestion des erreurs pour inclure le statut
        const errorMessage = `HTTP error! status: ${response.status}`;
        if (response.status === 401) {
          // Token invalide ou expiré
          throw new Error(`${errorMessage} - Unauthorized`);
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get<{ status: string; timestamp: string }>('/health');
  }
}

export default ApiService;
