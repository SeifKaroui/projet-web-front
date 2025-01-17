// homework.ts
export interface Homework {
    id: number;
    title: string;
    description: string;
    deadline: string; // ou Date si vous convertissez la chaîne en objet Date
    createdAt: string; // ou Date
    updatedAt: string; // ou Date
    deletedAt: string | null; // ou Date | null
  }