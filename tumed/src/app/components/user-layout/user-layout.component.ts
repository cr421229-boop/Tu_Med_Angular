import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserNavComponent } from '../user-nav/user-nav.component';

@Component({
  selector: 'tm-user-layout',
  standalone: true,
  imports: [RouterOutlet, UserNavComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {}
