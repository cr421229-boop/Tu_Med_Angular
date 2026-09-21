import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'tm-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  nombre = '';
  apellido = '';
  telefono = '';
  guardado = false;

  constructor(public auth: AuthService, private data: DataService) {
    const u = this.auth.currentUser();
    this.nombre = u?.nombre ?? '';
    this.apellido = u?.apellido ?? '';
    this.telefono = u?.telefono ?? '';
  }

  guardar() {
    const u = this.auth.currentUser();
    if (!u) return;
    this.data.updateUser(u.id, { nombre: this.nombre, apellido: this.apellido, telefono: this.telefono });
    this.guardado = true;
    setTimeout(() => this.guardado = false, 2500);
  }
}
