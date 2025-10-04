import { TOKEN_KEY } from '@/constants/auth';

export class AuthService {
  static API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  static async login(credentials) {
    // Stubbed successful login response
    return {
      access_token: 'stubbed-access-token',
      user: {
        id: 1,
        username: credentials.username,
        email: 'user@example.com',
        name: 'Test User',
        roles: ['user'],
      },
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }

  // static async login(credentials) {
  //   try {
  //     console.log("Sending login request to:", `${this.API_URL}/login`);
  //     const response = await fetch(`${this.API_URL}/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(credentials),
  //     });

  //     if (!response.ok) {
  //       let message = 'Invalid credentials';
  //       try {
  //         const errorData = await response.json();
  //         if (errorData?.detail) {
  //           message = errorData.detail;
  //         }
  //       } catch (e) {
  //         // Use default message
  //       }
  //       throw new Error(message);
  //     }

  //     const data = await response.json();
  //     return data;



  //   } catch (error) {
  //     if (error.message === 'Failed to fetch') {
  //       throw new Error('Cannot connect to server. Please check your backend.');
  //     }
  //     throw error;
  //   }
  // }

  static setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  static getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  static removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  static logout() {
    this.removeToken();
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}