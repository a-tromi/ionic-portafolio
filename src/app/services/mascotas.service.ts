import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MascotasService {

  private apiUrl = 'http://localhost:8080/api/pets';


  constructor  (private http: HttpClient) {}

  // Agrega una nueva mascota al usuario autenticado (usa el backend)

 agregarMascota(mascota: any): Observable<any> {
   return this.http.post(`${this.apiUrl}`, mascota);
 }

 /**
  * ✅ CAMBIADO
  * Obtiene las mascotas del usuario autenticado (usa el backend)
  */
 obtenerMascotas(): Observable<any[]> {
   return this.http.get<any[]>(`${this.apiUrl}`);
 }

 /**
  * ✅ NUEVO
  * Obtiene una mascota específica por su ID
  */
 obtenerMascotaPorId(id: number): Observable<any> {
   return this.http.get(`${this.apiUrl}/${id}`);
 }

 /**
  * ✅ NUEVO
  * Agrega una mascota junto con imagen (usa multipart/form-data)
  */
 agregarMascotaConImagen(data: FormData): Observable<any> {
   return this.http.post(`${this.apiUrl}/with-image`, data);
 }

 /**
  * ✅ NUEVO
  * Sube o actualiza la imagen de una mascota existente
  */
 subirImagenMascota(petId: number, imagen: File): Observable<any> {
   const formData = new FormData();
   formData.append('image', imagen);
   return this.http.post(`${this.apiUrl}/${petId}/image`, formData);
 }

 /**
  * ✅ NUEVO
  * Obtiene la URL de la imagen de una mascota
  */
 obtenerImagenMascota(petId: number): Observable<any> {
   return this.http.get(`${this.apiUrl}/${petId}/image`);
 }
}
