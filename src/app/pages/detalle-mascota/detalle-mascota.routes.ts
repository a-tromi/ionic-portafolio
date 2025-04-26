import { Routes } from '@angular/router';
import { DetalleMascotaPage } from './detalle-mascota.page';
import { PerfilComponent } from './perfil/perfil.component';
import { VacunasComponent } from './vacunas/vacunas.component';
import { DesparasitacionesComponent } from './desparasitaciones/desparasitaciones.component';
import { CitasMedicasComponent } from './citas-medicas/citas-medicas.component';

export const routes: Routes = [
  {
    path: '',
    component: DetalleMascotaPage,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'vacunas',
        component: VacunasComponent,
      },
      {
        path: 'desparasitaciones',
        component: DesparasitacionesComponent,
      },
      {
        path: 'citas-medicas',
        component: CitasMedicasComponent,
      },
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      }
    ]
  }
];
