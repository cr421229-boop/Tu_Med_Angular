import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Pharmacy } from '../../services/models';

@Component({
  selector: 'tm-pharmacy-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pharmacy-detail.component.html',
  styleUrl: './pharmacy-detail.component.css'
})
export class UserPharmacyDetailComponent {
  pharmacy: Pharmacy | undefined;

  constructor(route: ActivatedRoute, private data: DataService) {
    const id = route.snapshot.paramMap.get('id')!;
    this.pharmacy = this.data.getPharmacy(id);
  }

  get medicamentos() {
    if (!this.pharmacy) return [];
    return this.data.medications()
      .map(m => ({ med: m, disp: m.disponibilidad.find(d => d.farmaciaId === this.pharmacy!.id) }))
      .filter(x => !!x.disp);
  }
}
