import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Appointment } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './citas-medicas.component.html',
  styleUrls: ['./citas-medicas.component.scss']
})
export class CitasMedicasComponent {
  // Inyección de servicios necesarios
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertController = inject(AlertController);

  // ID de la mascota desde la ruta
  mascotaId!: string;

  // Lista de citas guardadas asociadas a la mascota
  citas: Appointment[] = [];

  // Variables del formulario
  titulo: string = '';
  fechaCita: string = '';
  notas: string = '';
  mostrarSelector: boolean = false;

  // Inicialización del componente
  ngOnInit() {
    this.mascotaId = this.route.parent?.snapshot.params['id'];
    console.log('ID de mascota:', this.mascotaId);
    // #region localStorage
    const citasGuardadas = JSON.parse(localStorage.getItem('citas') || '{}');
    this.citas = citasGuardadas[this.mascotaId] || [];
  }

  // Guardar nueva cita
  guardarCita() {
    if (!this.titulo || !this.fechaCita) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const nuevaCita: Appointment = {
      pet: {
        id: Number(this.mascotaId),
        name: '',
        species: '',
        breed: '',
        birthDate: ''
      },
      title: this.titulo,
      appointmentDate: new Date(this.fechaCita).toISOString(),
      notes: this.notas,
      fcmToken: ''
    };

    this.citas.push(nuevaCita);

    // #region localStorage
    const citasGuardadas = JSON.parse(localStorage.getItem('citas') || '{}');
    citasGuardadas[this.mascotaId] = this.citas;
    localStorage.setItem('citas', JSON.stringify(citasGuardadas));

    // Limpiar formulario
    this.titulo = '';
    this.fechaCita = '';
    this.notas = '';

    // Redireccionar
    this.router.navigate(['/mascotas']);
  }

  // Eliminar cita con confirmación
  async eliminarCita(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta cita médica?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.citas.splice(index, 1);
            // #region localStorage
            const citasGuardadas = JSON.parse(localStorage.getItem('citas') || '{}');
            citasGuardadas[this.mascotaId] = this.citas;
            localStorage.setItem('citas', JSON.stringify(citasGuardadas));
          }
        }
      ]
    });

    await alert.present();
  }
}
