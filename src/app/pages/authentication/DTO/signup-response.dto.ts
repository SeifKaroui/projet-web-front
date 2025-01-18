interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: 'Student' | 'Teacher';
  }
  
  export interface SignUpResponseDto {
    user: User;
    accessToken: string;
    refreshToken: string;
  }