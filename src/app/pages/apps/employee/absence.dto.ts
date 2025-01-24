export interface Absence {
    id: number;
    createdAt: string;
    deletedAt: string;
    date: string;
    studentId: string;
    courseId: number;
    justified: boolean;
    justification: string;
  }