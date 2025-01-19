import { AbsenceCount } from "../absence-count.dto";

export interface StudentAbsence {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
  };
  absences: {
    id: number;
    date: string;
    justified: boolean;
    justification: string | null;
  }[];
  absenceCounts: AbsenceCount;
}