export interface HomeworkSubmission {
    student: {
        id: string;
        name: string;
        email: string;
    },
    submission: null | {
        submissionID: number;
        uploadsIds: number[];
        grade: string | number;
        feedback: string;
    };
};