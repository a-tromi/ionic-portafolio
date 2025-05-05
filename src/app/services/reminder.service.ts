import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Reminder {
  id?: number;
  userId: number;
  title: string;
  description?: string;
  reminderDate: string;
}

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private apiUrl = 'http://localhost:8080/api/reminder';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createReminder(req: Reminder): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, req, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getRemindersByUser(userId: number): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
