import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmailComposerComponent } from '../email-composer/email-composer.component';
import { AuthService } from '../services/auth.service';
// Using our custom User interface from AuthService
interface User {
  uid: string;
  email: string;
  displayName?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Background Elements -->
      <div class="bg-pattern"></div>
      
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="brand">
            <div class="brand-icon">
              <mat-icon>auto_awesome</mat-icon>
            </div>
            <div class="brand-text">
              <h1>Template Studio</h1>
              <span class="brand-subtitle">AI-Powered Design</span>
            </div>
          </div>
          <div class="header-actions">
            <button mat-icon-button class="action-btn">
              <mat-icon>notifications</mat-icon>
            </button>
            <button mat-icon-button class="action-btn">
              <mat-icon>settings</mat-icon>
            </button>
            <div class="user-avatar" (click)="onUserMenu()">
              <mat-icon>person</mat-icon>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- Hero Section -->
          <div class="hero">
            <h2 class="hero-title">Create Beautiful Templates</h2>
            <p class="hero-subtitle">Choose your template type and start designing with AI assistance</p>
          </div>

          <!-- Template Grid -->
          <div class="template-grid">
            <!-- Message Templates -->
            <div class="template-card message" (click)="openMessageTemplates()">
              <div class="card-header">
                <div class="card-icon">
                  <mat-icon>chat_bubble_outline</mat-icon>
                </div>
                <div class="card-badge">Coming Soon</div>
              </div>
              <div class="card-body">
                <h3>Message Templates</h3>
                <p>SMS and text message templates for quick client communication</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">0</span>
                    <span class="stat-label">Templates</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">0</span>
                    <span class="stat-label">Sent</span>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <span class="card-action">Create Message</span>
                <mat-icon class="arrow">arrow_forward</mat-icon>
              </div>
            </div>

            <!-- Email Templates -->
            <div class="template-card email active" (click)="openEmailTemplates()">
              <div class="card-header">
                <div class="card-icon">
                  <mat-icon>email_outlined</mat-icon>
                </div>
                <div class="card-badge success">Available</div>
              </div>
              <div class="card-body">
                <h3>Email Templates</h3>
                <p>AI-powered email templates with drag-and-drop editor</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">3</span>
                    <span class="stat-label">Templates</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">12</span>
                    <span class="stat-label">Sent</span>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <span class="card-action">Create Email</span>
                <mat-icon class="arrow">arrow_forward</mat-icon>
              </div>
            </div>

            <!-- Voice Templates -->
            <div class="template-card voice" (click)="openVoiceTemplates()">
              <div class="card-header">
                <div class="card-icon">
                  <mat-icon>mic_outlined</mat-icon>
                </div>
                <div class="card-badge">Coming Soon</div>
              </div>
              <div class="card-body">
                <h3>Voice Templates</h3>
                <p>Voice message templates and automated call scripts</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">0</span>
                    <span class="stat-label">Templates</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">0</span>
                    <span class="stat-label">Calls</span>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <span class="card-action">Create Voice</span>
                <mat-icon class="arrow">arrow_forward</mat-icon>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="stats-section">
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">12</span>
                <span class="stat-label">Templates Created</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">2.5h</span>
                <span class="stat-label">Time Saved</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <mat-icon>auto_awesome</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">8</span>
                <span class="stat-label">AI Generations</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #fafbfc;
      position: relative;
      overflow-x: hidden;
    }

    .bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .brand-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .brand-text h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-avatar:hover {
      transform: scale(1.05);
    }

    .user-avatar mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .hero {
      text-align: center;
      margin-bottom: 2rem;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      margin: 0;
      font-weight: 400;
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .template-card {
      background: white;
      border-radius: 20px;
      padding: 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
    }

    .template-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }

    .template-card.active {
      border: 2px solid #667eea;
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
    }

    .card-header {
      padding: 2rem 2rem 1rem 2rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
    }

    .template-card.message .card-icon {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .template-card.email .card-icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .template-card.voice .card-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .card-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-badge:not(.success) {
      background: #f3f4f6;
      color: #6b7280;
    }

    .card-badge.success {
      background: #d1fae5;
      color: #065f46;
    }

    .card-body {
      padding: 0 2rem 1rem 2rem;
    }

    .card-body h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 0.75rem 0;
      letter-spacing: -0.02em;
    }

    .card-body p {
      color: #6b7280;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .card-stats {
      display: flex;
      gap: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-footer {
      padding: 1.5rem 2rem 2rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #f3f4f6;
      background: #fafbfc;
    }

    .card-action {
      font-weight: 600;
      color: #374151;
      font-size: 0.95rem;
    }

    .arrow {
      color: #9ca3af;
      transition: all 0.2s ease;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .template-card:hover .arrow {
      color: #667eea;
      transform: translateX(4px);
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .main-content {
        padding: 2rem 1rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .template-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .card-header {
        padding: 1.5rem 1.5rem 1rem 1.5rem;
      }

      .card-body {
        padding: 0 1.5rem 1rem 1.5rem;
      }

      .card-footer {
        padding: 1rem 1.5rem 1.5rem 1.5rem;
      }

      .stats-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  currentUser: User | null = null;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    // Subscribe to auth state changes
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  openMessageTemplates(): void {
    // TODO: Implement message templates
    console.log('Opening Message Templates...');
    // For now, show a placeholder
    alert('Message Templates coming soon! This will include SMS and text message templates.');
  }

  openEmailTemplates(): void {
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
        console.log('Email template saved:', result);
      }
    });
  }

  openVoiceTemplates(): void {
    // TODO: Implement voice templates
    console.log('Opening Voice Templates...');
    // For now, show a placeholder
    alert('Voice Templates coming soon! This will include voice message and automated call templates.');
  }

  viewAllTemplates(): void {
    console.log('Viewing all templates...');
    // TODO: Implement view all templates
    alert('View All Templates feature coming soon!');
  }

  importTemplates(): void {
    console.log('Importing templates...');
    // TODO: Implement import templates
    alert('Import Templates feature coming soon!');
  }

  exportTemplates(): void {
    console.log('Exporting templates...');
    // TODO: Implement export templates
    alert('Export Templates feature coming soon!');
  }

  onUserMenu(): void {
    // Simple user menu - in a real app, you'd use MatMenu
    const action = confirm(`Welcome ${this.currentUser?.displayName || this.currentUser?.email}!\n\nChoose an action:\nOK = View Profile\nCancel = Sign Out`);
    
    if (action) {
      this.viewProfile();
    } else {
      this.signOut();
    }
  }

  viewProfile(): void {
    alert(`Profile Information:\n\nName: ${this.currentUser?.displayName || 'Not set'}\nEmail: ${this.currentUser?.email}\nUID: ${this.currentUser?.uid}`);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    // Close the dashboard dialog
    this.dialog.closeAll();
  }
}
