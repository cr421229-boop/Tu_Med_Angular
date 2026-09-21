import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Medication } from '../../services/models';
import { ResaltarDisponibilidadDirective } from '../../directives/resaltar-disponibilidad.directive';

@Component({
  selector: 'tm-user-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ResaltarDisponibilidadDirective],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent {
  query = '';
  categoria = 'todas';
  toast = '';

  constructor(private data: DataService, private auth: AuthService) {}

  get categorias(): string[] {
    return ['todas', ...new Set(this.data.medications().map(m => m.categoria))];
  }

  get results(): Medication[] {
    const q = this.query.trim().toLowerCase();
    return this.data.medications().filter(m => {
      const matchQ = !q || m.nombre.toLowerCase().includes(q) || m.principioActivo.toLowerCase().includes(q);
      const matchCat = this.categoria === 'todas' || m.categoria === this.categoria;
      return matchQ && matchCat;
    });
  }

  estado(m: Medication) { return this.data.overallAvailability(m); }
  precioDesde(m: Medication) { return this.data.lowestPrice(m); }

  guardar(m: Medication) {
    const user = this.auth.currentUser();
    if (!user) return;
    this.data.addMyMedication(user.id, m.id, 1);
    this.toast = `${m.nombre} se agregó a Mis medicamentos.`;
    setTimeout(() => this.toast = '', 2500);
  }
}
