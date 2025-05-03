import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // Servicio para obtener el parámetro ID de la mascota desde la URL
  route = inject(ActivatedRoute);

  // ID de la mascota a la que se le registran vacunas
  mascotaId!: string;

  // Arreglo de vacunas asociadas a la mascota
  vacunas: any[] = [];

  // Objeto para el formulario de nueva vacuna
  nuevaVacuna = this.getNuevaVacunaInicial();

    // Controla la visibilidad de los calendarios de fecha
  mostrarCalendarioAplicada = false;
  mostrarCalendarioProxima = false;

  constructor(private alertController: AlertController) {}

  // Función que devuelve un objeto vacío para reiniciar el formulario
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

  // Al iniciar el componente, se extrae el ID de la mascota y se cargan sus vacunas desde localStorage
  ngOnInit() {
    this.mascotaId = this.route.parent?.snapshot.params['id'];
    console.log('ID de mascota:', this.mascotaId);

    const vacunasGuardadas = JSON.parse(localStorage.getItem('vacunas') || '{}');
    this.vacunas = vacunasGuardadas[this.mascotaId] || [];
  }

  // Guarda la nueva vacuna en memoria y en localStorage
  guardarVacuna() {
    const vacunaCopia = { ...this.nuevaVacuna };

    this.vacunas.push(vacunaCopia);

    const vacunasGuardadas = JSON.parse(localStorage.getItem('vacunas') || '{}');
    vacunasGuardadas[this.mascotaId] = this.vacunas;
    localStorage.setItem('vacunas', JSON.stringify(vacunasGuardadas));

    this.nuevaVacuna = this.getNuevaVacunaInicial(); // 🔁 Resetea el formulario

    console.log('Vacuna guardada:', vacunaCopia);
  }

  // Elimina una vacuna con confirmación
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
            this.vacunas.splice(index, 1);

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
