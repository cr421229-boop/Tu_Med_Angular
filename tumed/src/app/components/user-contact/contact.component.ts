import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  asunto = '';
  mensaje = '';
  enviado = false;

  constructor(public auth: AuthService) {}

  enviar() {
    if (!this.asunto || !this.mensaje) return;
    this.enviado = true;
    setTimeout(() => { this.enviado = false; this.asunto = ''; this.mensaje = ''; }, 3000);
  }
}
