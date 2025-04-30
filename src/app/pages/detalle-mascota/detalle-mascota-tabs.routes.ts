import { Routes } from '@angular/router';
import { DetalleMascotaPage } from './detalle-mascota.page';

export const detalleMascotaChildRoutes: Routes = [
  {
    path: ':id', // Aquí se captura el ID de la mascota (por ejemplo /detalle-mascota/0/perfil)
    component: DetalleMascotaPage,
    children: [
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
    ]
  }
];
