import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Pharmacy } from '../../services/models';

interface DraftPharmacy {
  id: string | null;
  nombre: string;
  nit: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  horario: string;
  descripcion: string;
  activa: boolean;
}

function emptyDraft(): DraftPharmacy {
  return { id: null, nombre: '', nit: '', correo: '', telefono: '', direccion: '', ciudad: '', horario: '', descripcion: '', activa: true };
}

@Component({
  selector: 'tm-admin-pharmacies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pharmacies.component.html',
  styleUrl: './admin-pharmacies.component.css'
})
export class AdminPharmaciesComponent {
  query = '';
  showModal = false;
  draft: DraftPharmacy = emptyDraft();
  error = '';
  toast = '';

  constructor(private data: DataService) {}

  get pharmacies(): Pharmacy[] {
    const q = this.query.trim().toLowerCase();
    return this.data.pharmacies().filter(p => !q || p.nombre.toLowerCase().includes(q) || p.ciudad.toLowerCase().includes(q));
  }

  openCreate() {
    this.draft = emptyDraft();
    this.error = '';
    this.showModal = true;
  }

  openEdit(p: Pharmacy) {
    this.draft = { ...p };
    this.error = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.draft.nombre || !this.draft.nit || !this.draft.correo || !this.draft.ciudad) {
      this.error = 'Nombre, NIT, correo y ciudad son obligatorios.';
      return;
    }
    this.error = '';
    const payload = {
      nombre: this.draft.nombre, nit: this.draft.nit, correo: this.draft.correo, telefono: this.draft.telefono,
      direccion: this.draft.direccion, ciudad: this.draft.ciudad,
      horario: this.draft.horario || 'Lun a Sáb 8:00 a.m. – 7:00 p.m.',
      descripcion: this.draft.descripcion, activa: this.draft.activa
    };
    if (this.draft.id) {
      this.data.updatePharmacy(this.draft.id, payload);
      this.toast = 'Farmacia actualizada.';
    } else {
      this.data.createPharmacy({ ...payload, imagen: 'default' });
      this.toast = 'Farmacia creada.';
    }
    this.showModal = false;
    setTimeout(() => this.toast = '', 2200);
  }

  eliminar(p: Pharmacy) {
    if (!confirm(`¿Eliminar la farmacia "${p.nombre}"? Se perderá su información de disponibilidad.`)) return;
    this.data.deletePharmacy(p.id);
    this.toast = 'Farmacia eliminada.';
    setTimeout(() => this.toast = '', 2200);
  }
}
