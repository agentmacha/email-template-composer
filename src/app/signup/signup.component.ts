import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="signup-dialog" (click)="$event.stopPropagation()">
      <div class="header">
        <h2 mat-dialog-title>Create Account</h2>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="content">
        <form [formGroup]="signupForm" (ngSubmit)="onSignUp()" class="signup-form" (click)="$event.stopPropagation()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="displayName" placeholder="Enter your full name">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="signupForm.get('displayName')?.hasError('required')">
              Full name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email Address</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter your email">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Create a password">
            <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="signupForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="signupForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" formControlName="confirmPassword" placeholder="Confirm your password">
            <button mat-icon-button matSuffix type="button" (click)="toggleConfirmPasswordVisibility()">
              <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="signupForm.get('confirmPassword')?.hasError('required')">
              Please confirm your password
            </mat-error>
            <mat-error *ngIf="signupForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <div class="terms">
            <mat-checkbox formControlName="acceptTerms">
              I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
            </mat-checkbox>
          </div>

          <button mat-flat-button type="button" class="signup-button" [disabled]="loading" (click)="onSignUp()">
            <mat-icon *ngIf="loading" class="spinning">refresh</mat-icon>
            <mat-icon *ngIf="!loading">person_add</mat-icon>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
          
          <!-- Debug button -->
          <button mat-button type="button" (click)="testClick()" style="margin-top: 10px; background: red; color: white;">
            TEST CLICK
          </button>
        </form>

        <div class="login-link">
          <p>Already have an account? <a href="#" (click)="onLogin()">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-dialog {
      width: 100%;
      max-width: 500px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h2 {
      margin: 0;
      color: #1a1a1a;
      font-weight: 600;
    }

    .content {
      padding: 24px;
    }

    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .terms {
      margin: 10px 0;
    }

    .terms-link {
      color: #667eea;
      text-decoration: none;
    }

    .terms-link:hover {
      text-decoration: underline;
    }

    .signup-button {
      height: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: 20px 0;
    }

    .signup-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .signup-button:disabled {
      opacity: 0.6;
      transform: none;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
    }

    .login-link p {
      margin: 0;
      color: #666;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.signupForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  async onSignUp() {
    console.log('=== SIGNUP BUTTON CLICKED ===');
    console.log('Signup form valid:', this.signupForm.valid);
    console.log('Form errors:', this.signupForm.errors);
    console.log('Form value:', this.signupForm.value);
    console.log('Loading state:', this.loading);
    
    if (this.signupForm.valid) {
      this.loading = true;
      console.log('Attempting to sign up user...');
      
      const { displayName, email, password } = this.signupForm.value;
      const user = await this.authService.signUp(email, password, displayName);
      
      this.loading = false;
      console.log('Signup result:', user);
      
      if (user) {
        console.log('Signup successful, closing dialog');
        this.dialogRef.close({ success: true, user });
      } else {
        console.log('Signup failed');
      }
    } else {
      console.log('Form is invalid, marking fields as touched');
      // Mark all fields as touched to show validation errors
      this.signupForm.markAllAsTouched();
    }
  }

  onLogin() {
    this.dialogRef.close({ action: 'login' });
  }

  ngOnInit() {
    console.log('=== SIGNUP COMPONENT INITIALIZED ===');
    alert('Signup component loaded!');
  }

  onClose() {
    this.dialogRef.close();
  }

  testClick() {
    console.log('=== TEST BUTTON CLICKED ===');
    alert('Test button works!');
  }
}
