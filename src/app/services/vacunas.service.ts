import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Vaccination {
  id?: number;
  petId?: number;
  vaccineName: string;
  description: string;
  dateGiven: string;      // ISO YYYY-MM-DD
  nextDueDate: string;    // ISO YYYY-MM-DD
  multiDose: boolean;
  doseNumber: number;
  totalDoses: number;
  veterinarianName: string;
  notes: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VacunasService {
  private apiBase = 'http://localhost:8080/api/pets';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private headers(): HttpHeaders {
    return this.auth.getAuthHeaders();
  }

  /** GET /api/pets/{petId}/vaccinations */
  obtenerVacunas(petId: string): Observable<Vaccination[]> {
    return this.http.get<Vaccination[]>(
      `${this.apiBase}/${petId}/vaccinations`,
      { headers: this.headers() }
    );
  }

  /** POST /api/pets/{petId}/vaccinations */
  crearVacuna(petId: string, data: Vaccination): Observable<Vaccination> {
    return this.http.post<Vaccination>(
      `${this.apiBase}/${petId}/vaccinations`,
      data,
      { headers: this.headers() }
    );
  }

  /** DELETE /api/pets/{petId}/vaccinations/{vaccinationId} */
  eliminarVacuna(petId: string, vaccinationId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiBase}/${petId}/vaccinations/${vaccinationId}`,
      { headers: this.headers() }
    );
  }
}
