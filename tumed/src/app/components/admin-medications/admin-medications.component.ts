import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Medication } from '../../services/models';

interface DraftMed {
  id: string | null;
  nombre: string;
  principioActivo: string;
  categoria: string;
  presentacion: string;
  requiereReceta: boolean;
  descripcion: string;
}

function emptyDraft(): DraftMed {
  return { id: null, nombre: '', principioActivo: '', categoria: '', presentacion: '', requiereReceta: false, descripcion: '' };
}

@Component({
  selector: 'tm-admin-medications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-medications.component.html',
  styleUrl: './admin-medications.component.css'
})
export class AdminMedicationsComponent {
  query = '';
  showModal = false;
  draft: DraftMed = emptyDraft();
  error = '';
  toast = '';

  constructor(private data: DataService) {}

  get medications(): Medication[] {
    const q = this.query.trim().toLowerCase();
    return this.data.medications().filter(m => !q || m.nombre.toLowerCase().includes(q) || m.categoria.toLowerCase().includes(q));
  }

  estado(m: Medication) { return this.data.overallAvailability(m); }

  openCreate() {
    this.draft = emptyDraft();
    this.error = '';
    this.showModal = true;
  }

  openEdit(m: Medication) {
    this.draft = {
      id: m.id, nombre: m.nombre, principioActivo: m.principioActivo, categoria: m.categoria,
      presentacion: m.presentacion, requiereReceta: m.requiereReceta, descripcion: m.descripcion
    };
    this.error = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.draft.nombre || !this.draft.principioActivo || !this.draft.categoria) {
      this.error = 'Nombre, principio activo y categoría son obligatorios.';
      return;
    }
    this.error = '';
    if (this.draft.id) {
      this.data.updateMedication(this.draft.id, {
        nombre: this.draft.nombre, principioActivo: this.draft.principioActivo, categoria: this.draft.categoria,
        presentacion: this.draft.presentacion, requiereReceta: this.draft.requiereReceta, descripcion: this.draft.descripcion
      });
      this.toast = 'Medicamento actualizado.';
    } else {
      this.data.createMedication({
        nombre: this.draft.nombre, principioActivo: this.draft.principioActivo, categoria: this.draft.categoria,
        presentacion: this.draft.presentacion, requiereReceta: this.draft.requiereReceta,
        descripcion: this.draft.descripcion, imagen: 'default', disponibilidad: []
      });
      this.toast = 'Medicamento creado.';
    }
    this.showModal = false;
    setTimeout(() => this.toast = '', 2200);
  }

  eliminar(m: Medication) {
    if (!confirm(`¿Eliminar "${m.nombre}" del catálogo?`)) return;
    this.data.deleteMedication(m.id);
    this.toast = 'Medicamento eliminado.';
    setTimeout(() => this.toast = '', 2200);
  }
}
