import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  constructor() {}

  /**
   * Agrega una mascota al usuario actual (por su email)
   */
  agregarMascota(mascota: any) {
    const emailUsuario = localStorage.getItem('emailUsuario');
    if (!emailUsuario) {
      console.error('❌ No hay usuario logueado para agregar mascota.');
      return;
    }

    const mascotasUsuario = this.obtenerMascotasPorUsuario(emailUsuario);
    mascotasUsuario.push(mascota);
    localStorage.setItem(`mascotas_${emailUsuario}`, JSON.stringify(mascotasUsuario));
  }

  /**
   * Obtiene las mascotas del usuario actual
   */
  obtenerMascotas(): any[] {
    const emailUsuario = localStorage.getItem('emailUsuario');
    if (!emailUsuario) {
      console.error('❌ No hay usuario logueado para obtener mascotas.');
      return [];
    }

    return this.obtenerMascotasPorUsuario(emailUsuario);
  }

  /**
   * Obtiene mascotas de un email específico (uso interno)
   */
  private obtenerMascotasPorUsuario(email: string): any[] {
    const datos = localStorage.getItem(`mascotas_${email}`);
    if (datos) {
      return JSON.parse(datos);
    } else {
      return [];
    }
  }

  /**
   * Borra todas las mascotas de un usuario
   */
  borrarMascotas() {
    const emailUsuario = localStorage.getItem('emailUsuario');
    if (emailUsuario) {
      localStorage.removeItem(`mascotas_${emailUsuario}`);
    }
  }
}
