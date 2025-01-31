import { Routes } from '@angular/router';

import { CourseListComponent } from './courses/components/course-list/course-list.component';
import { CourseDetailComponent } from './courses/components/course-detail/course-detail.component';
import { AppNotesComponent } from './notes/notes.component';
import { AppTodoComponent } from './todo/todo.component';
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { PostComponent } from './courses/components/post/post.component';
import { HomeworkComponent } from './courses/components/homework/homework.component';
import { AbsenceComponent } from './courses/components/absence/absence.component';
import { PeopleComponent } from './courses/components/people/people.component';
import { HomeworkDetailsComponent } from './courses/components/homework/homework-details/homework-details.component';
import { HomeworkAddComponent } from './courses/components/homework/homework-add/homework-add.component';
import { HomeworkStudentSubmissionComponent } from './courses/components/homework/homework-student-submission/homework-student-submission.component';

import { CourseMarkComponent } from './courses/components/course-mark/course-mark.component';
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
            redirectTo: 'Flux',
            pathMatch: 'full',
          },
          {
            path: 'Flux',
            component: PostComponent,
            data: {
              title: 'Flux',
            },
          },
          {
            path: 'Travaux et devoirs',
            component: HomeworkComponent,
            data: {
              title: 'Travaux et devoirs',
            },

          },
          {
            path: 'homework/:homeworkId/details',
            component: HomeworkDetailsComponent,
            
          }, 
          {
            path: 'homework/add',
            component: HomeworkAddComponent,
          },
          {
            path: 'homework/:homeworkId/student-submission',
            component: HomeworkStudentSubmissionComponent,
          },
          {
            path: 'Absences',
            component: AbsenceComponent,
            data: {
              title: 'Absences',
            },
          },
          {
            path: 'Notes',
            component: CourseMarkComponent,
            data: {
              title: 'Notes',
            },
          },
          {
            path: 'Personnes',
            component: PeopleComponent,
            data: {
              title: 'Personnes',
            },
          },
        ],
      },
    ],
  },
];