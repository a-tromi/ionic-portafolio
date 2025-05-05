import { Routes } from '@angular/router';
import { DetalleMascotaPage } from './detalle-mascota.page';
import { PerfilComponent } from './perfil/perfil.component';
import { VacunasComponent } from './vacunas/vacunas.component';
import { CitasMedicasComponent } from './citas-medicas/citas-medicas.component';
import { RecordatoriosComponent } from './recordatorios/recordatorios.component';

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
        path: 'citas-medicas',
        component: CitasMedicasComponent,
      },
      {
        path: 'recordatorios',
        component: RecordatoriosComponent
      },      
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full'
      }
    ]
  }
];
