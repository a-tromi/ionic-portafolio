import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './vacunas.component.html',
  styleUrls: ['./vacunas.component.scss']
})
export class VacunasComponent {
  route = inject(ActivatedRoute);
  mascotaId!: string;

  vacunas = [
    {
      vaccineName: "Vacuna Antirabica",
      description: "Protección contra la rabia",
      dateGiven: "2025-04-20",
      nextDueDate: "2026-04-20",
      multiDose: false,
      doseNumber: 1,
      totalDoses: 1,
      notes: "Dosis anual",
      veterinarianName: "Dr. Martínez"
    }
  ];

  ngOnInit() {
    this.mascotaId = this.route.parent?.snapshot.params['id'];
    console.log('ID de mascota:', this.mascotaId);
    // Aquí se pueden cargar las vacunas reales desde un servicio si las tienes guardadas por ID
  }
}
