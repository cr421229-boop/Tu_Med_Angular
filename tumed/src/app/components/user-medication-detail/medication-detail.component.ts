import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Medication } from '../../services/models';
import { ResaltarDisponibilidadDirective } from '../../directives/resaltar-disponibilidad.directive';

@Component({
  selector: 'tm-medication-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ResaltarDisponibilidadDirective],
  templateUrl: './medication-detail.component.html',
  styleUrl: './medication-detail.component.css'
})
export class MedicationDetailComponent {
  med: Medication | undefined;
  toast = '';

  constructor(route: ActivatedRoute, private data: DataService, private auth: AuthService) {
    const id = route.snapshot.paramMap.get('id')!;
    this.med = this.data.getMedication(id);
  }

  farmacia(id: string) { return this.data.getPharmacy(id); }

  guardar() {
    const user = this.auth.currentUser();
    if (!user || !this.med) return;
    this.data.addMyMedication(user.id, this.med.id, 1);
    this.toast = 'Se agregó a Mis medicamentos.';
    setTimeout(() => this.toast = '', 2500);
  }
}
