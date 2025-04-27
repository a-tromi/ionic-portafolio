import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './citas-medicas.component.html',
  styleUrls: ['./citas-medicas.component.scss']
})
export class CitasMedicasComponent {}

