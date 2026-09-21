import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-user-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
  offers;
  savedCount = 0;

  constructor(private data: DataService, public auth: AuthService) {
    this.offers = this.data.offers().filter(o => o.activa).slice(0, 3);
    const user = this.auth.currentUser();
    this.savedCount = user ? this.data.myMedications(user.id).length : 0;
  }

  medNombre(id: string) { return this.data.getMedication(id)?.nombre ?? ''; }
  farmaciaNombre(id: string) { return this.data.getPharmacy(id)?.nombre ?? ''; }
}
