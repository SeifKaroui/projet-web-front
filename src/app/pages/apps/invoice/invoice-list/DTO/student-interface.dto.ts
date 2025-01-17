export interface StudentSubmission {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    submissionDate?: Date;
    grade?: number;
    comments?: string;
    fileUrl?: string;
    hasSubmitted: boolean;
  }