import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { detalleMascotaChildRoutes } from './pages/detalle-mascota/detalle-mascota-tabs.routes'; // 👈 Import correcto para los tabs

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)    
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },

  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule)
  },

  {
    path: 'detalle-mascota/:id',
    children: detalleMascotaChildRoutes
  },

  {
    path: 'detalle-mascota/nueva',
    loadComponent: () => import('./pages/detalle-mascota/perfil/perfil.component').then(m => m.PerfilComponent)
  },  

  {
    path: 'mascotas',
    loadComponent: () => import('./pages/mascotas/mascotas.page').then(m => m.MascotasPage)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
