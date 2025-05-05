// src/app/pages/detalle-mascota/recordatorios/recordatorios.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute }           from '@angular/router';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';
import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import {
  RecordatoriosService,
  Reminder,
  ReminderCreateRequest
} from '../../../services/recordatorios.service';
import { AuthService }       from '../../../services/auth.service';
import { MascotasService, Pet } from '../../../services/mascotas.service';

interface LocalReminder {
  id: number;
  name: string;
  date: string;
  description?: string;
  species: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.scss'],
})
export class RecordatoriosComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private alertCtrl   = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private svc         = inject(RecordatoriosService);
  private auth        = inject(AuthService);
  private petSvc      = inject(MascotasService);

  mascotaId!: number;
  petSpeciesName = '';
  fechasImportantes: LocalReminder[] = [];

  mostrarSelectorFecha = false;

  // Modelo del formulario
  nuevoRecordatorio = {
    name: '',
    date: '',
    description: '',
    species: { id: 1, name: 'Perro' }
  };

  ngOnInit(): void {
    // Leemos :id subiendo a parent.parent como en CitasMedicasComponent
    let idParam = this.route.snapshot.parent?.parent?.paramMap.get('id');
    if (!idParam) {
      idParam =
        this.route.snapshot.paramMap.get('id') ||
        this.route.snapshot.parent?.paramMap.get('id');
    }
    this.mascotaId = Number(idParam);
    if (isNaN(this.mascotaId) || this.mascotaId <= 0) {
      this.showAlert('Error', `ID de mascota inválido: ${idParam}`);
      return;
    }

    console.log('🐾 Mascota ID:', this.mascotaId);
    console.log('🔑 Token:', this.auth.getAuthHeaders().get('Authorization'));

    // Primero cargamos la mascota para obtener su especie (en español)
    this.petSvc.obtenerMascotaPorId(this.mascotaId).subscribe({
      next: (pet: Pet) => {
        this.petSpeciesName = pet.species;
        this.loadRecordatorios();
      },
      error: () => this.loadRecordatorios()
    });
  }

  private loadRecordatorios(): void {
    this.svc.listAll().subscribe({
      next: all => {
        this.fechasImportantes = all
          .filter(r => r.pet === this.mascotaId)
          .map(r => ({
            id: r.id,
            name: r.title,
            date: r.reminderDate,
            description: r.description,
            species: {
              id: this.mascotaId,
              name: this.petSpeciesName || 'Mascota'
            }
          }));
      },
      error: () => this.showAlert('Error', 'No se pudieron cargar los recordatorios')
    });
  }

  async guardarRecordatorio(): Promise<void> {
    if (!this.nuevoRecordatorio.name || !this.nuevoRecordatorio.date) {
      await this.showAlert('Atención', 'Completa nombre y fecha');
      return;
    }

    const load = await this.loadingCtrl.create({ message: 'Guardando recordatorio…' });
    await load.present();

    const req: ReminderCreateRequest = {
      userId: Number(localStorage.getItem('userId')),
      petId: this.mascotaId,
      title: this.nuevoRecordatorio.name,
      description: this.nuevoRecordatorio.description,
      reminderDate: this.nuevoRecordatorio.date,
      recurring: false
    };

    console.log('📤 Creando recordatorio:', req);
    console.log('🔑 Token:', this.auth.getAuthHeaders().get('Authorization'));

    this.svc.create(req).subscribe({
      next: () => {
        load.dismiss();
        // en lugar de push parcial, recargamos toda la lista
        this.loadRecordatorios();
        // reset formulario
        this.nuevoRecordatorio = {
          name: '',
          date: '',
          description: '',
          species: { id: 1, name: 'Perro' }
        };
      },
      error: async err => {
        load.dismiss();
        await this.showAlert('Error al guardar', err.error?.message || 'Fallo inesperado');
      }
    });
  }

  async eliminarRecordatorio(index: number): Promise<void> {
    const rem = this.fechasImportantes[index];
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar este recordatorio?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.svc.delete(rem.id).subscribe({
              next: () => this.fechasImportantes.splice(index, 1),
              error: () => this.showAlert('Error', 'No se pudo eliminar')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  seleccionarFecha(evt: any) {
    const fecha = new Date(evt.detail.value);
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    this.nuevoRecordatorio.date = `${mm}-${dd}`;
    this.mostrarSelectorFecha = false;
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}
