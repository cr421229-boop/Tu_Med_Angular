import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { Role, UserAccount } from './models';

const SESSION_KEY = 'tumed_session_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserId = signal<string | null>(this.loadSession());

  currentUser = computed<UserAccount | null>(() => {
    const id = this.currentUserId();
    return id ? this.data.getUser(id) ?? null : null;
  });

  isLoggedIn = computed(() => !!this.currentUserId());

  constructor(private data: DataService, private router: Router) {}

  private loadSession(): string | null {
    try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
  }

  login(correo: string, password: string): { ok: true; role: Role } | { ok: false; message: string } {
    const user = this.data.findUserByEmail(correo);
    if (!user || user.password !== password) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' };
    }
    this.currentUserId.set(user.id);
    localStorage.setItem(SESSION_KEY, user.id);
    return { ok: true, role: user.role };
  }

  registerUser(payload: { nombre: string; apellido: string; correo: string; telefono: string; password: string }) {
    if (this.data.findUserByEmail(payload.correo)) {
      return { ok: false as const, message: 'Ya existe una cuenta con ese correo.' };
    }
    const u = this.data.createUser({ role: 'usuario', ...payload });
    this.currentUserId.set(u.id);
    localStorage.setItem(SESSION_KEY, u.id);
    return { ok: true as const };
  }

  registerPharmacy(payload: {
    nombreFarmacia: string; nit: string; correo: string; telefono: string;
    direccion: string; ciudad: string; password: string;
  }) {
    if (this.data.findUserByEmail(payload.correo)) {
      return { ok: false as const, message: 'Ya existe una cuenta con ese correo.' };
    }
    const pharmacy = this.data.createPharmacy({
      nombre: payload.nombreFarmacia, nit: payload.nit, correo: payload.correo,
      telefono: payload.telefono, direccion: payload.direccion, ciudad: payload.ciudad,
      horario: 'Lun a Sáb 8:00 a.m. – 7:00 p.m.', descripcion: 'Farmacia recién registrada en TU MED.',
      imagen: 'default', activa: true
    });
    const u = this.data.createUser({
      role: 'farmacia', nombre: payload.nombreFarmacia, correo: payload.correo,
      telefono: payload.telefono, password: payload.password, farmaciaId: pharmacy.id
    });
    this.currentUserId.set(u.id);
    localStorage.setItem(SESSION_KEY, u.id);
    return { ok: true as const };
  }

  logout() {
    this.currentUserId.set(null);
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/']);
  }

  redirectForRole(role: Role) {
    if (role === 'usuario') this.router.navigate(['/app/inicio']);
    else if (role === 'administrador') this.router.navigate(['/admin/resumen']);
    else this.router.navigate(['/farmacia/info']);
  }

  resetPasswordFor(correo: string, nueva: string): boolean {
    const user = this.data.findUserByEmail(correo);
    if (!user) return false;
    this.data.updateUser(user.id, { password: nueva });
    return true;
  }
}
