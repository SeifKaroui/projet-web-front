import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppEmployeeComponent } from '../../../employee/employee.component';

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [MatCardModule, AppEmployeeComponent], // Ajoutez MatCardModule et EmployeeComponent ici
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss'],
})
export class AbsenceComponent {
  @Input() courseId: number = 0;
}