import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Medication } from '../../services/models';

@Component({
  selector: 'tm-public-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './public-search.component.html',
  styleUrl: './public-search.component.css'
})
export class PublicSearchComponent {
  query = '';
  all: Medication[];

  constructor(private data: DataService, route: ActivatedRoute) {
    this.all = this.data.medications();
    const q = route.snapshot.queryParamMap.get('q');
    if (q) this.query = q;
  }

  get results(): Medication[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.all;
    return this.all.filter(m =>
      m.nombre.toLowerCase().includes(q) || m.principioActivo.toLowerCase().includes(q) || m.categoria.toLowerCase().includes(q)
    );
  }

  estado(m: Medication) { return this.data.overallAvailability(m); }
  precioDesde(m: Medication) { return this.data.lowestPrice(m); }
}
