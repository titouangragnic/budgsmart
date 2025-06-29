import ApiService from './ApiService';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'budgsmart_token';
  private static readonly USER_KEY = 'budgsmart_user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async login(data: LoginData): Promise<LoginResponse> {
    const response = await ApiService.post<LoginResponse>('/auth/login', data);
    
    // Sauvegarder le token et l'utilisateur
    this.setToken(response.token);
    this.setUser(response.user);
    
    return response;
  }

  static async register(data: RegisterData): Promise<LoginResponse> {
    const response = await ApiService.post<LoginResponse>('/auth/register', data);
    
    // Sauvegarder le token et l'utilisateur
    this.setToken(response.token);
    this.setUser(response.user);
    
    return response;
  }

  static async getProfile(): Promise<{ user: User }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Aucun token d\'authentification');
    }

    return ApiService.request<{ user: User }>('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  static logout(): void {
    this.removeToken();
    this.removeUser();
  }
}

export default AuthService;
