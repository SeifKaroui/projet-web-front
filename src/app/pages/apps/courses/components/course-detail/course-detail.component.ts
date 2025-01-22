// course-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../models/course.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ChangeDetectorRef } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { CourseService } from '../../services/course.service';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { AppEmployeeComponent } from '../../../employee/employee.component';
import { AuthService } from '../../../../authentication/service/auth.service';
import { Title } from '@angular/platform-browser';
import { PostComponent } from "../post/post.component";
import { HomeworkComponent } from "../homework/homework.component";
import { AbsenceComponent } from "../absence/absence.component";
import { GradeComponent } from "../grade/grade.component";
import { PeopleComponent } from "../people/people.component";

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TablerIconsModule,
    PostComponent,
    HomeworkComponent,
    AbsenceComponent,
    GradeComponent,
    PeopleComponent
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  courseDetail: Course | null = null;
  headerGradient: string = 'linear-gradient(135deg, #333, #333)';
  isCourseCodeVisible: boolean = false;
  isTeacher: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private colorService: ColorService,
    private courseService: CourseService,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.isTeacher = this.authService.isTeacher();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.courseDetail = navigation.extras.state['course'];
    } else {
      const courseFromLocalStorage = localStorage.getItem('currentCourse');
      if (courseFromLocalStorage) {
        this.courseDetail = JSON.parse(courseFromLocalStorage);
      } else {
        console.error('Aucune donnée de cours trouvée.');
      }
    }

    if (this.courseDetail) {
      this.headerGradient = this.colorService.generateFancyDarkGradientFromId(this.courseDetail.id);
      this.titleService.setTitle('Course Detail - Angular 18');
    }

    console.log('Course Detail:', this.courseDetail);
  }

  showCourseCode(): void {
    this.isCourseCodeVisible = true;
  }

  hideCourseCode(): void {
    this.isCourseCodeVisible = false;
  }

  goBack(): void {
    this.router.navigate(['/apps/courses']);
  }
}