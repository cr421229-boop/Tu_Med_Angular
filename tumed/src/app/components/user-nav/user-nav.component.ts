import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tm-user-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent {
  constructor(public auth: AuthService) {}
}
