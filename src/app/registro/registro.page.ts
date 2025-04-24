import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, AlertController, ToastController } from '@ionic/angular'; // Agregamos ToastController
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegistroPage implements OnInit {

  // Variables del formulario
  nombre: string = '';
  email: string = '';
  password: string = '';
  emailInvalido: boolean = false;

  // Foto
  fotoSeleccionada: string | ArrayBuffer | null = null;
  archivoFoto: File | null = null;

  // Control de validación
  nombreTouched: boolean = false;
  passwordTouched: boolean = false;

  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private router: Router,
    private toastController: ToastController // Inyectamos el ToastController
  ) {}

  ngOnInit() {
    this.menu.close("mainMenu");
  }

  validarEmailTiempoReal() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(this.email);
  }

  /**
   * Método para registrar usuario.
   * Incluye validación, almacenamiento local y mensaje con toast.
   */
  async registrarse() {
    const nombreValido = this.nombre.trim().length > 0;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(this.email);
    const passwordValida = this.password.length >= 6;
    this.emailInvalido = !emailValido;

    if (!nombreValido || !emailValido || !passwordValida) {
      const alerta = await this.alertController.create({
        header: 'Campos inválidos',
        message: `
          ${!nombreValido ? '• El nombre es obligatorio.<br>' : ''}
          ${!emailValido ? '• El correo electrónico no es válido.<br>' : ''}
          ${!passwordValida ? '• La contraseña debe tener al menos 6 caracteres.<br>' : ''}
        `,
        buttons: ['Aceptar']
      });
      await alerta.present();
      return;
    }

    // Guardar datos en localStorage
    localStorage.setItem('nombreUsuario', this.nombre);
    localStorage.setItem('emailUsuario', this.email);
    if (this.fotoSeleccionada) {
      localStorage.setItem('fotoUsuario', this.fotoSeleccionada as string);
    }

    // Mostrar toast de éxito
    const toast = await this.toastController.create({
      message: 'Registrado exitosamente',
      duration: 1000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    // Redirigir al Home después del toast
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000); // Esperamos que el toast termine antes de redirigir
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

  irALogin() {
    this.router.navigate(['/login']);
  }
}
