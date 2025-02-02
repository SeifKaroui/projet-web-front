import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class FeedbackDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grade: number; feedback: string }
  ) {}

  isValid(): boolean {
    const feedbackValid = this.data.feedback != null && this.data.feedback.trim() !== '';
    const gradeValid = this.data.grade != null && this.data.grade >= 0 && this.data.grade <= 100;
    return feedbackValid && gradeValid;
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.isValid()) {
      // Do not close the dialog, show an error or disable the save button
      return;
    }
    this.dialogRef.close(this.data);
  }
}
