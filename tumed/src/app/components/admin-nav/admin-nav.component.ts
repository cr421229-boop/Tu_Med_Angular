import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-admin-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
  constructor(public auth: AuthService) {}
}
