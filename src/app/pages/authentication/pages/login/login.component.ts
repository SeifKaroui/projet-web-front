import { Component, inject } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { AuthService } from 'src/app/pages/authentication/services/auth.service';
import { APP_CONST } from '../../app-constantes.config';
import { APP_ROUTES } from '../../app-routes.config';
import { LoginResponseDto } from '../../dto/login-response.dto';
import { CredentialsDto } from '../../dto/credentials.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class AppBoxedLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const credentials: CredentialsDto = {
        email: this.form.value.uname!,
        password: this.form.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: (response: LoginResponseDto) => {
          localStorage.setItem(APP_CONST.tokenLocalStorageKey, response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          const userData = localStorage.getItem('user');
          this.router.navigate([APP_ROUTES.dashboard]);
          this.snackBar.open('Login successful', 'Close', { duration: 3000 });

        },
        error: (error) => {
          console.error('Login error:', error);
          this.snackBar.open(
            error.error?.message || 'Login failed. Please check your credentials.',
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }
}
