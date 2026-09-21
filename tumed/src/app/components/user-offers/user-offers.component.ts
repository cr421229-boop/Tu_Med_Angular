import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-user-offers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-offers.component.html',
  styleUrl: './user-offers.component.css'
})
export class UserOffersComponent {
  toast = '';

  constructor(private data: DataService, private auth: AuthService) {}

  get offers() {
    return this.data.offers().filter(o => o.activa);
  }

  medicamento(id: string) { return this.data.getMedication(id); }
  farmacia(id: string) { return this.data.getPharmacy(id); }

  guardar(medId: string) {
    const user = this.auth.currentUser();
    if (!user) return;
    this.data.addMyMedication(user.id, medId, 1);
    this.toast = 'Se agregó a Mis medicamentos.';
    setTimeout(() => this.toast = '', 2500);
  }
}
