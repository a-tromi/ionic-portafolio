import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // ✅ Importamos IonicModule
import { CommonModule } from '@angular/common'; // ✅ También CommonModule por buenas prácticas

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [IonicModule, CommonModule], // ✅ Agregamos los módulos aquí
  templateUrl: './vacunas.component.html',
  styleUrls: ['./vacunas.component.scss']
})
export class VacunasComponent {
  // Por ahora no necesitas lógica especial aquí
}
