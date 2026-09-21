import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tm-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  correo = '';
  enviado = false;

  enviar() {
    if (!this.correo) return;
    this.enviado = true;
  }
}
