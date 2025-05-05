// src/app/pages/detalle-mascota/perfil/perfil.component.ts

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonicModule,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MascotasService, Pet } from '../../../services/mascotas.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilComponent {
  modoEdicion = false;

  public especie = '';
  public nombre = '';
  public raza = '';
  public genero = '';
  public fechaNacimiento = '';
  public edadCalculada: string | null = null;
  public fotoSeleccionada: string | ArrayBuffer | null = null;
  public mostrarSelector = false;
  private mascotaIndex?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private svc: MascotasService,
    private auth: AuthService
  ) {}

  ionViewWillEnter() {
    let idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      idParam = this.route.snapshot.parent?.paramMap.get('id') || '';
    }

    if (idParam === 'nueva') {
      this.modoEdicion = false;
      this.resetFormulario();
    } else if (!isNaN(Number(idParam))) {
      this.modoEdicion = true;
      this.mascotaIndex = Number(idParam);
      this.cargarMascota(this.mascotaIndex);
    } else {
      this.router.navigate(['/mascotas']);
    }
  }

  ionViewDidEnter() {
    this.ionViewWillEnter();
  }

  private resetFormulario() {
    this.especie = '';
    this.nombre = '';
    this.raza = '';
    this.genero = '';
    this.fechaNacimiento = '';
    this.edadCalculada = null;
    this.fotoSeleccionada = null;
  }

  private cargarMascota(id: number) {
    this.svc.obtenerMascotaPorId(id).subscribe({
      next: pet => {
        this.nombre = pet.name;
        this.especie =
          pet.species === 'PERRO' ? 'Perro' :
          pet.species === 'GATO'  ? 'Gato'  : '';
        this.raza = pet.breedName || '';
        this.genero =
          pet.gender === 'MACHO'  ? 'Macho' :
          pet.gender === 'HEMBRA' ? 'Hembra' : '';
        this.fechaNacimiento = pet.birthdate || '';
        this.fotoSeleccionada = pet.photoUrl || null;
        if (this.fechaNacimiento) {
          this.calcularEdad();
        }
      },
      error: () => {
        this.alert('Error', 'No se pudo cargar la mascota');
        this.router.navigate(['/mascotas']);
      }
    });
  }

  public actualizarEdad(): void {
    this.calcularEdad();
  }

  public calcularEdad(): void {
    if (!this.fechaNacimiento) {
      this.edadCalculada = null;
      return;
    }
    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);
    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();
    if (hoy.getDate() < nacimiento.getDate()) meses--;
    if (meses < 0) {
      años--;
      meses += 12;
    }
    if (años <= 0 && meses > 0) {
      this.edadCalculada = `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else if (años > 0 && meses === 0) {
      this.edadCalculada = `${años} ${años === 1 ? 'año' : 'años'}`;
    } else if (años > 0 && meses > 0) {
      this.edadCalculada = `${años} ${años === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      this.edadCalculada = 'No calculada';
    }
  }

  async guardarPerfil() {
    const loading = await this.loadingController.create({
      message: 'Guardando en servidor...',
      spinner: 'crescent'
    });
    await loading.present();

    const pet: Pet = {
      name: this.nombre,
      species:
        this.especie === 'Perro' ? 'PERRO' :
        this.especie === 'Gato'  ? 'GATO'  : 'OTRO',
      breedName: this.raza,
      gender:
        this.genero === 'Macho' ? 'MACHO' : 'HEMBRA',
      birthdate: this.fechaNacimiento,
      photoUrl: this.fotoSeleccionada as string
    };

    console.log('📤 PETICIÓN =>', {
      url: this.svc['apiUrl'],
      headers: this.auth.getAuthHeaders().keys().reduce((o, k) =>
        ({ ...o, [k]: this.auth.getAuthHeaders().get(k) }), {}),
      body: pet
    });

    const op$ = this.modoEdicion && this.mascotaIndex != null
      ? this.svc.actualizarMascota(this.mascotaIndex, pet)
      : this.svc.agregarMascota(pet);

    op$.subscribe({
      next: () => {
        loading.dismiss();
        this.alert(this.modoEdicion ? 'Cambios guardados' : 'Mascota creada');
        this.router.navigate(['/mascotas']);
      },
      error: err => {
        loading.dismiss();
        this.alert(err.error?.message || 'No se pudo guardar');
      }
    });
  }

  private async alert(message: string, header: string = 'Info') {
    const a = await this.alertController.create({ header, message, buttons: ['OK'] });
    await a.present();
  }

  eliminarMascota() {
    if (this.mascotaIndex == null) return;
    if (!confirm('¿Eliminar esta mascota?')) return;
    this.svc.eliminarMascota(this.mascotaIndex).subscribe({
      next: () => {
        this.alert('Mascota eliminada correctamente', 'Éxito');
        this.router.navigate(['/mascotas'], { replaceUrl: true });
      },
      error: () => this.alert('No se pudo eliminar', 'Error')
    });
  }

  cambiarFoto() {
    document.querySelector<HTMLInputElement>('input[type="file"]')!.click();
  }

  eliminarFoto() {
    this.fotoSeleccionada = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => this.fotoSeleccionada = reader.result;
    reader.readAsDataURL(input.files[0]);
  }

  seleccionarEspecie(tipo: string) {
    this.especie = tipo;
  }
}
