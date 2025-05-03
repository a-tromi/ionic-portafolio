import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilComponent {  
  modoEdicion: boolean = false;
  especie: string = '';
  nombre: string = '';  
  raza: string = '';
  genero: string = '';
  fechaNacimiento: string = '';
  edadCalculada: string | null = null;
  chip: string = '';
  fotoSeleccionada: string | ArrayBuffer | null = null;
  selectorAbierto: boolean = false;
  mostrarSelector: boolean = false;


  abrirSelectorFecha() {
    this.selectorAbierto = true;
  }


  mascotaIndex: number = -1;
  today: string = new Date().toISOString();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {      
    const idParam = this.route.snapshot.parent?.paramMap.get('id') || '';
    console.log('Parámetro ID:', idParam);
  
    if (idParam === 'nueva') {
      this.modoEdicion = false;
      this.resetFormulario();
    } else if (!isNaN(Number(idParam))) {
      this.modoEdicion = true;
      this.mascotaIndex = parseInt(idParam, 10);
      const mascotasGuardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');
      const mascota = mascotasGuardadas[this.mascotaIndex];
  
      if (mascota) {
        this.nombre = mascota.nombre || '';
        this.especie = mascota.especie || '';
        this.raza = mascota.raza || '';
        this.genero = mascota.genero || '';
        this.fechaNacimiento = mascota.fechaNacimiento || '';
        this.chip = mascota.chip || '';
        this.fotoSeleccionada = mascota.foto || null;
  
        if (this.fechaNacimiento) {
          this.actualizarEdad();
        }
      }
    } else {
      console.warn('ID no válido en la URL:', idParam);
      this.router.navigate(['/mascotas']);
    }
  }
  
  ionViewDidEnter() {
    this.ionViewWillEnter();
  }
  

  // Limpiar campos del formulario
  resetFormulario() {
    this.mascotaIndex = -1;
    this.nombre = '';
    this.especie = '';
    this.raza = '';
    this.genero = '';
    this.fechaNacimiento = '';
    this.chip = '';
    this.fotoSeleccionada = null;
    this.edadCalculada = null;
  }

  // Cálculo de edad desde fecha de nacimiento
  actualizarEdad() {
    if (!this.fechaNacimiento) {
      this.edadCalculada = null;
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);

    let años = hoy.getFullYear() - nacimiento.getFullYear();
    let meses = hoy.getMonth() - nacimiento.getMonth();

    if (hoy.getDate() < nacimiento.getDate()) {
      meses--;
    }

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

  // Guardar o actualizar mascota en localStorage
  async guardarPerfil() {
    const loading = await this.loadingController.create({
      message: 'Guardando cambios...',
      spinner: 'crescent',
      duration: 2000
    });

    await loading.present();

    const mascotasGuardadas = JSON.parse(localStorage.getItem('mascotas') || '[]');

    const nuevaMascota = {
      nombre: this.nombre,
      especie: this.especie,
      raza: this.raza,
      genero: this.genero,
      fechaNacimiento: this.fechaNacimiento,
      chip: this.chip,
      foto: this.fotoSeleccionada
    };

    if (this.mascotaIndex >= 0 && this.mascotaIndex < mascotasGuardadas.length) {
      // Editar
      mascotasGuardadas[this.mascotaIndex] = nuevaMascota;
    } else {
      // Nueva
      mascotasGuardadas.push(nuevaMascota);
    }

    localStorage.setItem('mascotas', JSON.stringify(mascotasGuardadas));

    await loading.dismiss();

    const toast = document.createElement('ion-toast');
    toast.message = 'Perfil actualizado exitosamente';
    toast.duration = 1500;
    toast.color = 'success';
    document.body.appendChild(toast);
    await toast.present();

    setTimeout(() => {
      this.router.navigate(['/mascotas']);
    }, 1000);
  }

  eliminarMascota() {
    if (this.mascotaIndex >= 0) {
      const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta mascota?');
  
      if (confirm) {
        const mascotas = JSON.parse(localStorage.getItem('mascotas') || '[]');
        mascotas.splice(this.mascotaIndex, 1); // Elimina por índice
        localStorage.setItem('mascotas', JSON.stringify(mascotas));
  
        const toast = document.createElement('ion-toast');
        toast.message = 'Mascota eliminada correctamente';
        toast.duration = 1500;
        toast.color = 'danger';
        document.body.appendChild(toast);
        toast.present();
  
        // Redirigir a la lista de mascotas
        this.router.navigate(['/mascotas'], { replaceUrl: true });
      }
    }
  }
  
  

  cambiarFoto() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  eliminarFoto() {
    this.fotoSeleccionada = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoSeleccionada = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  seleccionarEspecie(tipo: string) {
    this.especie = tipo;
  }
}
