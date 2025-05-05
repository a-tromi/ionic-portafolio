import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Appointment {
  id: number;
  petId: number;
  date: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointment';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** Trae todas las citas del usuario */
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /** Crea una cita nueva */
  createAppointment(data: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
