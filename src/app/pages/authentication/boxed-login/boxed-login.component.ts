import { Component, inject } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/pages/authentication/service/auth.service';
import { APP_CONST } from '../app-constantes.config';
import { APP_ROUTES } from '../app-routes.config';
import { LoginResponseDto } from '../DTO/login-response.dto';
import { CredentialsDto } from '../DTO/credentials.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent {
  private authService = inject(AuthService);
  private settings = inject(CoreService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  options = this.settings.getOptions();

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

 
  submit() {
    if (this.form.valid) {
      const credentials: CredentialsDto = {
        email: this.form.value.uname ?? '',
        password: this.form.value.password ?? ''
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.snackBar.open(
            error.error?.message || 'Login failed', 
            'Close', 
            { duration: 3000 }
          );
        }
      });
    }
  }
}