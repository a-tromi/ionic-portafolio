import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ✅ IMPORTADO
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule]
})
export class RegistroPage implements OnInit {
  esEdicion: boolean = false;

  name: string = '';
  email: string = '';
  password: string = '';
  emailInvalido: boolean = false;

  fotoSeleccionada: string | ArrayBuffer | null = null;
  archivoFoto: File | null = null;

  nombreTouched: boolean = false;
  passwordTouched: boolean = false;

  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private authService: AuthService // ✅ INYECTADO
  ) {}

  ngOnInit() {
    this.menu.close("mainMenu");
    this.esEdicion = this.route.snapshot.queryParamMap.get('edit') === 'true';

    if (this.esEdicion) {
      const nombreGuardado = localStorage.getItem('nombreUsuario');
      const fotoGuardada = localStorage.getItem('fotoUsuario');
      const emailGuardado = localStorage.getItem('emailUsuario');

      if (nombreGuardado) this.name = nombreGuardado;
      if (emailGuardado) this.email = emailGuardado;
      if (fotoGuardada) this.fotoSeleccionada = fotoGuardada;
    }
  }

  validarEmailTiempoReal() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(this.email);
  }

  async registrarse() {
    const nombreValido = this.name.trim().length > 0;

    let emailValido = true;
    if (!this.esEdicion) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailValido = emailRegex.test(this.email);
      this.emailInvalido = !emailValido;
    }

    const passwordLongitudValida = this.password.length >= 6;
    const passwordFuerte = this.isStrongPassword(this.password);

    if (!nombreValido || (!emailValido && !this.esEdicion) || !passwordLongitudValida || !passwordFuerte) {
      const alerta = await this.alertController.create({
        header: 'Campos inválidos',
        message: `
          ${!nombreValido ? '• El nombre es obligatorio.<br>' : ''}
          ${!emailValido && !this.esEdicion ? '• El correo electrónico no es válido.<br>' : ''}
          ${!passwordLongitudValida ? '• La contraseña debe tener al menos 6 caracteres.<br>' : ''}
          ${!passwordFuerte ? '• La contraseña debe contener al menos una letra mayúscula y dos números.<br>' : ''}
        `,
        buttons: ['Aceptar']
      });
      await alerta.present();
      return;
    }

    if (!this.esEdicion) {
      try {
        // ✅ LLAMADA AL BACKEND PARA REGISTRO
        await this.authService.register(this.email, this.password, this.name).toPromise();

        // ✅ Opcionalmente guarda el email/nombre para usar después
        localStorage.setItem('nombreUsuario', this.name);
        localStorage.setItem('emailUsuario', this.email);
        if (this.fotoSeleccionada) {
          localStorage.setItem('fotoUsuario', this.fotoSeleccionada as string);
        }

        localStorage.setItem('usuarioLogueado', 'true');

        const toast = await this.toastController.create({
          message: 'Registrado exitosamente',
          duration: 1000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      } catch (error) {
        const alerta = await this.alertController.create({
          header: 'Error',
          message: 'Ocurrió un error al registrar el usuario. Intenta nuevamente.',
          buttons: ['Aceptar']
        });
        await alerta.present();
        console.error('Error en registro:', error);
      }
    } else {
      // ✅ Modo edición local
      localStorage.setItem('nombreUsuario', this.name);
      if (this.fotoSeleccionada) {
        localStorage.setItem('fotoUsuario', this.fotoSeleccionada as string);
      }

      const toast = await this.toastController.create({
        message: 'Cambios guardados correctamente',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
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

  irALogin() {
    this.router.navigate(['/login']);
  }

  isStrongPassword(password: string): boolean {
    let digitCount = 0;
    let hasUppercase = false;

    for (let ch of password) {
      if (!isNaN(parseInt(ch))) {
        digitCount++;
      } else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) {
        hasUppercase = true;
      }
    }

    return hasUppercase && digitCount >= 2;
  }
}

