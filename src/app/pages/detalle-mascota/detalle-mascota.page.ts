import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-detalle-mascota',
  templateUrl: './detalle-mascota.page.html',
  styleUrls: ['./detalle-mascota.page.scss'],
  imports: [IonicModule]
})
export class DetalleMascotaPage {
  mascota: any;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ionViewWillEnter() {
    // Si estamos en /detalle-mascota, redirigimos automáticamente a /perfil
    if (this.router.url === '/detalle-mascota' || this.router.url === '/detalle-mascota/') {
      this.router.navigate(['/detalle-mascota/perfil']);
    }

    // Obtener índice desde la URL y cargar la mascota
    const index = +this.route.snapshot.paramMap.get('id')!;
    const mascotasGuardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
    this.mascota = mascotasGuardadas[index];
  }
}
