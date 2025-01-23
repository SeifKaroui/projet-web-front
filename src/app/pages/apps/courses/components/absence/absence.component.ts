import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AppEmployeeComponent } from '../../../employee/employee.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [MatCardModule, AppEmployeeComponent, CommonModule],
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss'],
})
export class AbsenceComponent implements OnInit {
  courseId: number = 0; // Initialisez avec une valeur par défaut (0 ou une autre valeur)

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = +params['id']; // Récupérer l'ID du cours depuis l'URL
      console.log('Course ID in AbsenceComponent:', this.courseId);
    });
  }
}