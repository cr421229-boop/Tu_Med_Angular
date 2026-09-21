import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PharmacyNavComponent } from '../pharmacy-nav/pharmacy-nav.component';

@Component({
  selector: 'tm-pharmacy-layout',
  standalone: true,
  imports: [RouterOutlet, PharmacyNavComponent],
  templateUrl: './pharmacy-layout.component.html',
  styleUrl: './pharmacy-layout.component.css'
})
export class PharmacyLayoutComponent {}
