import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Pharmacy } from '../../services/models';

@Component({
  selector: 'tm-pharmacy-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacy-info.component.html',
  styleUrl: './pharmacy-info.component.css'
})
export class PharmacyInfoComponent {
  pharmacy: Pharmacy | undefined;
  editing = false;
  draft!: Pharmacy;
  toast = '';

  constructor(private data: DataService, private auth: AuthService) {
    const user = this.auth.currentUser();
    if (user?.farmaciaId) this.pharmacy = this.data.getPharmacy(user.farmaciaId);
  }

  startEdit() {
    if (!this.pharmacy) return;
    this.draft = { ...this.pharmacy };
    this.editing = true;
  }

  cancel() { this.editing = false; }

  save() {
    if (!this.pharmacy) return;
    this.data.updatePharmacy(this.pharmacy.id, this.draft);
    this.pharmacy = this.data.getPharmacy(this.pharmacy.id);
    this.editing = false;
    this.toast = 'Información de la farmacia actualizada.';
    setTimeout(() => this.toast = '', 2500);
  }
}
