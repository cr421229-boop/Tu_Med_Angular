import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Offer } from '../../services/models';

interface DraftOffer {
  id: string | null;
  medicamentoId: string;
  farmaciaId: string;
  titulo: string;
  descuento: number;
  precioOriginal: number;
  vigenciaHasta: string;
  activa: boolean;
}

function emptyDraft(): DraftOffer {
  return { id: null, medicamentoId: '', farmaciaId: '', titulo: '', descuento: 10, precioOriginal: 0, vigenciaHasta: '', activa: true };
}

@Component({
  selector: 'tm-admin-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-offers.component.html',
  styleUrl: './admin-offers.component.css'
})
export class AdminOffersComponent {
  showModal = false;
  draft: DraftOffer = emptyDraft();
  error = '';
  toast = '';

  constructor(public data: DataService) {}

  get offers(): Offer[] { return this.data.offers(); }
  get medications() { return this.data.medications(); }
  get pharmacies() { return this.data.pharmacies(); }

  medNombre(id: string) { return this.data.getMedication(id)?.nombre ?? '—'; }
  phNombre(id: string) { return this.data.getPharmacy(id)?.nombre ?? '—'; }

  openCreate() {
    this.draft = emptyDraft();
    if (this.medications.length) this.draft.medicamentoId = this.medications[0].id;
    if (this.pharmacies.length) this.draft.farmaciaId = this.pharmacies[0].id;
    this.error = '';
    this.showModal = true;
  }

  openEdit(o: Offer) {
    this.draft = {
      id: o.id, medicamentoId: o.medicamentoId, farmaciaId: o.farmaciaId, titulo: o.titulo,
      descuento: o.descuento, precioOriginal: o.precioOriginal, vigenciaHasta: o.vigenciaHasta, activa: o.activa
    };
    this.error = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.draft.titulo || !this.draft.medicamentoId || !this.draft.farmaciaId || !this.draft.precioOriginal) {
      this.error = 'Completa medicamento, farmacia, título y precio original.';
      return;
    }
    this.error = '';
    const precioOferta = Math.round(this.draft.precioOriginal * (1 - this.draft.descuento / 100));
    const payload = {
      medicamentoId: this.draft.medicamentoId, farmaciaId: this.draft.farmaciaId, titulo: this.draft.titulo,
      descuento: this.draft.descuento, precioOriginal: this.draft.precioOriginal, precioOferta,
      vigenciaHasta: this.draft.vigenciaHasta, activa: this.draft.activa
    };
    if (this.draft.id) {
      this.data.updateOffer(this.draft.id, payload);
      this.toast = 'Oferta actualizada.';
    } else {
      this.data.createOffer(payload);
      this.toast = 'Oferta creada.';
    }
    this.showModal = false;
    setTimeout(() => this.toast = '', 2200);
  }

  eliminar(o: Offer) {
    if (!confirm(`¿Eliminar la oferta "${o.titulo}"?`)) return;
    this.data.deleteOffer(o.id);
    this.toast = 'Oferta eliminada.';
    setTimeout(() => this.toast = '', 2200);
  }
}
