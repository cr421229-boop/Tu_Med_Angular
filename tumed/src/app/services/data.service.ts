import { Injectable, signal } from '@angular/core';
import {
  Medication, Pharmacy, Offer, UserAccount, MyMedicationItem, Disponibilidad
} from './models';

const STORAGE_KEY = 'tumed_db_v1';

interface Db {
  users: UserAccount[];
  pharmacies: Pharmacy[];
  medications: Medication[];
  offers: Offer[];
  myMedications: Record<string, MyMedicationItem[]>; // por userId
}

function uid(prefix: string): string {
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}

function seed(): Db {
  const pharmacies: Pharmacy[] = [
    {
      id: 'ph_1', nombre: 'Farmacia Vitalis', nit: '900.123.456-1',
      correo: 'contacto@vitalis.com', telefono: '(604) 444-2010',
      direccion: 'Cra 43A #10-25, El Poblado', ciudad: 'Medellín',
      horario: 'Lun a Sáb 7:00 a.m. – 9:00 p.m.',
      descripcion: 'Farmacia de barrio con más de 15 años de servicio, especializada en atención personalizada y medicamentos de fórmula continua.',
      imagen: 'vitalis', activa: true
    },
    {
      id: 'ph_2', nombre: 'Droguería San Rafael', nit: '900.234.567-2',
      correo: 'info@sanrafael.com', telefono: '(604) 511-3344',
      direccion: 'Calle 33 #74-18, Laureles', ciudad: 'Medellín',
      horario: 'Todos los días 6:00 a.m. – 11:00 p.m.',
      descripcion: 'Droguería 24/7 con servicio a domicilio y sección de dermocosmética.',
      imagen: 'sanrafael', activa: true
    },
    {
      id: 'ph_3', nombre: 'Farmacia Central Bogotá', nit: '900.345.678-3',
      correo: 'ventas@farmacentral.com', telefono: '(601) 745-9021',
      direccion: 'Av. Caracas #45-12, Chapinero', ciudad: 'Bogotá',
      horario: 'Lun a Dom 8:00 a.m. – 10:00 p.m.',
      descripcion: 'Amplio inventario de medicamentos especializados y atención con químico farmacéutico permanente.',
      imagen: 'central', activa: true
    }
  ];

  const medications: Medication[] = [
    {
      id: 'med_1', nombre: 'Acetaminofén 500mg', principioActivo: 'Acetaminofén',
      categoria: 'Analgésicos', presentacion: 'Caja x 20 tabletas', requiereReceta: false,
      descripcion: 'Indicado para el alivio del dolor leve a moderado y la fiebre.',
      imagen: 'acetaminofen',
      disponibilidad: [
        { farmaciaId: 'ph_1', precio: 8900, stock: 42, disponibilidad: 'disponible' },
        { farmaciaId: 'ph_2', precio: 8500, stock: 6, disponibilidad: 'bajo-stock' },
        { farmaciaId: 'ph_3', precio: 9200, stock: 0, disponibilidad: 'agotado' }
      ]
    },
    {
      id: 'med_2', nombre: 'Ibuprofeno 400mg', principioActivo: 'Ibuprofeno',
      categoria: 'Antiinflamatorios', presentacion: 'Caja x 10 tabletas', requiereReceta: false,
      descripcion: 'Antiinflamatorio no esteroideo utilizado para dolor, inflamación y fiebre.',
      imagen: 'ibuprofeno',
      disponibilidad: [
        { farmaciaId: 'ph_1', precio: 7300, stock: 30, disponibilidad: 'disponible' },
        { farmaciaId: 'ph_2', precio: 6900, stock: 18, disponibilidad: 'disponible' }
      ]
    },
    {
      id: 'med_3', nombre: 'Loratadina 10mg', principioActivo: 'Loratadina',
      categoria: 'Antialérgicos', presentacion: 'Caja x 10 tabletas', requiereReceta: false,
      descripcion: 'Antihistamínico para el alivio de síntomas de alergia como rinitis y urticaria.',
      imagen: 'loratadina',
      disponibilidad: [
        { farmaciaId: 'ph_2', precio: 6200, stock: 25, disponibilidad: 'disponible' },
        { farmaciaId: 'ph_3', precio: 6700, stock: 4, disponibilidad: 'bajo-stock' }
      ]
    },
    {
      id: 'med_4', nombre: 'Amoxicilina 500mg', principioActivo: 'Amoxicilina',
      categoria: 'Antibióticos', presentacion: 'Caja x 15 cápsulas', requiereReceta: true,
      descripcion: 'Antibiótico de amplio espectro. Requiere fórmula médica vigente.',
      imagen: 'amoxicilina',
      disponibilidad: [
        { farmaciaId: 'ph_1', precio: 21500, stock: 12, disponibilidad: 'disponible' },
        { farmaciaId: 'ph_3', precio: 22900, stock: 0, disponibilidad: 'agotado' }
      ]
    },
    {
      id: 'med_5', nombre: 'Losartán 50mg', principioActivo: 'Losartán potásico',
      categoria: 'Cardiovascular', presentacion: 'Caja x 30 tabletas', requiereReceta: true,
      descripcion: 'Indicado para el manejo de la hipertensión arterial. Uso continuo bajo supervisión médica.',
      imagen: 'losartan',
      disponibilidad: [
        { farmaciaId: 'ph_2', precio: 18300, stock: 40, disponibilidad: 'disponible' },
        { farmaciaId: 'ph_1', precio: 17900, stock: 9, disponibilidad: 'bajo-stock' }
      ]
    },
    {
      id: 'med_6', nombre: 'Omeprazol 20mg', principioActivo: 'Omeprazol',
      categoria: 'Gastrointestinal', presentacion: 'Caja x 14 cápsulas', requiereReceta: false,
      descripcion: 'Inhibidor de bomba de protones para el manejo de acidez y reflujo gástrico.',
      imagen: 'omeprazol',
      disponibilidad: [
        { farmaciaId: 'ph_3', precio: 12400, stock: 22, disponibilidad: 'disponible' },
        { farmaciaId: 'ph_1', precio: 11900, stock: 15, disponibilidad: 'disponible' }
      ]
    }
  ];

  const offers: Offer[] = [
    {
      id: 'off_1', medicamentoId: 'med_1', farmaciaId: 'ph_1',
      titulo: '20% off en Acetaminofén 500mg', descuento: 20,
      precioOriginal: 8900, precioOferta: 7120, vigenciaHasta: '2026-09-30', activa: true
    },
    {
      id: 'off_2', medicamentoId: 'med_6', farmaciaId: 'ph_3',
      titulo: 'Segunda unidad al 50% en Omeprazol', descuento: 25,
      precioOriginal: 12400, precioOferta: 9300, vigenciaHasta: '2026-09-15', activa: true
    },
    {
      id: 'off_3', medicamentoId: 'med_3', farmaciaId: 'ph_2',
      titulo: '15% off en antialérgicos', descuento: 15,
      precioOriginal: 6200, precioOferta: 5270, vigenciaHasta: '2026-09-20', activa: true
    }
  ];

  const users: UserAccount[] = [
    {
      id: 'u_admin', role: 'administrador', nombre: 'Admin', apellido: 'TU MED',
      correo: 'admin@tumed.com', password: 'admin123', fechaRegistro: '2026-01-01'
    },
    {
      id: 'u_1', role: 'usuario', nombre: 'Camila', apellido: 'Restrepo',
      correo: 'camila@correo.com', telefono: '3001234567', password: '123456',
      fechaRegistro: '2026-02-10'
    },
    {
      id: 'u_ph1', role: 'farmacia', nombre: 'Farmacia Vitalis', correo: 'contacto@vitalis.com',
      telefono: '(604) 444-2010', password: '123456', farmaciaId: 'ph_1', fechaRegistro: '2026-01-15'
    }
  ];

  return {
    users, pharmacies, medications, offers,
    myMedications: { u_1: [{ id: 'mm_1', medicamentoId: 'med_1', cantidad: 2, notas: 'Botiquín de casa' }] }
  };
}

