import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

// Simple User interface for demo purposes
interface User {
  uid: string;
  email: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar
  ) {
    // Initialize with no user
    this.userSubject.next(null);
  }

  // Get current user
  get currentUser(): User | null {
    return this.userSubject.value;
  }

  // Check if user is authenticated
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<User | null> {
    try {
      console.log('AuthService: Attempting to create user with email:', email);
      
      // Simulate user creation
      const user: User = {
        uid: 'demo-' + Date.now(),
        email: email,
        displayName: displayName || 'User'
      };

      this.userSubject.next(user);
      console.log('AuthService: User created successfully:', user.uid);

      this.snackBar.open('Account created successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      return user;
    } catch (error: any) {
      console.error('AuthService: Sign up error:', error);
      this.handleAuthError(error);
      return null;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      // Simulate user sign in
      const user: User = {
        uid: 'demo-' + Date.now(),
        email: email,
        displayName: 'User'
      };

      this.userSubject.next(user);

      this.snackBar.open('Welcome back!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      this.handleAuthError(error);
      return null;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      this.userSubject.next(null);
      this.snackBar.open('Signed out successfully', 'Close', {
        duration: 3000
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      this.snackBar.open('Error signing out', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      // Simulate password reset
      this.snackBar.open('Password reset email sent!', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      this.handleAuthError(error);
    }
  }

  // Demo login (for testing purposes)
  async demoLogin(): Promise<User | null> {
    try {
      // Create a demo user
      const user: User = {
        uid: 'demo-user-123',
        email: 'demo@templatecomposer.com',
        displayName: 'Demo User'
      };

      this.userSubject.next(user);

      this.snackBar.open('Demo mode activated! Welcome to Template Studio', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      return user;
    } catch (error: any) {
      console.error('Demo login error:', error);
      this.handleAuthError(error);
      return null;
    }
  }

  // Handle authentication errors
  private handleAuthError(error: any): void {
    let errorMessage = 'An error occurred. Please try again.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
