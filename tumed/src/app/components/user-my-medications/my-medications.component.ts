import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-my-medications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-medications.component.html',
  styleUrl: './my-medications.component.css'
})
export class MyMedicationsComponent {
  editingId: string | null = null;
  editQty = 1;
  toast = '';

  constructor(private data: DataService, private auth: AuthService) {}

  private get userId() { return this.auth.currentUser()?.id ?? ''; }

  get items() {
    return this.data.myMedications(this.userId).map(i => ({ item: i, med: this.data.getMedication(i.medicamentoId) }));
  }

  startEdit(id: string, current: number) {
    this.editingId = id;
    this.editQty = current;
  }

  cancelEdit() { this.editingId = null; }

  saveEdit(itemId: string) {
    if (this.editQty < 1) this.editQty = 1;
    this.data.updateMyMedicationQty(this.userId, itemId, this.editQty);
    this.editingId = null;
    this.toast = 'Cantidad actualizada.';
    setTimeout(() => this.toast = '', 2000);
  }

  eliminar(itemId: string) {
    if (!confirm('¿Eliminar este medicamento de tu lista?')) return;
    this.data.removeMyMedication(this.userId, itemId);
    this.toast = 'Medicamento eliminado.';
    setTimeout(() => this.toast = '', 2000);
  }
}
