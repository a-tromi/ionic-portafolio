// src/app/services/appointment.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AppointmentCreateRequest } from '../models/appointment.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  // Ajusta aquí la URL base según tu environment.ts
  private readonly API = 'http://localhost:8080/api/appointment';

  getByPet(petId: number): Observable<Appointment[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Appointment[]>(`${this.API}/pet/${petId}`, { headers });
  }

  create(request: AppointmentCreateRequest): Observable<any> {
    const headers = this.auth.getAuthHeaders().set('Content-Type', 'application/json');
    //TODO: imprime por consola el request y cada uno de los campos que contiene
    console.log('Request:', request);
    console.log('Pet ID:', request.petId);
    console.log('Title:', request.title);
    console.log('Appointment Date:', request.appointmentDate);
    console.log('Notes:', request.notes);
    console.log('Headers:', headers);
    return this.http.post<void>(this.API, request, { headers, observe: 'response' });
  }

  delete(appointmentId: string): Observable<void> {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete<void>(`${this.API}/${appointmentId}`, { headers });
  }
}
