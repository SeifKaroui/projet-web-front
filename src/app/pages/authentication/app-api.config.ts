// Routes côté client (Angular)
export const APP_ROUTES = {
  login: '/authentication/login', 
  dashboard: '/dashboard', 
};

// Endpoints API (backend)
export const APP_API = {
  baseUrl: 'http://localhost:3000',
  login: '/auth/signin',
  absenceList: '/absences/teacher/count-absence-list',
  register: '/auth/signup',
  absences: '/absences',
  studentAbsences: '/absences/student/absence-course',
};
