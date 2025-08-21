const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiService {
  private static baseUrl = API_BASE_URL;
  private static getAccessToken: (() => Promise<string | undefined>) | null = null;

  // Méthode pour définir la fonction de récupération de token
  static setTokenGetter(tokenGetter: () => Promise<string | undefined>) {
    this.getAccessToken = tokenGetter;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
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
