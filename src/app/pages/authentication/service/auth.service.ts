import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { APP_API } from '../app-api.config';
import { CredentialsDto } from '../DTO/credentials.dto';
import { LoginResponseDto } from '../DTO/login-response.dto';
import { APP_CONST } from '../app-constantes.config';
import { RegisterDto } from '../DTO/register.dto';
import { SignUpResponseDto } from '../DTO/signup-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  constructor() {}
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  getToken(): string | null {
    return localStorage.getItem(APP_CONST.tokenLocalStorageKey);
  }
  

  isTeacher(): boolean {
    const user = this.getCurrentUser();
    console.log('User for teacher check:', user);
    console.log('User type:', user?.type);
    return user?.type?.toLowerCase() === 'teacher';
  }

  isStudent(): boolean {
    const user = this.getCurrentUser();
    return user?.type === 'student';
  }
  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    const url = `${APP_API.baseUrl}${APP_API.login}`;
    console.log('Login URL:', url);
    console.log('Credentials:', credentials);
console.log('Const',APP_CONST);
    return this.http.post<LoginResponseDto>(url, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap(response => {
        localStorage.setItem(APP_CONST.tokenLocalStorageKey, response.accessToken);
        localStorage.setItem(APP_CONST.userDataLocalStorageKey, JSON.stringify(response.user));
        console.log('Stored token:', localStorage.getItem(APP_CONST.tokenLocalStorageKey));
        console.log('Stored user:', localStorage.getItem(APP_CONST.userDataLocalStorageKey));
       // next: (response) => console.log('Login response:', response),
        //: (error) => console.error('Login error:', error)
      })
    );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('Token exists:', !!token);
    return !!token;
  }
  register(data: RegisterDto): Observable<SignUpResponseDto> {
    console.log('Register request:', data);
    const url = `${APP_API.baseUrl}${APP_API.register}`;
    
    return this.http.post<SignUpResponseDto>(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap({
        next: (response) => console.log('Register response:', response),
        error: (error) => console.error('Register error:', error)
      })
    );
}

signOut() {
  localStorage.removeItem(APP_CONST.tokenLocalStorageKey);
  localStorage.removeItem('user');
}
}