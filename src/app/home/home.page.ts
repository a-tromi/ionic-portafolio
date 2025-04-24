import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  nombre: string = '';
  email: string = '';
  password: string = '';
  foto: string = '../../assets/img/avatar.png';
  hola: string = 'Hola 👋';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.nombre = localStorage.getItem('nombreUsuario') || 'Usuario';
    this.email = localStorage.getItem('emailUsuario') || '';
    const fotoGuardada = localStorage.getItem('fotoUsuario');
    if (fotoGuardada) {
      this.foto = fotoGuardada;
    }
  }

  // 👇 Método para cerrar sesión
  cerrarSesion() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('fotoUsuario');
    this.router.navigate(['/login']);
  }
}
