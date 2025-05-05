// src/app/models/appointment.model.ts
export interface Appointment {
  id?: string;
  pet: {
    id: number;
    name?: string;
    species?: string;
    breed?: string;
    birthDate?: string;
  };
  title: string;
  appointmentDate: string; // ISO 8601
  notes?: string;
  fcmToken: string;
}

// src/app/models/appointment-create-request.model.ts
export interface AppointmentCreateRequest {
  petId: number;
  title: string;
  appointmentDate: string; // ISO 8601
  notes: string;
}
