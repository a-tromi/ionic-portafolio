import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

import { Appointment, AppointmentCreateRequest } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './citas-medicas.component.html',
  styleUrls: ['./citas-medicas.component.scss']
})
export class CitasMedicasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private alertCtrl = inject(AlertController);
  private svc = inject(AppointmentService);

  mascotaId!: number;
  citas: Appointment[] = [];

  // Campos del formulario
  titulo = '';
  fechaCita = '';
  notas = '';
  mostrarSelector = false;

  ngOnInit(): void {
    // Intentamos leer el parámetro 'id' subiendo dos niveles: 
    // /detalle-mascota/:id/citas-medicas
    let idParam = this.route.snapshot.parent?.parent?.paramMap.get('id');
    // Si no lo encontramos, probamos otras rutas para mayor robustez
    if (!idParam) {
      idParam =
        this.route.snapshot.paramMap.get('id') ||
        this.route.snapshot.parent?.paramMap.get('id') ||
        '0';
    }

    this.mascotaId = Number(idParam);
    if (isNaN(this.mascotaId) || this.mascotaId <= 0) {
      this.showAlert('Error', `ID de mascota inválido: ${idParam}`);
      return;
    }

    this.loadCitas();
  }

  private loadCitas(): void {
    this.svc.getByPet(this.mascotaId).subscribe({
      next: appts => this.citas = appts,
      error: () => this.showAlert('Error', 'No se pudieron cargar las citas')
    });
  }

  async guardarCita(): Promise<void> {
    if (!this.titulo || !this.fechaCita) {
      await this.showAlert('Atención', 'Completa todos los campos obligatorios');
      return;
    }

    const req: AppointmentCreateRequest = {
      petId: this.mascotaId,
      title: this.titulo,
      appointmentDate: new Date(this.fechaCita).toISOString(),
      notes: this.notas
    };

    this.svc.create(req).subscribe({
      next: async () => {
        await this.showAlert('Éxito', 'Cita creada correctamente');
        this.titulo = this.fechaCita = this.notas = '';
        this.loadCitas();
      },
      error: async err => {
        await this.showAlert('Error', err.error?.message || 'No se pudo crear la cita');
      }
    });
  }

  async eliminarCita(appointmentId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Eliminar esta cita médica?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.svc.delete(appointmentId).subscribe({
              next: async () => {
                await this.showAlert('Éxito', 'Cita eliminada');
                this.loadCitas();
              },
              error: () => this.showAlert('Error', 'No se pudo eliminar la cita')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}
