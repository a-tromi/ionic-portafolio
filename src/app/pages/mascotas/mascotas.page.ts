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

  // Cargar mascotas desde localStorage
  cargarMascotas() {
    const data = localStorage.getItem('mascotas');
    this.mascotas = data ? JSON.parse(data) : [];
  }

  // Calcula edad en años y meses desde la fecha de nacimiento
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

    if (años <= 0 && meses > 0) {
      return `${meses} meses`;
    } else if (años === 1 && meses === 0) {
      return `1 año`;
    } else if (años > 1 && meses === 0) {
      return `${años} años`;
    } else {
      return `${años} años y ${meses} meses`;
    }
  }

  // Navegar al formulario para agregar nueva mascota
  irAAgregarMascota() {
    this.router.navigate(['/detalle-mascota', 'nueva', 'perfil']);
  }

  // Navegar al formulario de edición con el índice
  verDetalleMascota(index: number) {
    this.router.navigate(['/detalle-mascota', index, 'perfil']);
  }
}
