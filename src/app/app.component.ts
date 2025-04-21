import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
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
    private router: Router
  ) {}

  cerrarSesion(): void {
    console.log('Sesión cerrada');
    this.menu.close('mainMenu');
    this.router.navigate(['/login']);
  }
}
