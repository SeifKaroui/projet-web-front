import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { GradingService } from 'src/app/pages/apps/courses/services/grading.service';

export interface FileItem {
  id: number;
  originalname: string;
}

@Component({
  selector: 'app-course-mark-file-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './course-mark-file-dialog.component.html',
  styleUrls: ['./course-mark-file-dialog.component.scss']
})
export class CourseMarkFileDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CourseMarkFileDialogComponent>,
    private gradingService: GradingService,
    @Inject(MAT_DIALOG_DATA) public data: { files: FileItem[] }
  ) {}

  downloadFile(file: FileItem): void {
    const fileUrl = this.gradingService.getFileUrl(file.id);
    this.gradingService.downloadFile(fileUrl).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.originalname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error while downloading file:', error);
      }
    });
  }

  openFile(file: FileItem): void {
    window.open(this.gradingService.getFileUrl(file.id), '_blank');
  }

  close(): void {
    this.dialogRef.close();
  }
}