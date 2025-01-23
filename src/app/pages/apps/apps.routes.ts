import { Routes } from '@angular/router';

import { CourseListComponent } from './courses/components/course-list/course-list.component';
import { CourseDetailComponent } from './courses/components/course-detail/course-detail.component';
import { AppEmployeeComponent } from './employee/employee.component';
import { AppNotesComponent } from './notes/notes.component';
import { AppTodoComponent } from './todo/todo.component';
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { StudentComponent } from './employee/student/student.component';

import { PostComponent } from './courses/components/post/post.component';
import { HomeworkComponent } from './courses/components/homework/homework.component';
import { AbsenceComponent } from './courses/components/absence/absence.component';
import { GradeComponent } from './courses/components/grade/grade.component';
import { PeopleComponent } from './courses/components/people/people.component';

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'calendar',
        component: AppFullcalendarComponent,
        data: {
          title: 'Calendar',
        },
      },
      {
        path: 'notes',
        component: AppNotesComponent,
        data: {
          title: 'Notes',
        },
      },
      {
        path: 'todo',
        component: AppTodoComponent,
        data: {
          title: 'Todo',
        },
      },
      {
        path: 'taskboard',
        component: AppTaskboardComponent,
        data: {
          title: 'Taskboard',
        },
      },
      {
        path: 'courses',
        component: CourseListComponent,
        data: {
          title: 'Courses',
        },
      },
      {
        path: 'courses/coursesdetail/:id',
        component: CourseDetailComponent,
        data: {
          title: 'Course Detail',
        },
        children: [
          {
            path: '',
            redirectTo: 'flux',
            pathMatch: 'full',
          },
          {
            path: 'flux',
            component: PostComponent,
            data: {
              title: 'Flux',
            },
          },
          {
            path: 'homework',
            component: HomeworkComponent,
            data: {
              title: 'Travaux et devoirs',
            },
          },
          {
            path: 'absences',
            component: AbsenceComponent,
            data: {
              title: 'Absences',
            },
          },
          {
            path: 'grades',
            component: GradeComponent,
            data: {
              title: 'Notes',
            },
          },
          {
            path: 'people',
            component: PeopleComponent,
            data: {
              title: 'Personnes',
            },
          },
        ],
      },
      {
        path: 'employee',
        component: AppEmployeeComponent,
        data: {
          title: 'Employee',
        },
      },
      {
        path: 'student',
        component: StudentComponent,
        data: {
          title: 'Student',
        },
      },
    ],
  },
];