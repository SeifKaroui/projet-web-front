import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';
import { course } from './course';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ColorService } from './color.service';

interface Profile {
  createdAt: string;
  updatedAt: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    TablerIconsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AppCoursesComponent implements OnInit {
  courses: course[] = [];
  selectedCategory = 'All';

  constructor(
    private courseService: CourseService,
    public colorService: ColorService
  ) {}
  profile: Profile;

  ngOnInit(): void {
    this.courseService.fetchData().subscribe(
      (data) => {
        this.courses = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    const data = localStorage.getItem('user'); // Retrieve the item using its key
    console.log(data);
    if (data) {
      this.profile = JSON.parse(data); // Parse the JSON string to an object
    }
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.courses = this.filter(filterValue);
  }

  filter(v: string): course[] {
    return this.courses.filter(
      (x) => x.tittle.toLowerCase().indexOf(v.toLowerCase()) !== -1
    );
  }

  ddlChange(ob: any): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.courses;
    } else {
      this.courses = this.courses
        // tslint:disable-next-line: no-shadowed-variable
        .filter((course) => course.Id === filterValue);
    }
    // this.todos.filter(course => course.courseType==filterValue);
  }
  onSubmit(form: any): void {
    if (form.valid) {
      console.log(`Joining course with code: ${form.value.courseCode}`);
      alert(`Joined course: ${form.value.courseCode}`);
    } else {
      alert('Please enter a valid course code.');
    }
  }
}
