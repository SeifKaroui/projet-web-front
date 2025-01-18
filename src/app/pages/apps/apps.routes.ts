import { Routes } from '@angular/router';


import { AppCoursesComponent } from './courses/courses.component';
import { AppCourseDetailComponent } from './courses/course-detail/course-detail.component';

import { AppNotesComponent } from './notes/notes.component';
import { AppTodoComponent } from './todo/todo.component';

import { AppTaskboardComponent } from './taskboard/taskboard.component';

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'notes',
        component: AppNotesComponent,
        data: {
          title: 'Notes',
        }
      },


      {
        path: 'todo',
        component: AppTodoComponent,
        data: {
          title: 'Todo',
        }
      },
      {
        path: 'taskboard',
        component: AppTaskboardComponent,
        data: {
          title: 'Taskboard',
        }
      },

      {
        path: 'courses',
        component: AppCoursesComponent,
        data: {
          title: 'Courses',
        }
      },
      {
        path: 'courses/coursesdetail/:id',
        component: AppCourseDetailComponent,
        data: {
          title: 'Course Detail',
        }
      },

    ],
  },
];
