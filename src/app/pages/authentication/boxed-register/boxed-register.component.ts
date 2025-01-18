import { Component, inject } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_ROUTES } from '../app-routes.config';
import { RegisterDto } from '../DTO/register.dto';

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent {
  private settings = inject(CoreService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  options = this.settings.getOptions();

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    type: new FormControl('student', [Validators.required]) // Set default to lowercase 'student'
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log('Form Values:', this.form.value);
    console.log('Form Valid:', this.form.valid);
    console.log('Type Value:', this.form.get('type')?.value);

    if (this.form.valid) {
      const type = this.form.get('type')?.value;

      if (type !== 'student' && type !== 'teacher') {
        this.snackBar.open('Please select a valid type', 'Close', { duration: 3000 });
        return;
      }

      const registerData: RegisterDto = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        email: this.form.value.email!,
        password: this.form.value.password!,
        type: type as 'student' | 'teacher' // Ensure lowercase
      };

      console.log('Sending register data:', registerData);

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Register success:', response);
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.router.navigate([APP_ROUTES.login]);
        },
        error: (error) => {
          console.error('Register error:', error);
          this.snackBar.open(
            error.error?.message || 'Registration failed', 
            'Close', 
            { duration: 3000 }
          );
        }
      });
    }
  }
}