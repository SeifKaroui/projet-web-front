export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: 'student' | 'teacher'; // Changed from 'role' to 'type'
}