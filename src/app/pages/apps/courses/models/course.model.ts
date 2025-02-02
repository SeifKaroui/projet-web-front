export interface Course {
  courseCode: string;
  description: string;
  id: number;
  startDate: string;
  teacher: Teacher;
  title: string;
  type: string;
}
export interface AddCourseDTO {
  title: string; // The title of the course
  description: string; // A brief description of the course
  type: string; // Course type
  invitationType: string;
  studentEmails: any;
}

export interface Teacher {
  createdAt: string;
  deletedAt: string | null;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  password: string;
  type: string;
  updatedAt: string;
}