function load(): Db {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch { /* ignore corrupted storage */ }
  const s = seed();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  return s;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private db = signal<Db>(load());

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db()));
  }

  // ---------- Lecturas reactivas ----------
  users = () => this.db().users;
  pharmacies = () => this.db().pharmacies;
  medications = () => this.db().medications;
  offers = () => this.db().offers;

  getPharmacy(id: string) { return this.db().pharmacies.find(p => p.id === id); }
  getMedication(id: string) { return this.db().medications.find(m => m.id === id); }
  getOffer(id: string) { return this.db().offers.find(o => o.id === id); }
  getUser(id: string) { return this.db().users.find(u => u.id === id); }
  findUserByEmail(correo: string) {
    return this.db().users.find(u => u.correo.toLowerCase() === correo.toLowerCase());
  }

  overallAvailability(med: Medication): Disponibilidad {
    if (med.disponibilidad.some(d => d.disponibilidad === 'disponible')) return 'disponible';
    if (med.disponibilidad.some(d => d.disponibilidad === 'bajo-stock')) return 'bajo-stock';
    return 'agotado';
  }

  lowestPrice(med: Medication): number | null {
    const vals = med.disponibilidad.filter(d => d.disponibilidad !== 'agotado').map(d => d.precio);
    if (!vals.length) return null;
    return Math.min(...vals);
  }

  // ---------- Usuarios ----------
  createUser(u: Omit<UserAccount, 'id' | 'fechaRegistro'>): UserAccount {
    const nu: UserAccount = { ...u, id: uid('u'), fechaRegistro: new Date().toISOString().slice(0, 10) };
    this.db.update(d => ({ ...d, users: [...d.users, nu] }));
    this.persist();
    return nu;
  }
  updateUser(id: string, patch: Partial<UserAccount>) {
    this.db.update(d => ({ ...d, users: d.users.map(u => u.id === id ? { ...u, ...patch } : u) }));
    this.persist();
  }
  deleteUser(id: string) {
    this.db.update(d => ({ ...d, users: d.users.filter(u => u.id !== id) }));
    this.persist();
  }

  // ---------- Farmacias ----------
  createPharmacy(p: Omit<Pharmacy, 'id'>): Pharmacy {
    const np: Pharmacy = { ...p, id: uid('ph') };
    this.db.update(d => ({ ...d, pharmacies: [...d.pharmacies, np] }));
    this.persist();
    return np;
  }
  updatePharmacy(id: string, patch: Partial<Pharmacy>) {
    this.db.update(d => ({ ...d, pharmacies: d.pharmacies.map(p => p.id === id ? { ...p, ...patch } : p) }));
    this.persist();
  }
  deletePharmacy(id: string) {
    this.db.update(d => ({ ...d, pharmacies: d.pharmacies.filter(p => p.id !== id) }));
    this.persist();
  }

  // ---------- Medicamentos ----------
  createMedication(m: Omit<Medication, 'id'>): Medication {
    const nm: Medication = { ...m, id: uid('med') };
    this.db.update(d => ({ ...d, medications: [...d.medications, nm] }));
    this.persist();
    return nm;
  }
  updateMedication(id: string, patch: Partial<Medication>) {
    this.db.update(d => ({ ...d, medications: d.medications.map(m => m.id === id ? { ...m, ...patch } : m) }));
    this.persist();
  }
  deleteMedication(id: string) {
    this.db.update(d => ({ ...d, medications: d.medications.filter(m => m.id !== id) }));
    this.persist();
  }

  setAvailabilityForPharmacy(medId: string, farmaciaId: string, precio: number, stock: number) {
    const disp: Disponibilidad = stock <= 0 ? 'agotado' : stock <= 8 ? 'bajo-stock' : 'disponible';
    this.db.update(d => ({
      ...d,
      medications: d.medications.map(m => {
        if (m.id !== medId) return m;
        const exists = m.disponibilidad.some(x => x.farmaciaId === farmaciaId);
        const nuevaDisp = exists
          ? m.disponibilidad.map(x => x.farmaciaId === farmaciaId ? { farmaciaId, precio, stock, disponibilidad: disp } : x)
          : [...m.disponibilidad, { farmaciaId, precio, stock, disponibilidad: disp }];
        return { ...m, disponibilidad: nuevaDisp };
      })
    }));
    this.persist();
  }

  removeAvailabilityForPharmacy(medId: string, farmaciaId: string) {
    this.db.update(d => ({
      ...d,
      medications: d.medications.map(m => m.id === medId
        ? { ...m, disponibilidad: m.disponibilidad.filter(x => x.farmaciaId !== farmaciaId) }
        : m)
    }));
    this.persist();
  }

  // ---------- Ofertas ----------
  createOffer(o: Omit<Offer, 'id'>): Offer {
    const no: Offer = { ...o, id: uid('off') };
    this.db.update(d => ({ ...d, offers: [...d.offers, no] }));
    this.persist();
    return no;
  }
  updateOffer(id: string, patch: Partial<Offer>) {
    this.db.update(d => ({ ...d, offers: d.offers.map(o => o.id === id ? { ...o, ...patch } : o) }));
    this.persist();
  }
  deleteOffer(id: string) {
    this.db.update(d => ({ ...d, offers: d.offers.filter(o => o.id !== id) }));
    this.persist();
  }

  // ---------- Mis medicamentos ----------
  myMedications(userId: string): MyMedicationItem[] {
    return this.db().myMedications[userId] ?? [];
  }
  addMyMedication(userId: string, medicamentoId: string, cantidad: number, notas?: string) {
    this.db.update(d => {
      const list = d.myMedications[userId] ?? [];
      const existing = list.find(i => i.medicamentoId === medicamentoId);
      const updated = existing
        ? list.map(i => i.medicamentoId === medicamentoId ? { ...i, cantidad: i.cantidad + cantidad } : i)
        : [...list, { id: uid('mm'), medicamentoId, cantidad, notas }];
      return { ...d, myMedications: { ...d.myMedications, [userId]: updated } };
    });
    this.persist();
  }
  updateMyMedicationQty(userId: string, itemId: string, cantidad: number) {
    this.db.update(d => ({
      ...d,
      myMedications: {
        ...d.myMedications,
        [userId]: (d.myMedications[userId] ?? []).map(i => i.id === itemId ? { ...i, cantidad } : i)
      }
    }));
    this.persist();
  }
  removeMyMedication(userId: string, itemId: string) {
    this.db.update(d => ({
      ...d,
      myMedications: { ...d.myMedications, [userId]: (d.myMedications[userId] ?? []).filter(i => i.id !== itemId) }
    }));
    this.persist();
  }
}
