export interface HomeworkSubmission {
    id: number;
    grade?: number;
    feedback?: string;
    fileUrl?: string;
    studentId: number;
    homeworkId: number;
  }