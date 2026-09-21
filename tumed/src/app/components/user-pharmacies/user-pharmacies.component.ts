import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'tm-user-pharmacies',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-pharmacies.component.html',
  styleUrl: './user-pharmacies.component.css'
})
export class UserPharmaciesComponent {
  query = '';

  constructor(private data: DataService) {}

  get pharmacies() {
    const q = this.query.trim().toLowerCase();
    return this.data.pharmacies().filter(p =>
      p.activa && (!q || p.nombre.toLowerCase().includes(q) || p.ciudad.toLowerCase().includes(q))
    );
  }

  medicationCount(pharmacyId: string) {
    return this.data.medications().filter(m => m.disponibilidad.some(d => d.farmaciaId === pharmacyId)).length;
  }
}
