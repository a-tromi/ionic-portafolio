import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './vacunas.component.html',
  styleUrls: ['./vacunas.component.scss']
})
export class VacunasComponent {
  // 🔗 Inyección del servicio de rutas para obtener parámetros desde la URL
  route = inject(ActivatedRoute);

  // ID de la mascota actual desde la URL
  mascotaId!: string;

  // Arreglo de vacunas asociadas a esta mascota
  vacunas: any[] = [];

  // Controla visibilidad de los selectores de fecha (calendarios)
  mostrarCalendarioAplicada = false;
  mostrarCalendarioProxima = false;

  // Objeto modelo para el formulario
  nuevaVacuna = this.getNuevaVacunaInicial();

  constructor(
    private alertController: AlertController,
    private router: Router // Agregado para redirigir al guardar
  ) {}

  // Estructura base del formulario (se reutiliza al limpiar)
  getNuevaVacunaInicial() {
    return {
      vaccineName: '',
      description: '',
      dateGiven: '',
      nextDueDate: '',
      multiDose: false,
      doseNumber: 1,
      totalDoses: 1,
      notes: '',
      veterinarianName: ''
    };
  }

  // Al cargar el componente, se obtiene el ID de mascota y sus vacunas
  ngOnInit() {
    this.mascotaId = this.route.parent?.snapshot.params['id'];
    console.log('ID de mascota:', this.mascotaId);

    // #region localStorage
    const vacunasGuardadas = JSON.parse(localStorage.getItem('vacunas') || '{}');
    this.vacunas = vacunasGuardadas[this.mascotaId] || [];
  }

  // Guardar nueva vacuna en memoria y en localStorage
  guardarVacuna() {
    const vacunaCopia = { ...this.nuevaVacuna };

    // Agrega la vacuna a la lista local
    this.vacunas.push(vacunaCopia);

    // Actualiza en localStorage (por ID de mascota)
    const vacunasGuardadas = JSON.parse(localStorage.getItem('vacunas') || '{}');
    vacunasGuardadas[this.mascotaId] = this.vacunas;
    localStorage.setItem('vacunas', JSON.stringify(vacunasGuardadas));

    // Limpia el formulario
    this.nuevaVacuna = this.getNuevaVacunaInicial();

    console.log('Vacuna guardada:', vacunaCopia);

    // Redirige automáticamente a la lista de mascotas
    this.router.navigate(['/mascotas']);
  }

  // Elimina una vacuna con alerta de confirmación
  async eliminarVacuna(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta vacuna?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Quita del arreglo local
            this.vacunas.splice(index, 1);

            // #region localStorage
            // Actualiza localStorage
            const vacunasGuardadas = JSON.parse(localStorage.getItem('vacunas') || '{}');
            vacunasGuardadas[this.mascotaId] = this.vacunas;
            localStorage.setItem('vacunas', JSON.stringify(vacunasGuardadas));
          }
        }
      ]
    });

    await alert.present();
  }
}
