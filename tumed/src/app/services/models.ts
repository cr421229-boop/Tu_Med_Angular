export type Role = 'usuario' | 'administrador' | 'farmacia';

export interface UserAccount {
  id: string;
  role: Role;
  nombre: string;
  apellido?: string;
  correo: string;
  telefono?: string;
  password: string;
  // Sólo para rol farmacia
  farmaciaId?: string;
  fechaRegistro: string;
}

export interface Pharmacy {
  id: string;
  nombre: string;
  nit: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  horario: string;
  descripcion: string;
  imagen: string;
  activa: boolean;
}

export type Disponibilidad = 'disponible' | 'bajo-stock' | 'agotado';

export interface MedicationAvailability {
  farmaciaId: string;
  precio: number;
  stock: number;
  disponibilidad: Disponibilidad;
}

export interface Medication {
  id: string;
  nombre: string;
  principioActivo: string;
  categoria: string;
  presentacion: string;
  requiereReceta: boolean;
  descripcion: string;
  imagen: string;
  disponibilidad: MedicationAvailability[];
}

export interface Offer {
  id: string;
  medicamentoId: string;
  farmaciaId: string;
  titulo: string;
  descuento: number;
  precioOriginal: number;
  precioOferta: number;
  vigenciaHasta: string;
  activa: boolean;
}

export interface MyMedicationItem {
  id: string;
  medicamentoId: string;
  cantidad: number;
  notas?: string;
}
