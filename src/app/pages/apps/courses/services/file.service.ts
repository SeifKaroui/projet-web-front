import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  uploadFiles(files: File[]): Observable<any[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<any[]>(`${this.apiUrl}/files/upload`, formData);
  }

  getFileById(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/${fileId}`, { responseType: 'blob' });
  }

  getFileUrl(fileId: number): string {
    return `${this.apiUrl}/files/${fileId}`;
  }
}