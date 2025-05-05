import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface UserLoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  /** Cabeceras con JWT */
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, name });
  }

  login(email: string, password: string): Observable<UserLoginResponse> {
    return this.http
      .post<UserLoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(res => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userId', res.id);
            localStorage.setItem('userName', res.name);
            localStorage.setItem('userEmail', res.email);
          }
          return res;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
