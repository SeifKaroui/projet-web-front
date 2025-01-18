import { inject, Injectable } from '@angular/core';
import { course } from './course';
import { APP_API } from './app-api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  http = inject(HttpClient);

  apiUrl = `${APP_API.baseUrl}${APP_API.fetchAll}`;

  fetchData(): Observable<course[]> {
    return this.http.get<course[]>(this.apiUrl);
  }
}
