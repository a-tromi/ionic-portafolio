import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class MascotasPage implements OnInit {
  mascotas: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarMascotas();
  }

  ionViewWillEnter() {
    this.cargarMascotas();
  }
  // #region localStorage
  // Cargar mascotas y sus vacunas desde localStorage
  cargarMascotas() {
    const data = localStorage.getItem('mascotas');
    const vacunasData = JSON.parse(localStorage.getItem('vacunas') || '{}');
    this.mascotas = data ? JSON.parse(data) : [];
  
    // Agregar el índice como ID de referencia
    this.mascotas.forEach((mascota, index) => {
      const vacunas = vacunasData[index] || [];
  
      const ultimaVacuna = vacunas.length > 0 ? vacunas[vacunas.length - 1] : null;
  
      mascota.vacunaResumen = {
        total: vacunas.length,
        ultimaNombre: ultimaVacuna?.vaccineName || null,
        ultimaFecha: ultimaVacuna?.dateGiven || null
      };
  
      mascota.id = index; // ⬅️ importante si necesitas el ID en otras partes
    });
  }  

  // Cálculo de edad desde la fecha de nacimiento
  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return '';

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();

    if (hoy.getDate() < nacimiento.getDate()) {
      meses--;
    }

    if (meses < 0) {
      años--;
      meses += 12;
    }

    if (años <= 0 && meses > 0) return `${meses} meses`;
    if (años === 1 && meses === 0) return `1 año`;
    if (años > 1 && meses === 0) return `${años} años`;
    return `${años} años y ${meses} meses`;
  }

  irAAgregarMascota() {
    this.router.navigate(['/detalle-mascota', 'nueva']);
  }

  verDetalleMascota(index: number) {
    this.router.navigate(['/detalle-mascota', index]);
  }
}
