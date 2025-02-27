import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { AuthService } from '../../../../authentication/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatTabsModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TablerIconsModule,
  ],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  courseDetail: Course | null = null;
  headerGradient: string = 'linear-gradient(135deg, #333, #333)';
  isCourseCodeVisible: boolean = false;
  isTeacher: boolean = false;

  tabs: { label: string; route: string }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public colorService: ColorService,
    private courseService: CourseService,
    private authService: AuthService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.isTeacher = this.authService.isTeacher();
    this.tabs = this.getTabsBasedOnRole(); // Définir les onglets en fonction du rôle

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
    } else {
      console.error('CourseDetail est null ou undefined.');
    }
  }

  getTabsBasedOnRole(): { label: string; route: string }[] {
    const baseTabs = [
      { label: 'Flux', route: 'Flux' },
      { label: 'Travaux et devoirs', route: 'Homework' },
      { label: 'Absences', route: 'Absences' },
      { label: 'Personnes', route: 'Personnes' },
    ];

    if (this.isTeacher) {
      baseTabs.push({ label: 'Notes', route: 'Notes' });
    }

    return baseTabs;
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

  navigateToPeople(): void {
    if (this.courseDetail && this.courseDetail.teacher) {
      const teacherData = this.courseDetail.teacher;
      this.router.navigate(['Personnes'], {
        relativeTo: this.activatedRoute,
        state: { teacher: teacherData },
      });
    } else {
      console.error('Aucune donnée de teacher à envoyer.');
    }
  }

  onTabClick(route: string): void {
    if (route === 'Personnes') {
      this.navigateToPeople();
    }
  }
}