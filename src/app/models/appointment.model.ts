
// Modelo Appointment (cita médica)
export interface Pet {
    id: number;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
  }
  
  export interface Appointment {
    pet: Pet;
    title: string;
    appointmentDate: string; // Formato ISO, por ejemplo: "2025-06-10T14:00:00"
    notes?: string;
    fcmToken?: string;
  }
  