import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegistroPage implements OnInit {
  esEdicion: boolean = false;

  // Variables del formulario de registro
  name: string = '';
  email: string = '';
  password: string = '';
  emailInvalido: boolean = false;

  // Variables para manejar la imagen seleccionada
  fotoSeleccionada: string | ArrayBuffer | null = null;
  archivoFoto: File | null = null;

  // Variables para mostrar errores en campos tocados
  nombreTouched: boolean = false;
  passwordTouched: boolean = false;

  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {}

  // Cierra el menú lateral al iniciar la página
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

  // Validación en tiempo real del campo de correo electrónico
  validarEmailTiempoReal() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalido = !emailRegex.test(this.email);
  }

  // Método principal para registrar al usuario
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
  
    // ✅ Guardar datos del usuario
    localStorage.setItem('nombreUsuario', this.name);
    if (!this.esEdicion) {
      localStorage.setItem('emailUsuario', this.email);
    }
    if (this.fotoSeleccionada) {
      localStorage.setItem('fotoUsuario', this.fotoSeleccionada as string);
    }
  
    // ✅ Marcar como usuario logueado (recomendado para la home)
    localStorage.setItem('usuarioLogueado', 'true');
  
    // ✅ Mostrar mensaje
    const toast = await this.toastController.create({
      message: this.esEdicion ? 'Cambios guardados correctamente' : 'Registrado exitosamente',
      duration: 1000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  
    // ✅ Redirigir a Home (solo si no es edición)
    if (!this.esEdicion) {
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    }
  }
    

  // Método para activar el input de selección de foto
  cambiarFoto() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Método para eliminar la foto seleccionada
  eliminarFoto() {
    this.fotoSeleccionada = null;
    this.archivoFoto = null;
  }

  // Método que se ejecuta cuando el usuario selecciona una imagen
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

  // Método para navegar a la página de login
  irALogin() {
    this.router.navigate(['/login']);
  }

  // Método que valida si una contraseña es fuerte
  // Debe contener al menos una mayúscula y dos dígitos
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
