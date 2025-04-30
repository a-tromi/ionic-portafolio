// detalle-mascota-tabs.routes.ts
// Define las rutas hijas para los tabs dentro de detalle-mascota

import { Routes } from '@angular/router';

export const detalleMascotaChildRoutes: Routes = [
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'vacunas',
    loadComponent: () => import('./vacunas/vacunas.component').then(m => m.VacunasComponent)
  },
  {
    path: 'desparasitaciones',
    loadComponent: () => import('./desparasitaciones/desparasitaciones.component').then(m => m.DesparasitacionesComponent)
  },
  {
    path: 'citas-medicas',
    loadComponent: () => import('./citas-medicas/citas-medicas.component').then(m => m.CitasMedicasComponent)
  },
  {
    path: '',
    redirectTo: 'perfil',
    pathMatch: 'full'
  }
];