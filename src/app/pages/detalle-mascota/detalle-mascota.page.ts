// detalle-mascota.page.ts
// Componente host de los tabs. No necesita lógica porque solo sirve de contenedor

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-detalle-mascota',
  templateUrl: './detalle-mascota.page.html',
  styleUrls: ['./detalle-mascota.page.scss'],
  imports: [IonicModule, RouterModule]
})
export class DetalleMascotaPage {}