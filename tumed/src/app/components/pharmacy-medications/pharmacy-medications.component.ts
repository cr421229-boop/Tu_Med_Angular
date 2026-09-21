import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Medication } from '../../services/models';

const NEW_OPTION = '__nuevo__';

@Component({
  selector: 'tm-pharmacy-medications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacy-medications.component.html',
  styleUrl: './pharmacy-medications.component.css'
})
export class PharmacyMedicationsComponent {
  farmaciaId = '';
  showModal = false;
  error = '';
  toast = '';

  // draft para agregar / editar disponibilidad
  seleccion = NEW_OPTION;
  precio = 0;
  stock = 0;
  nuevoNombre = '';
  nuevoPrincipio = '';
  nuevaCategoria = '';
  nuevaPresentacion = '';
  nuevaReceta = false;
  editingMedId: string | null = null;

  readonly NEW_OPTION = NEW_OPTION;

  constructor(private data: DataService, private auth: AuthService) {
    this.farmaciaId = this.auth.currentUser()?.farmaciaId ?? '';
  }

  get misMedicamentos() {
    return this.data.medications()
      .map(m => ({ med: m, disp: m.disponibilidad.find(d => d.farmaciaId === this.farmaciaId) }))
      .filter(x => !!x.disp);
  }

  get disponiblesParaAgregar(): Medication[] {
    return this.data.medications().filter(m => !m.disponibilidad.some(d => d.farmaciaId === this.farmaciaId));
  }

  openAdd() {
    this.editingMedId = null;
    this.seleccion = this.disponiblesParaAgregar.length ? this.disponiblesParaAgregar[0].id : NEW_OPTION;
    this.precio = 0;
    this.stock = 0;
    this.nuevoNombre = ''; this.nuevoPrincipio = ''; this.nuevaCategoria = ''; this.nuevaPresentacion = ''; this.nuevaReceta = false;
    this.error = '';
    this.showModal = true;
  }

  openEdit(med: Medication) {
    const disp = med.disponibilidad.find(d => d.farmaciaId === this.farmaciaId);
    this.editingMedId = med.id;
    this.precio = disp?.precio ?? 0;
    this.stock = disp?.stock ?? 0;
    this.error = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (this.precio <= 0) { this.error = 'Ingresa un precio válido.'; return; }
    if (this.stock < 0) { this.error = 'La cantidad no puede ser negativa.'; return; }

    if (this.editingMedId) {
      this.data.setAvailabilityForPharmacy(this.editingMedId, this.farmaciaId, this.precio, this.stock);
      this.toast = 'Disponibilidad actualizada.';
    } else if (this.seleccion === NEW_OPTION) {
      if (!this.nuevoNombre || !this.nuevoPrincipio || !this.nuevaCategoria) {
        this.error = 'Completa nombre, principio activo y categoría del nuevo medicamento.';
        return;
      }
      const created = this.data.createMedication({
        nombre: this.nuevoNombre, principioActivo: this.nuevoPrincipio, categoria: this.nuevaCategoria,
        presentacion: this.nuevaPresentacion, requiereReceta: this.nuevaReceta,
        descripcion: 'Agregado por farmacia.', imagen: 'default', disponibilidad: []
      });
      this.data.setAvailabilityForPharmacy(created.id, this.farmaciaId, this.precio, this.stock);
      this.toast = 'Medicamento agregado a tu inventario.';
    } else {
      this.data.setAvailabilityForPharmacy(this.seleccion, this.farmaciaId, this.precio, this.stock);
      this.toast = 'Medicamento agregado a tu inventario.';
    }

    this.error = '';
    this.showModal = false;
    setTimeout(() => this.toast = '', 2200);
  }

  eliminar(med: Medication) {
    if (!confirm(`¿Retirar "${med.nombre}" de tu inventario? El medicamento seguirá disponible en el catálogo general.`)) return;
    this.data.removeAvailabilityForPharmacy(med.id, this.farmaciaId);
    this.toast = 'Medicamento retirado de tu inventario.';
    setTimeout(() => this.toast = '', 2200);
  }
}
