import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, FormsModule],
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  // Método para mostrar mensaje de alerta (reutilizable)
  async mensajeAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Función para validar el formato del email
  validaEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para emails
    return emailRegex.test(email);
  }

  // Función que valida si la contraseña es fuerte
  esPasswordFuerte(password: string): boolean {
    let cantidadNumeros = 0;
    let tieneMayuscula = false;

    // Recorremos cada carácter de la contraseña
    for (let i = 0; i < password.length; i++) {
      const caracter = password.charAt(i);
      if (!isNaN(Number(caracter))) {
        cantidadNumeros++; // Si es número, sumamos
      } else if (caracter === caracter.toUpperCase() && caracter !== caracter.toLowerCase()) {
        tieneMayuscula = true; // Si es mayúscula, marcamos como true
      }
    }

    // Retorna true solo si cumple ambas condiciones
    return tieneMayuscula && cantidadNumeros >= 2;
  }

  // Método principal de login
  login() {
    // Validación de campos vacíos
    if (!this.email) {
      this.mensajeAlerta('El campo de correo no puede estar vacío.');
      return;
    }
  
    if (!this.validaEmail(this.email)) {
      this.mensajeAlerta('El formato de correo no es válido.');
      return;
    }
  
    if (!this.password) {
      this.mensajeAlerta('La contraseña no puede estar vacía.');
      return;
    }
  
    if (this.password.trim().length < 6) {
      this.mensajeAlerta('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
  
    if (!this.esPasswordFuerte(this.password)) {
      this.mensajeAlerta('La contraseña debe contener al menos una letra mayúscula y dos números.');
      return;
    }
  //** MARK: localStorage
    // Guarda en localStorage que el usuario inició sesión
    localStorage.setItem('usuarioLogueado', 'true');
  
    // Opcional: guarda el email para mostrarlo si no se ha guardado aún
    if (!localStorage.getItem('emailUsuario')) {
      localStorage.setItem('emailUsuario', this.email);
    }
  
    // Navega al home
    this.navCtrl.navigateForward(['/home'], {
      queryParams: {
        email: this.email,
        password: this.password
      }
    });
  }
  

  // Ir a la página de registro
  registro() {
    this.navCtrl.navigateForward(['/registro']);
  }
}
