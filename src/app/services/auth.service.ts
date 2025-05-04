  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { map, Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    private apiUrl = 'http://localhost:8080/api/users'; // ✅ URL base del backend

    constructor(private http: HttpClient) {}

    /**
     * ✅ Registrar usuario usando POST /api/users/register
     */
    register(email: string, password: string, name: string): Observable<any> {
      const payload = {
        email,
        password,
        name
      };
      return this.http.post(`${this.apiUrl}/register`, payload);
    }

    /**
     * ✅ Login de usuario usando POST /api/users/login
     * El backend retorna un UserLoginResponse con { id, name, email, token }
     */
    login(email: string, password: string): Observable<any> {
      const payload = {
        email,
        password
      };
      return this.http.post(`${this.apiUrl}/login`, payload).pipe(
        map((res: any) => {
          // ✅ Guarda el token y datos del usuario si vienen en la respuesta
          if (res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userName', res.name);
            localStorage.setItem('userEmail', res.email);
          }
          return res;
        })
      );
    }

    /**
     * ✅ Cerrar sesión eliminando los datos del usuario almacenados
     */
    logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }

    /**
     * ✅ Verifica si hay un usuario autenticado
     */
    isLoggedIn(): boolean {
      return !!localStorage.getItem('token');
    }

    /**
     * ✅ Devuelve el token actual
     */
    getToken(): string | null {
      return localStorage.getItem('token');
    }

    /**
     * ✅ Devuelve el email del usuario autenticado
     */
    getUserEmail(): string | null {
      return localStorage.getItem('userEmail');
    }
  }
