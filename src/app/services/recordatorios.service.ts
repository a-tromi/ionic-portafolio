// src/app/services/recordatorios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// DTO que manda Angular al backend
export interface ReminderCreateRequest {
  userId: number;
  petId?: number;
  title: string;
  description?: string;
  reminderDate: string;  // YYYY-MM-DD
  recurring?: boolean;
}

// Modelo que devuelve el backend
export interface Reminder {
  id: number;
  userId: number;
  pet: number | null;
  title: string;
  description?: string;
  reminderDate: string;   // YYYY-MM-DD
  isRecurring: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RecordatoriosService {
  private apiUrl = 'http://localhost:8080/api/reminder';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private headers(): HttpHeaders {
    // mete aquí tu Bearer <token>
    return this.auth.getAuthHeaders();
  }

  /** GET /api/reminder */
  listAll(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(
      this.apiUrl,
      { headers: this.headers() }
    );
  }

  /** POST /api/reminder */
  create(req: ReminderCreateRequest): Observable<Reminder> {
    return this.http.post<Reminder>(
      this.apiUrl,
      req,
      { headers: this.headers() }
    );
  }

  /** DELETE /api/reminder/{id} 
   *  (añade este endpoint en tu controlador si aún no está)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.headers() }
    );
  }
}
