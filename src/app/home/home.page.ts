import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  name: string = '';
  email: string = '';
  foto: string = '../../assets/img/avatar.png';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Cargar datos desde localStorage
    const nombreGuardado = localStorage.getItem('nombreUsuario') || localStorage.getItem('name');
    this.name = nombreGuardado || 'Usuario';
    this.email = localStorage.getItem('emailUsuario') || '';

    const fotoGuardada = localStorage.getItem('fotoUsuario');
    if (fotoGuardada) {
      this.foto = fotoGuardada;
    }
  }

  cerrarSesion() {
    // Borra todos los datos de sesión del usuario
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('name'); // por si acaso se usa desde backend
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('fotoUsuario');
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/login']);
  }
}
