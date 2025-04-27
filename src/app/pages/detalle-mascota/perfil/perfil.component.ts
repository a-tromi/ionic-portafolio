import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MascotasService } from 'src/app/services/mascotas.service'; // Importar servicio de mascotas
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  // 🐾 Datos de la mascota
  especie: string = '';
  nombre: string = '';
  raza: string = '';
  genero: string = '';
  fechaNacimiento: string = '';
  chip: string = '';

  // 📅 Control de fecha
  today: Date = new Date();
  edadCalculada: string = '';

  // 📸 Control de foto
  fotoSeleccionada: string | ArrayBuffer | null = null;
  archivoFoto: File | null = null;

  constructor(
    private toastController: ToastController,
    private mascotasService: MascotasService, // ✅ Inyectamos el servicio
    private router: Router
  ) {}

  // -----------------------------------------------
  // Métodos de formulario
  // -----------------------------------------------

  seleccionarEspecie(valor: string) {
    this.especie = valor;
  }

  abrirDatePicker() {
    const dateInput = document.querySelector('input[matInput]') as HTMLInputElement;
    if (dateInput) {
      dateInput.focus();
    }
  }

  seleccionarFecha(event: any) {
    this.fechaNacimiento = event.value;
    this.actualizarEdad();
  }

  onDatePickerClosed() {}

  actualizarEdad() {
    this.edadCalculada = this.calcularEdad();
  }

  calcularEdad(): string {
    if (!this.fechaNacimiento) return '';
    const nacimiento = new Date(this.fechaNacimiento);
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

  cambiarFoto() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  eliminarFoto() {
    this.fotoSeleccionada = null;
    this.archivoFoto = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.archivoFoto = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoSeleccionada = reader.result;
      };
      reader.readAsDataURL(this.archivoFoto);
    }
  }

  // -----------------------------------------------
  // Método guardarPerfil mejorado
  // -----------------------------------------------

  async guardarPerfil() {
    if (!this.especie) {
      const toast = await this.toastController.create({
        message: '🐾 Por favor selecciona la especie',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    // Creamos el objeto de mascota a guardar
    const nuevaMascota = {
      especie: this.especie,
      nombre: this.nombre,
      raza: this.raza,
      genero: this.genero,
      fechaNacimiento: this.fechaNacimiento,
      edad: this.edadCalculada,
      chip: this.chip,
      foto: this.fotoSeleccionada
    };

    // Guardar en localStorage
  const mascotasGuardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
  mascotasGuardadas.push(nuevaMascota);
  localStorage.setItem('mascotas', JSON.stringify(mascotasGuardadas));

  // Mostrar toast de éxito
  const toast = await this.toastController.create({
    message: '🐾 Mascota guardada exitosamente',
    duration: 1500,
    color: 'success',
    position: 'bottom'
  });
  await toast.present();

  // Redirigir a la pantalla de mascotas
  setTimeout(() => {
    this.router.navigate(['/mascotas']);
  }, 500); // Esperar un poco para que se vea el toast
  }
}
