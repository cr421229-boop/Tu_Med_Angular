import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { Disponibilidad } from '../services/models';

/**
 * Resalta visualmente una tarjeta o fila de medicamento según su estado
 * de disponibilidad ('disponible' | 'bajo-stock' | 'agotado').
 *
 * Uso:
 *   <article class="entity-card" [appResaltarDisponibilidad]="estado">
 *
 * Al pasar el mouse por encima, la tarjeta resalta su borde con el color
 * correspondiente al estado y aplica un leve efecto de escala, para que
 * el usuario identifique rápido qué medicamentos tienen poco stock o
 * están agotados.
 */
@Directive({
  selector: '[appResaltarDisponibilidad]',
  standalone: true
})
export class ResaltarDisponibilidadDirective {

  private el = inject(ElementRef<HTMLElement>);

  // Estado de disponibilidad que determina el color de resaltado
  appResaltarDisponibilidad = input<Disponibilidad>('disponible');

  private readonly colores: Record<Disponibilidad, string> = {
    'disponible': '#2E7D32',
    'bajo-stock': '#B8860B',
    'agotado': '#C0392B'
  };

  constructor() {
    // Deja siempre una pista sutil del estado, incluso sin pasar el mouse
    this.aplicarBorde('1px solid var(--tm-line, #e0e0e0)');
  }

  @HostListener('mouseenter') onMouseEnter() {
    const color = this.colores[this.appResaltarDisponibilidad()] ?? this.colores['disponible'];
    this.aplicarEfecto(`2px solid ${color}`, 'scale(1.02)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.aplicarEfecto('1px solid var(--tm-line, #e0e0e0)', 'scale(1)');
  }

  private aplicarBorde(borde: string) {
    this.el.nativeElement.style.border = borde;
    this.el.nativeElement.style.borderRadius = this.el.nativeElement.style.borderRadius || '8px';
  }

  private aplicarEfecto(borde: string, transformacion: string) {
    this.el.nativeElement.style.border = borde;
    this.el.nativeElement.style.transform = transformacion;
    this.el.nativeElement.style.transition = 'all 0.2s ease-in-out';
  }
}
