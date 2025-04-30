import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000'; // URL de tu JSON Server

  constructor(private http: HttpClient) { }

  // Método para registrar usuarios
  register(email: string, password: string, name: string) {
    return this.http.post(`${this.apiUrl}/usuarios`, {
      email,
      password,
      name
    });
  }

  // Método para login
  login(email: string, password: string) {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios?email=${email}&password=${password}`)
      .pipe(
        map(usuarios => {
          if (usuarios.length > 0) {
            return usuarios[0]; // Usuario encontrado
          } else {
            throw new Error('Credenciales inválidas');
          }
        })
      );
  }
}
