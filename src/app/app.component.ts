import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmailComposerComponent } from './email-composer/email-composer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    LoginComponent,
    DashboardComponent,
    SignupComponent
  ],
  template: `
    <app-login></app-login>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  constructor(private dialog: MatDialog) {}

  openEmailComposer(): void {
    const dialogRef = this.dialog.open(EmailComposerComponent, {
      width: '95vw',
      maxWidth: '1400px',
      height: '90vh',
      maxHeight: '900px',
      panelClass: 'visual-template-dialog',
      data: {
        template: null // New template
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Template saved:', result);
        // Handle template save
      }
    });
  }
}
