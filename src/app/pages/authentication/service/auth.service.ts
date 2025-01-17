import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API } from '../app-api.config';
import { CredentialsDto } from '../DTO/credentials.dto';
import { LoginResponseDto } from '../DTO/login-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${APP_API.baseUrl}${APP_API.login}`, 
      credentials
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}