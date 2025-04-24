import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule],
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private alertController: AlertController) { }

  ngOnInit() {
  }

  // Método para mostrar mensaje de alerta
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para validar email
    return emailRegex.test(email);
  }

  login() {    
    if (!this.email) {
     this.mensajeAlerta('El campo de correo no puede estar vacío.');
     return;
   }

   if (!this.validaEmail(this.email)) {
    this.mensajeAlerta('El formato de correo no es valido');
    return;
  }

  if (!this.password) {
    this.mensajeAlerta('La contraseña no puede estar vacia.');
    return;
  }

    // Validando la longitud de la contraseña (4 caracteres)
    if (!this.password || this.password.trim().length < 6) {
      this.mensajeAlerta('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.navCtrl.navigateForward(['/home'], {
      queryParams: {
        email: this.email,
        password: this.password
      }
    });   
  }

  registro()
{
  this.navCtrl.navigateForward(['/registro']);
}

}
