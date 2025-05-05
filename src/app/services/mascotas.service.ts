// src/app/services/mascotas.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Pet {
  id?: number;
  name: string;
  species: 'PERRO' | 'GATO' | 'OTRO';
  breedName?: string;
  gender?: 'MACHO' | 'HEMBRA';
  birthdate?: string;
  photoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private apiUrl = 'http://localhost:8080/api/pets';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private headers(): HttpHeaders {
    return this.auth.getAuthHeaders();
  }

  agregarMascota(mascota: Pet): Observable<Pet> {
    return this.http.post<Pet>(
      this.apiUrl,
      mascota,
      { headers: this.headers() }
    );
  }

  obtenerMascotas(): Observable<Pet[]> {
    return this.http.get<Pet[]>(
      this.apiUrl,
      { headers: this.headers() }
    );
  }

  obtenerMascotaPorId(id: number): Observable<Pet> {
    return this.http.get<Pet>(
      `${this.apiUrl}/${id}`,
      { headers: this.headers() }
    );
  }

  actualizarMascota(id: number, mascota: Pet): Observable<Pet> {
    return this.http.put<Pet>(
      `${this.apiUrl}/${id}`,
      mascota,
      { headers: this.headers() }
    );
  }

  eliminarMascota(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.headers() }
    );
  }

  subirImagenMascota(petId: number, imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imagen);
    return this.http.post(
      `${this.apiUrl}/${petId}/image`,
      formData,
      { headers: this.headers() }
    );
  }
}
