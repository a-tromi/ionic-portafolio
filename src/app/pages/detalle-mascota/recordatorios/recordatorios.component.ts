import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class RecordatoriosComponent implements OnInit {
  // Inyección del servicio de alertas de Ionic
  private alertController = inject(AlertController);

  // Lista de fechas importantes mostradas
  fechasImportantes: any[] = [];

  // Muestra u oculta el selector de fecha
  mostrarSelectorFecha: boolean = false;

  // Modelo de datos del formulario
  nuevoRecordatorio = {
    name: '',
    date: '',
    description: '',
    species: {
      id: 1,
      name: 'Perro' // valor por defecto
    }
  };

  // Al iniciar el componente, carga datos desde localStorage
  ngOnInit(): void {
    const almacenadas = localStorage.getItem('fechasImportantes');
    this.fechasImportantes = almacenadas ? JSON.parse(almacenadas) : [];
  }

  // Al seleccionar fecha desde el calendario
  seleccionarFecha(event: any) {
    const fecha = new Date(event.detail.value);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    this.nuevoRecordatorio.date = `${mes}-${dia}`; // formato MM-DD como pide backend
    this.mostrarSelectorFecha = false;
  }

  // Guarda el recordatorio en localStorage
  guardarRecordatorio() {
    if (!this.nuevoRecordatorio.name || !this.nuevoRecordatorio.date) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    const nuevo = {
      ...this.nuevoRecordatorio,
      species: {
        id: this.nuevoRecordatorio.species.id,
        name: this.nuevoRecordatorio.species.id === 1 ? 'Perro' : 'Gato'
      }
    };

    this.fechasImportantes.push(nuevo);
    localStorage.setItem('fechasImportantes', JSON.stringify(this.fechasImportantes));

    // Reset del formulario
    this.nuevoRecordatorio = {
      name: '',
      date: '',
      description: '',
      species: {
        id: 1,
        name: 'Perro'
      }
    };
  }

  // Elimina un recordatorio con confirmación
  async eliminarRecordatorio(index: number) {
    const alerta = await this.alertController.create({
      header: 'Eliminar recordatorio',
      message: '¿Deseas eliminar esta fecha importante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.fechasImportantes.splice(index, 1);
            localStorage.setItem('fechasImportantes', JSON.stringify(this.fechasImportantes));
          }
        }
      ]
    });

    await alerta.present();
  }
}
