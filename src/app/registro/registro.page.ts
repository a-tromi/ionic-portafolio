import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, AlertController } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegistroPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  usuario: string = '';
  password: string = '';

  constructor(
    private alertController: AlertController,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.menu.close("mainMenu");
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  guardar() {
    if (this.nombre.trim() === '' || this.apellido.trim() === '') {
      this.presentAlert('Error: nombre y apellido vacíos');
    } else {
      this.presentAlert('Datos Correctos. Usuario: ' + this.usuario);
    }
  }
}
