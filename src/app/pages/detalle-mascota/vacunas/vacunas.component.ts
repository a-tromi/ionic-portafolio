// src/app/pages/detalle-mascota/vacunas/vacunas.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';

import { VacunasService, Vaccination } from '../../../services/vacunas.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './vacunas.component.html',
  styleUrls: ['./vacunas.component.scss']
})
export class VacunasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);
  private svc       = inject(VacunasService);
  private auth      = inject(AuthService);
  private router    = inject(Router);

  mascotaId!: number;
  vacunas: Vaccination[] = [];

  // Formulario
  nuevaVacuna: Vaccination = this.resetVacuna();
  mostrarCalendarioAplicada = false;
  mostrarCalendarioProxima = false;

  ngOnInit(): void {
    // Intentamos leer el parámetro 'id' subiendo dos niveles: 
    // /detalle-mascota/:id/vacunas
    let idParam = this.route.snapshot.parent?.parent?.paramMap.get('id');
    // Si no lo encontramos, probamos en otros niveles:
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

    this.loadVacunas();
  }

  private loadVacunas(): void {
    this.svc.obtenerVacunas(String(this.mascotaId)).subscribe({
      next: vs => this.vacunas = vs,
      error: () => this.showAlert('Error', 'No se pudieron cargar las vacunas')
    });
  }

  async guardarVacuna(): Promise<void> {
    const { vaccineName, dateGiven, nextDueDate } = this.nuevaVacuna;
    if (!vaccineName || !dateGiven) {
      await this.showAlert('Atención', 'Completa nombre y fecha aplicada');
      return;
    }

    const load = await this.loadingCtrl.create({ message: 'Guardando vacuna...' });
    await load.present();

    console.log('📤 Creando vacuna:', this.nuevaVacuna);
    console.log('🔑 Token:', this.auth.getAuthHeaders().get('Authorization'));

    this.svc.crearVacuna(String(this.mascotaId), this.nuevaVacuna).subscribe({
      next: vac => {
        load.dismiss();
        this.vacunas.push(vac);
        this.nuevaVacuna = this.resetVacuna();
      },
      error: async err => {
        load.dismiss();
        await this.showAlert('Error al guardar vacuna', err.error?.message || 'Fallo inesperado');
      }
    });
  }

  async eliminarVacuna(index: number): Promise<void> {
    const vac = this.vacunas[index];
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Eliminar esta vacuna?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.svc.eliminarVacuna(String(this.mascotaId), vac.id!).subscribe({
              next: () => this.vacunas.splice(index, 1),
              error: () => this.showAlert('Error', 'No se pudo eliminar la vacuna')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  private resetVacuna(): Vaccination {
    return {
      vaccineName: '',
      description: '',
      dateGiven: '',
      nextDueDate: '',
      multiDose: false,
      doseNumber: 1,
      totalDoses: 1,
      veterinarianName: '',
      notes: ''
    };
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const a = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await a.present();
  }
}
