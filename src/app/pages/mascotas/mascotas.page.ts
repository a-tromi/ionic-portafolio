import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MascotasService } from '../../services/mascotas.service'; // Ruta corregida

@Component({
  selector: 'app-mascotas',
  standalone: true,
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class MascotasPage implements OnInit {

  mascotas: any[] = [];

  constructor(
    private mascotasService: MascotasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMascotas();
  }

  ionViewWillEnter() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotas = this.mascotasService.obtenerMascotas();
  }

  calcularEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return '';

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();

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

  irAAgregarMascota() {
    this.router.navigate(['/detalle-mascota']);
  }
}
