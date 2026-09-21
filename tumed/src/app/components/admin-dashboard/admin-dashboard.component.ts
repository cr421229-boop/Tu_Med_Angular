import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'tm-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(public data: DataService) {}

  get totalUsuarios() { return this.data.users().filter(u => u.role === 'usuario').length; }
  get totalFarmacias() { return this.data.pharmacies().length; }
  get totalMedicamentos() { return this.data.medications().length; }
  get totalOfertas() { return this.data.offers().filter(o => o.activa).length; }

  get agotados() {
    return this.data.medications().filter(m => this.data.overallAvailability(m) === 'agotado');
  }

  get ultimosUsuarios() {
    return [...this.data.users()].sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro)).slice(0, 5);
  }
}
