import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'tm-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  query = '';
  pharmacyCount: number;
  medicationCount: number;
  cityCount: number;

  constructor(private router: Router, private data: DataService) {
    this.pharmacyCount = this.data.pharmacies().length;
    this.medicationCount = this.data.medications().length;
    this.cityCount = new Set(this.data.pharmacies().map(p => p.ciudad)).size;
  }

  buscar() {
    this.router.navigate(['/buscar-publico'], { queryParams: this.query ? { q: this.query } : {} });
  }
}
