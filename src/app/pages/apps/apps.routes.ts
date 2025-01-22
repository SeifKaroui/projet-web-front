import { Routes } from '@angular/router';
import { CourseListComponent } from './courses/components/course-list/course-list.component'; // Mise à jour de l'import
import { CourseDetailComponent } from './courses/components/course-detail/course-detail.component'; // Mise à jour de l'import
import { AppEmployeeComponent } from './employee/employee.component';
import { AppNotesComponent } from './notes/notes.component';
import { AppTodoComponent } from './todo/todo.component';
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';

import { StudentComponent } from './employee/student/student.component';

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
        component: CourseListComponent, // Utilisation de CourseListComponent au lieu de CoursesComponent
        data: {
          title: 'Courses',
        },
      },
      {
        path: 'courses/coursesdetail/:id',
        component: CourseDetailComponent, // Utilisation de CourseDetailComponent
        data: {
          title: 'Course Detail', // Ajoutez le titre ici
        },
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
