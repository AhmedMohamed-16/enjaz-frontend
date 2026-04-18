import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) {
    return null;
  }

  const confirmErrors = confirmPassword.errors ? { ...confirmPassword.errors } : null;

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...confirmErrors, passwordMismatch: true });
    return { passwordMismatch: true };
  }

  if (confirmErrors) {
    delete confirmErrors['passwordMismatch'];
    if (Object.keys(confirmErrors).length > 0) {
      confirmPassword.setErrors(confirmErrors);
    } else {
      confirmPassword.setErrors(null);
    }
  }

  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = false;
  serverError = '';
  showPassword = false;
  showConfirmPassword = false;

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator }
  );

  get nameControl() {
    return this.registerForm.get('name');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  get passwordStrengthLabel(): string {
    return this.computePasswordStrength(this.passwordControl?.value || '');
  }

  get strengthClass(): string {
    const label = this.passwordStrengthLabel.toLowerCase();
    return `strength-${label}`;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.serverError = '';
    this.loading = true;
    this.registerForm.disable();

    const { name, email, password } = this.registerForm.value as {
      name: string;
      email: string;
      password: string;
    };
    this.authService.register({ name, email, password }).pipe(
      finalize(() => {
        this.loading = false;
        this.registerForm.enable();
      })
    ).subscribe({
      error: (error) => {
        this.serverError = error?.error?.message || 'Unable to create account. Please try again.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private computePasswordStrength(value: string): string {
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const length = value.length;
    const score = [hasUpper, hasLower, hasNumber].filter(Boolean).length;

    if (length >= 12 && score === 3) {
      return 'Strong';
    }
    if (length >= 8 && score >= 2) {
      return 'Medium';
    }
    return 'Weak';
  }
}
