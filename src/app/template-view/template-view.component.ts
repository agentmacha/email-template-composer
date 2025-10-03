import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { EmailTemplate } from '../services/simple-template.service';

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="template-view">
      <div class="header">
        <h2 mat-dialog-title>👁️ View Template</h2>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="content">
        <mat-card class="template-info">
          <mat-card-header>
            <mat-card-title>{{ template.name }}</mat-card-title>
            <mat-card-subtitle>{{ template.subject }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="template-meta">
              <mat-chip-set>
                <mat-chip>{{ template.category }}</mat-chip>
                <mat-chip *ngIf="template.placeholders.length > 0">
                  {{ template.placeholders.length }} placeholder(s)
                </mat-chip>
              </mat-chip-set>
              
              <div class="template-dates">
                <small>Created: {{ formatDate(template.createdAt) }}</small>
                <small *ngIf="template.updatedAt !== template.createdAt">
                  Updated: {{ formatDate(template.updatedAt) }}
                </small>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="template-preview">
          <h3>📧 Email Preview</h3>
          <div class="email-container">
            <div class="email-content" [innerHTML]="template.contentHtml"></div>
          </div>
        </div>

        <div class="template-text" *ngIf="template.contentText">
          <h3>📝 Plain Text Version</h3>
          <div class="text-content">
            <pre>{{ template.contentText }}</pre>
          </div>
        </div>

        <div class="placeholders" *ngIf="template.placeholders.length > 0">
          <h3>🏷️ Placeholders Used</h3>
          <div class="placeholder-list">
            <mat-chip *ngFor="let placeholder of template.placeholders" class="placeholder-chip">
              {{ placeholder }}
            </mat-chip>
          </div>
        </div>
      </div>

      <div class="actions">
        <button mat-button (click)="onClose()">Close</button>
        <button mat-flat-button color="primary" (click)="loadForEditing()">
          <mat-icon>edit</mat-icon>
          Load for Editing
        </button>
      </div>
    </div>
  `,
  styles: [`
    .template-view {
      width: 90vw;
      max-width: 1200px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h2 {
      margin: 0;
      color: #1a73e8;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .template-info {
      margin-bottom: 24px;
    }

    .template-meta {
      margin-top: 16px;
    }

    .template-dates {
      margin-top: 12px;
      color: #666;
      font-size: 12px;
    }

    .template-dates small {
      display: block;
      margin: 2px 0;
    }

    .template-preview {
      margin-bottom: 24px;
    }

    .template-preview h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .email-container {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }

    .email-content {
      padding: 24px;
      background: #fafafa;
      min-height: 200px;
    }

    .email-content p {
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .email-content h1, .email-content h2, .email-content h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .template-text {
      margin-bottom: 24px;
    }

    .template-text h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .text-content {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background: #f8f9fa;
    }

    .text-content pre {
      margin: 0;
      white-space: pre-wrap;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.4;
    }

    .placeholders h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .placeholder-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .placeholder-chip {
      background: #e3f2fd;
      color: #1976d2;
      font-family: 'Courier New', monospace;
    }

    .actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class TemplateViewComponent {
  template: EmailTemplate;

  constructor(
    private dialogRef: MatDialogRef<TemplateViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { template: EmailTemplate }
  ) {
    this.template = data.template;
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'Unknown';
    
    let date: Date;
    if (timestamp._seconds) {
      // Firestore timestamp
      date = new Date(timestamp._seconds * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  loadForEditing() {
    this.dialogRef.close({ action: 'load', template: this.template });
  }

  onClose() {
    this.dialogRef.close({ action: 'cancel' });
  }
}




