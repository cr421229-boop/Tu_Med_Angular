import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  correo = '';
  password = '';
  verPassword = false;
  error = '';
  cargando = false;

  demoAccounts = [
    { label: 'Usuario: camila@correo.com / 123456', correo: 'camila@correo.com', password: '123456' },
    { label: 'Administrador: admin@tumed.com / admin123', correo: 'admin@tumed.com', password: 'admin123' },
    { label: 'Farmacia: contacto@vitalis.com / 123456', correo: 'contacto@vitalis.com', password: '123456' }
  ];

  constructor(private auth: AuthService) {}

  usarDemo(correo: string, password: string) {
    this.correo = correo;
    this.password = password;
  }

  submit() {
    this.error = '';
    if (!this.correo || !this.password) {
      this.error = 'Ingresa tu correo y contraseña.';
      return;
    }
    this.cargando = true;
    const res = this.auth.login(this.correo, this.password);
    this.cargando = false;
    if (!res.ok) {
      this.error = res.message;
      return;
    }
    this.auth.redirectForRole(res.role);
  }
}
