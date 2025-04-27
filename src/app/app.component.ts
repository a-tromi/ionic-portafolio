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

  // Agregamos las páginas del menú
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Mi Perfil', url: '/perfil', icon: 'person' },
    { title: 'Mascotas', url: '/mascotas', icon: 'paw' },
    { title: 'Cerrar Sesión', url: '/login', icon: 'log-out' }
  ];

  constructor(
    private menu: MenuController,
    private router: Router,
    private toastController: ToastController
  ) {}

  // Cierra sesión, limpia datos, muestra toast y redirige
  async cerrarSesion(): Promise<void> {
    await this.menu.close('mainMenu');

    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('fotoUsuario');

    const toast = await this.toastController.create({
      message: 'Sesión cerrada exitosamente.',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });

    await toast.present();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}
