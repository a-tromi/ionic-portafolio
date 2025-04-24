import { Component } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
    private menu: MenuController,
    private router: Router,
    private toastController: ToastController
  ) {}

  // Cierra sesión, limpia datos, muestra toast y redirige
  async cerrarSesion(): Promise<void> {
    // Cierra el menú
    await this.menu.close('mainMenu');

    // Limpia los datos del usuario del localStorage
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('fotoUsuario');

    // Muestra un toast de sesión cerrada
    const toast = await this.toastController.create({
      message: 'Sesión cerrada exitosamente.',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });

    await toast.present();

    // Redirige al login después de un pequeño retraso
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500); // Espera un poco para que el toast se vea antes de redirigir
  }
}