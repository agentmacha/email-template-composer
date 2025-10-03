import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
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
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <!-- Background Elements -->
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>

      <!-- Main Content -->
      <div class="login-content">
        <!-- Left Side - Branding -->
        <div class="branding-section">
          <div class="brand-content">
            <div class="logo">
              <mat-icon class="logo-icon">email</mat-icon>
              <h1 class="brand-title">Template Composer</h1>
            </div>
            
            <div class="tagline">
              <h2>Beautiful, AI-powered templates for your business</h2>
              <p>Create stunning email templates with the power of artificial intelligence. Design, customize, and send professional emails that convert.</p>
            </div>

            <div class="features">
              <div class="feature-item">
                <mat-icon>auto_awesome</mat-icon>
                <span>AI-Powered Design</span>
              </div>
              <div class="feature-item">
                <mat-icon>drag_indicator</mat-icon>
                <span>Drag & Drop Editor</span>
              </div>
              <div class="feature-item">
                <mat-icon>mobile_friendly</mat-icon>
                <span>Mobile Responsive</span>
              </div>
              <div class="feature-item">
                <mat-icon>palette</mat-icon>
                <span>Custom Branding</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-section">
          <mat-card class="login-card">
            <mat-card-header>
              <mat-card-title>Welcome Back</mat-card-title>
              <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="Enter your email">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Enter your password">
                  <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                    Password must be at least 6 characters
                  </mat-error>
                </mat-form-field>

                <div class="form-options">
                  <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
                  <a href="#" class="forgot-password" (click)="onForgotPassword()">Forgot password?</a>
                </div>

                <button mat-flat-button type="submit" class="login-button" [disabled]="loginForm.invalid || loading">
                  <mat-icon *ngIf="loading" class="spinning">refresh</mat-icon>
                  <mat-icon *ngIf="!loading">login</mat-icon>
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>

                <div class="divider">
                  <span>or</span>
                </div>

                <button mat-stroked-button type="button" class="demo-button" (click)="onDemoLogin()">
                  <mat-icon>play_circle</mat-icon>
                  Try Demo
                </button>
              </form>
            </mat-card-content>

            <mat-card-footer>
              <p class="signup-text">
                Don't have an account? 
                <a href="#" class="signup-link" (click)="onSignUp()">Sign up for free</a>
              </p>
            </mat-card-footer>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .background-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    .shape-4 {
      width: 80px;
      height: 80px;
      top: 30%;
      right: 30%;
      animation-delay: 1s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .login-content {
      display: flex;
      width: 100%;
      max-width: 1200px;
      min-height: 600px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      z-index: 2;
      position: relative;
    }

    .branding-section {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px 0 0 20px;
      padding: 60px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .branding-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }

    .brand-content {
      text-align: center;
      z-index: 1;
      position: relative;
    }

    .logo {
      margin-bottom: 40px;
    }

    .logo-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
      color: #fff;
    }

    .brand-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .tagline h2 {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0 0 20px 0;
      line-height: 1.3;
    }

    .tagline p {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.6;
      margin: 0 0 40px 0;
    }

    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      max-width: 400px;
      margin: 0 auto;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .feature-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .form-section {
      flex: 1;
      padding: 60px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      box-shadow: none;
      border: 1px solid #e0e0e0;
    }

    .login-card mat-card-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-card mat-card-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .login-card mat-card-subtitle {
      color: #666;
      font-size: 1rem;
      margin: 8px 0 0 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
    }

    .forgot-password {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    .login-button {
      height: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: 20px 0;
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .login-button:disabled {
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

    .divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e0e0e0;
    }

    .divider span {
      background: white;
      padding: 0 20px;
      color: #666;
      font-size: 0.9rem;
    }

    .demo-button {
      height: 50px;
      font-size: 1rem;
      font-weight: 500;
      border-color: #667eea;
      color: #667eea;
    }

    .demo-button:hover {
      background: #667eea;
      color: white;
    }

    .signup-text {
      text-align: center;
      color: #666;
      margin: 20px 0 0 0;
      font-size: 0.9rem;
    }

    .signup-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .signup-link:hover {
      text-decoration: underline;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .login-content {
        flex-direction: column;
        margin: 20px;
        min-height: auto;
      }

      .branding-section {
        border-radius: 20px 20px 0 0;
        padding: 40px 20px;
      }

      .form-section {
        padding: 40px 20px;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .brand-title {
        font-size: 2rem;
      }

      .tagline h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  private signupDialogOpen = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      
      const { email, password } = this.loginForm.value;
      const user = await this.authService.signIn(email, password);
      
      this.loading = false;
      
      if (user) {
        // Open dashboard
        this.openDashboard();
      }
    }
  }

  async onDemoLogin() {
    this.loading = true;
    
    const user = await this.authService.demoLogin();
    
    this.loading = false;
    
    if (user) {
      // Open dashboard
      this.openDashboard();
    }
  }

  async onForgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.snackBar.open('Please enter your email address first', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    await this.authService.resetPassword(email);
  }

  onSignUp() {
    console.log('=== LOGIN: SIGNUP BUTTON CLICKED ===');
    
    if (this.signupDialogOpen) {
      console.log('Signup dialog already open, preventing multiple dialogs');
      return; // Prevent multiple dialogs
    }

    console.log('Opening signup dialog...');
    this.signupDialogOpen = true;
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '500px',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      data: {}
    });

    console.log('Signup dialog opened:', dialogRef);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Signup dialog closed with result:', result);
      this.signupDialogOpen = false; // Reset flag when dialog closes
      if (result && result.success) {
        // User successfully signed up, open dashboard
        this.openDashboard();
      } else if (result && result.action === 'login') {
        // User wants to go back to login
        // This will just close the signup dialog and show login again
      }
    });
  }

  openDashboard(): void {
    const dialogRef = this.dialog.open(DashboardComponent, {
      width: '95vw',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: '800px',
      panelClass: 'dashboard-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dashboard action:', result);
      }
    });
  }
}
