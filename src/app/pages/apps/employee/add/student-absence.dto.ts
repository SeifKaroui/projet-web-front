import { AbsenceCount } from "../absence-count.dto";

export interface StudentAbsence {
    firstName: string;
    lastName: string;
    email: string;
    absenceCounts: AbsenceCount;
  }