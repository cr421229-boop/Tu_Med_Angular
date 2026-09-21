import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Role, UserAccount } from '../../services/models';

interface DraftUser {
  id: string | null;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  password: string;
  role: Role;
}

function emptyDraft(): DraftUser {
  return { id: null, nombre: '', apellido: '', correo: '', telefono: '', password: '', role: 'usuario' };
}

@Component({
  selector: 'tm-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  query = '';
  roleFilter: 'todos' | Role = 'todos';
  showModal = false;
  draft: DraftUser = emptyDraft();
  error = '';
  toast = '';

  constructor(private data: DataService, private auth: AuthService) {}

  get users(): UserAccount[] {
    const q = this.query.trim().toLowerCase();
    return this.data.users().filter(u => {
      const matchQ = !q || `${u.nombre} ${u.apellido ?? ''} ${u.correo}`.toLowerCase().includes(q);
      const matchRole = this.roleFilter === 'todos' || u.role === this.roleFilter;
      return matchQ && matchRole;
    });
  }

  openCreate() {
    this.draft = emptyDraft();
    this.error = '';
    this.showModal = true;
  }

  openEdit(u: UserAccount) {
    this.draft = {
      id: u.id, nombre: u.nombre, apellido: u.apellido ?? '', correo: u.correo,
      telefono: u.telefono ?? '', password: '', role: u.role
    };
    this.error = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    this.error = '';
    if (!this.draft.nombre || !this.draft.correo) {
      this.error = 'Nombre y correo son obligatorios.';
      return;
    }
    const existing = this.data.findUserByEmail(this.draft.correo);
    if (existing && existing.id !== this.draft.id) {
      this.error = 'Ya existe un usuario con ese correo.';
      return;
    }

    if (this.draft.id) {
      const patch: Partial<UserAccount> = {
        nombre: this.draft.nombre, apellido: this.draft.apellido, correo: this.draft.correo,
        telefono: this.draft.telefono, role: this.draft.role
      };
      if (this.draft.password) patch.password = this.draft.password;
      this.data.updateUser(this.draft.id, patch);
      this.toast = 'Usuario actualizado.';
    } else {
      if (!this.draft.password || this.draft.password.length < 6) {
        this.error = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }
      this.data.createUser({
        nombre: this.draft.nombre, apellido: this.draft.apellido, correo: this.draft.correo,
        telefono: this.draft.telefono, password: this.draft.password, role: this.draft.role
      });
      this.toast = 'Usuario creado.';
    }
    this.showModal = false;
    setTimeout(() => this.toast = '', 2200);
  }

  eliminar(u: UserAccount) {
    if (u.id === this.auth.currentUser()?.id) {
      alert('No puedes eliminar tu propia cuenta mientras tienes la sesión activa.');
      return;
    }
    if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellido ?? ''}?`)) return;
    this.data.deleteUser(u.id);
    this.toast = 'Usuario eliminado.';
    setTimeout(() => this.toast = '', 2200);
  }
}
