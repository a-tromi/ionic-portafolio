import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  private async mensajeAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  private validaEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private esPasswordFuerte(password: string): boolean {
    let cantidadNumeros = 0;
    let tieneMayuscula = false;
    for (const c of password) {
      if (!isNaN(Number(c))) cantidadNumeros++;
      else if (c === c.toUpperCase() && c !== c.toLowerCase()) tieneMayuscula = true;
    }
    return tieneMayuscula && cantidadNumeros >= 2;
  }

  login() {
    if (!this.email) {
      this.mensajeAlerta('El correo no puede estar vacío.');
      return;
    }
    if (!this.validaEmail(this.email)) {
      this.mensajeAlerta('Formato de correo inválido.');
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
      this.mensajeAlerta('La contraseña debe contener al menos una mayúscula y dos números.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: res => {
        console.log('🔑 DEBUG token:', res.token);
        this.navCtrl.navigateForward('/home')
      },
      error: err => {
        const msg = err.error?.message || 'Error desconocido al iniciar sesión';
        this.mensajeAlerta(msg);
      }
    });
  }

  registro() {
    this.navCtrl.navigateForward('/registro');
  }
}
