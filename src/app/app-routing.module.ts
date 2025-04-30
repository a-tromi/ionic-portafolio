// Configurare las rutas principales de la app, incluyendo los tabs anidados en detalle-mascota

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DetalleMascotaPage } from './pages/detalle-mascota/detalle-mascota.page';
import { detalleMascotaChildRoutes } from './pages/detalle-mascota/detalle-mascota-tabs.routes';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },

  // Rutas hijas para tabs dentro de DetalleMascota
  {
    path: 'detalle-mascota/:id',
    component: DetalleMascotaPage,
    children: detalleMascotaChildRoutes
  },

  // Página de listado de mascotas
  {
    path: 'mascotas',
    loadComponent: () => import('./pages/mascotas/mascotas.page').then(m => m.MascotasPage)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
