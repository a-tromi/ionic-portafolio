import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { MascotasService, Pet } from '../../services/mascotas.service';

interface MascotaView {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  genero?: string;
  fechaNacimiento?: string;
  foto?: string;
  vacunaResumen: {
    total: number;
    ultimaNombre: string | null;
    ultimaFecha: string | null;
  };
}

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss']
})
export class MascotasPage implements OnInit, OnDestroy {
  mascotas: MascotaView[] = [];
  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private svc: MascotasService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarMascotas();

    // Solo recarga cuando la URL cambia a '/mascotas'
    this.routerSub = this.router.events.pipe(
      filter(evt =>
        evt instanceof NavigationEnd &&
        (evt as NavigationEnd).urlAfterRedirects === '/mascotas'
      )
    ).subscribe(() => {
      this.cargarMascotas();
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private cargarMascotas() {
    this.svc.obtenerMascotas().subscribe({
      next: (pets: Pet[]) => {
        const vacunasData: Record<number, any[]> =
          JSON.parse(localStorage.getItem('vacunas') || '{}');

        this.mascotas = pets.map(pet => {
          const idx = pet.id!;
          const vacunas = vacunasData[idx] || [];
          const ultima = vacunas.length > 0 ? vacunas[vacunas.length - 1] : null;

          return {
            id: idx,
            nombre: pet.name,
            especie:
              pet.species === 'PERRO' ? 'Perro' :
              pet.species === 'GATO'  ? 'Gato'  : 'Otro',
            raza: pet.breedName,
            genero:
              pet.gender === 'MACHO'   ? 'Macho' :
              pet.gender === 'HEMBRA'  ? 'Hembra' :
                                        undefined,
            fechaNacimiento: pet.birthdate,
            foto: pet.photoUrl,
            vacunaResumen: {
              total: vacunas.length,
              ultimaNombre: ultima?.vaccineName || null,
              ultimaFecha: ultima?.dateGiven  || null
            }
          };
        });
      },
      error: async err => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.message || 'No se pudieron cargar las mascotas',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  irAAgregarMascota() {
    this.router.navigate(['/detalle-mascota', 'nueva']);
  }

  verDetalleMascota(id: number) {
    this.router.navigate(['/detalle-mascota', id]);
  }

  calcularEdad(fecha?: string): string {
    if (!fecha) return '';
    const n = new Date(fecha);
    const hoy = new Date();
    let años = hoy.getFullYear() - n.getFullYear();
    let meses = hoy.getMonth() - n.getMonth();
    if (hoy.getDate() < n.getDate()) meses--;
    if (meses < 0) {
      años--;
      meses += 12;
    }
    if (años <= 0 && meses > 0) return `${meses} meses`;
    if (años === 1 && meses === 0) return `1 año`;
    if (años > 1 && meses === 0) return `${años} años`;
    return `${años} años y ${meses} meses`;
  }
}
