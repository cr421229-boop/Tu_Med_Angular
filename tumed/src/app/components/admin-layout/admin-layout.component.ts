import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'tm-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminNavComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {}
