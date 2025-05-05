// Modelo para la especie
export interface Species {
    id: number;
    name: string;
  }
  
  // Modelo para la fecha importante
  export interface ImportantDate {
    name: string;             // Nombre del evento
    date: string;             // Formato MM-DD (sin año)
    description: string;      // Descripción del evento
    species: Species;         // Especie asociada (Perro, Gato)
  }
  