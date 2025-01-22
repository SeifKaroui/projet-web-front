import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [MatCardModule], // Ajoutez MatCardModule ici
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss'],
})
export class GradeComponent {}