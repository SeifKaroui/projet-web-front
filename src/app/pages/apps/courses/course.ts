// src/app/pages/apps/courses/course.ts

export interface Course {
  courseCode: string; // Code du cours
  description: string; // Description du cours
  id: number; // Identifiant du cours
  startDate: string; // Date de début au format ISO
  teacher: Teacher; // Enseignant du cours
  title: string; // Titre du cours
  type: string; // Type de cours
}

export interface Teacher {
  createdAt: string; // Date de création au format ISO
  deletedAt: string | null; // Date de suppression au format ISO ou null
  email: string; // Email de l'enseignant
  firstName: string; // Prénom de l'enseignant
  id: string; // Identifiant de l'enseignant
  lastName: string; // Nom de famille de l'enseignant
  password: string; // Mot de passe hashé
  type: string; // Type d'utilisateur (par exemple : "teacher")
  updatedAt: string; // Date de mise à jour au format ISO
}