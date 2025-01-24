import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { AbsenceService } from '../absence.service';

interface Absence {
  id?: number;
  date: Date;
  justified: boolean;
  justification: string | null;
}

@Component({
  selector: 'app-justification-dialog',
  templateUrl: './justification-dialog.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule],
})
export class JustificationDialogComponent {
  absences: Absence[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<JustificationDialogComponent>,
    private absenceService: AbsenceService
  ) {
    this.absences = (data?.justifications || [])
      .filter(
        (absence: Absence) =>
          absence.justification !== null &&
          absence.justification !== undefined &&
          !absence.justified
      );
    console.log('Filtered absences:', this.absences);
  }

  confirmJustification(absence: Absence): void {
    console.log('Absence object:', absence);
    if (!absence.id) {
      console.error('Absence ID is missing');
      return;
    }
  
    // Call the API to validate the absence
    this.absenceService.validateAbsence(absence.id).subscribe({
      next: (response) => {
        console.log('Absence confirmed:', response);
  
        // Update the local state
        absence.justified = true;
  
        // Notify the parent component about the change
        this.dialogRef.close({ action: 'confirm', absence });
      },
      error: (error) => {
        console.error('Error confirming absence:', error);
      },
    });
  }

  rejectJustification(absence: Absence): void {
    if (!absence.id) {
      console.error('Absence ID is missing');
      return;
    }
  
    this.absenceService.rejectAbsence(absence.id).subscribe({
      next: (response) => {
        console.log('Absence justification rejected:', response);
        absence.justification = null;
        absence.justified = false;
        this.dialogRef.close({ action: 'reject', absence });
      },
      error: (error) => {
        console.error('Error rejecting absence justification:', error);
        if (error.status === 404) {
          alert('The absence was not found. Please refresh the page and try again.');
        } else {
          alert('An error occurred while rejecting the absence. Please try again.');
        }
      },
    });
  }
}