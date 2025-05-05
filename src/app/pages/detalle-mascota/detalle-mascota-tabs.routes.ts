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
    path: 'recordatorios',
    loadComponent: () => import('./recordatorios/recordatorios.component').then(m => m.RecordatoriosComponent)

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