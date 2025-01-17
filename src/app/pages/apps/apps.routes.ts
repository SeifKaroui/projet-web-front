import { Routes } from '@angular/router';

import { AppChatComponent } from './chat/chat.component';
import { AppEmailComponent } from './email/email.component';
import { DetailComponent } from './email/detail/detail.component';
import { AppCoursesComponent } from './courses/courses.component';
import { AppCourseDetailComponent } from './courses/course-detail/course-detail.component';
import { AppEmployeeComponent } from './employee/employee.component';
import { AppBlogsComponent } from './blogs/blogs.component';
import { AppBlogDetailsComponent } from './blogs/details/details.component';
import { AppContactComponent } from './contact/contact.component';
import { AppNotesComponent } from './notes/notes.component';
import { AppTodoComponent } from './todo/todo.component';
import { AppPermissionComponent } from './permission/permission.component';
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { AppTicketlistComponent } from './ticketlist/ticketlist.component';
import { AppInvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { AppAddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AppInvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { AppEditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';

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
