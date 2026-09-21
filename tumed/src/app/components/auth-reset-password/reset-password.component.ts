import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  correo = '';
  nueva = '';
  confirmar = '';
  error = '';
  hecho = false;

  constructor(private auth: AuthService, private router: Router) {}

  cambiar() {
    this.error = '';
    if (!this.correo) { this.error = 'Ingresa el correo de tu cuenta.'; return; }
    if (this.nueva.length < 6) { this.error = 'La contraseña debe tener al menos 6 caracteres.'; return; }
    if (this.nueva !== this.confirmar) { this.error = 'Las contraseñas no coinciden.'; return; }

    const ok = this.auth.resetPasswordFor(this.correo, this.nueva);
    if (!ok) { this.error = 'No encontramos una cuenta con ese correo.'; return; }
    this.hecho = true;
  }
}
