export interface LoginResponseDto {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    type: string;
  };
  accessToken: string;
  refreshToken: string;
}