import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-pharmacy-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './pharmacy-nav.component.html',
  styleUrl: './pharmacy-nav.component.css'
})
export class PharmacyNavComponent {
  constructor(public auth: AuthService) {}
}
