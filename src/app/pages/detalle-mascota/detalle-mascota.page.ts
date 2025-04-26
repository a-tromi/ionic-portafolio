import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-detalle-mascota',
  templateUrl: './detalle-mascota.page.html',
  styleUrls: ['./detalle-mascota.page.scss'],
  imports: [IonicModule]
})
export class DetalleMascotaPage {
  constructor(private router: Router) {}

  ionViewWillEnter() {
    // Si estamos en /detalle-mascota, redirigimos automáticamente a /perfil
    if (this.router.url === '/detalle-mascota' || this.router.url === '/detalle-mascota/') {
      this.router.navigate(['/detalle-mascota/perfil']);
    }
  }
}
