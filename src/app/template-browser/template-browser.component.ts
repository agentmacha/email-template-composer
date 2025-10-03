import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { SimpleTemplateService, EmailTemplate } from '../services/simple-template.service';
import { TemplateViewComponent } from '../template-view/template-view.component';

@Component({
  selector: 'app-template-browser',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="template-browser">
      <div class="header">
        <h2 mat-dialog-title>📧 Saved Email Templates</h2>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="content">
        <div class="stats" *ngIf="templates.length > 0">
          <span class="template-count">{{ templates.length }} template(s) found</span>
          <button mat-stroked-button (click)="refreshTemplates()" [disabled]="loading">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>

        <div class="loading" *ngIf="loading">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Loading templates...</p>
        </div>

        <div class="empty-state" *ngIf="!loading && templates.length === 0">
          <mat-icon>email</mat-icon>
          <h3>No templates found</h3>
          <p>Create your first email template to get started!</p>
        </div>

        <div class="templates-grid" *ngIf="!loading && templates.length > 0">
          <mat-card 
            *ngFor="let template of templates" 
            class="template-card"
            (click)="selectTemplate(template)"
            [class.selected]="selectedTemplate?.id === template.id">
            
            <mat-card-header>
              <mat-card-title>{{ template.name }}</mat-card-title>
              <mat-card-subtitle>{{ template.subject }}</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="template-preview">
                <div [innerHTML]="getPreviewHtml(template.contentHtml)"></div>
              </div>
              
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

            <mat-card-actions>
              <button mat-button (click)="viewTemplate(template)">
                <mat-icon>visibility</mat-icon>
                View
              </button>
              <button mat-button (click)="loadTemplate(template)">
                <mat-icon>edit</mat-icon>
                Load & Edit
              </button>
              <button mat-button (click)="duplicateTemplate(template)">
                <mat-icon>content_copy</mat-icon>
                Duplicate
              </button>
              <button mat-button color="warn" (click)="deleteTemplate(template)">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div class="actions">
        <button mat-button (click)="onClose()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .template-browser {
      width: 90vw;
      max-width: 1200px;
      max-height: 80vh;
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

    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .template-count {
      font-weight: 500;
      color: #666;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .loading mat-icon, .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #1a73e8;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .template-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .template-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .template-card.selected {
      border-color: #1a73e8;
      box-shadow: 0 0 0 1px #1a73e8;
    }

    .template-preview {
      max-height: 120px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      background: #fafafa;
      margin: 12px 0;
    }

    .template-preview p {
      margin: 0 0 8px 0;
      font-size: 14px;
      line-height: 1.4;
    }

    .template-meta {
      margin-top: 12px;
    }

    .template-dates {
      margin-top: 8px;
      color: #666;
      font-size: 12px;
    }

    .template-dates small {
      display: block;
      margin: 2px 0;
    }

    .actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    mat-card-actions {
      padding: 8px 16px 16px 16px;
    }

    mat-card-actions button {
      margin-right: 8px;
    }
  `]
})
export class TemplateBrowserComponent implements OnInit {
  templates: EmailTemplate[] = [];
  selectedTemplate: EmailTemplate | null = null;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<TemplateBrowserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private templateService: SimpleTemplateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.loading = true;
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.loading = false;
        console.log('Loaded templates:', templates);
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.snackBar.open('Error loading templates', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  refreshTemplates() {
    this.loadTemplates();
  }

  selectTemplate(template: EmailTemplate) {
    this.selectedTemplate = template;
  }

  // View template in a modal (read-only)
  viewTemplate(template: EmailTemplate) {
    const viewDialogRef = this.dialog.open(TemplateViewComponent, {
      width: '80vw',
      maxWidth: '1000px',
      height: '80vh',
      data: { template }
    });
  }

  // Load template into the composer for editing
  loadTemplate(template: EmailTemplate) {
    this.dialogRef.close({ action: 'load', template: template });
  }

  duplicateTemplate(template: EmailTemplate) {
    const duplicateData = {
      name: `${template.name} (Copy)`,
      subject: template.subject,
      contentHtml: template.contentHtml,
      contentText: template.contentText,
      placeholders: template.placeholders,
      category: template.category
    };

    this.templateService.saveTemplate(duplicateData).subscribe({
      next: (templateId) => {
        this.snackBar.open('Template duplicated successfully!', 'Close', { duration: 3000 });
        this.loadTemplates(); // Refresh the list
      },
      error: (error) => {
        console.error('Error duplicating template:', error);
        this.snackBar.open('Error duplicating template', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTemplate(template: EmailTemplate) {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      this.templateService.deleteTemplate(template.id!).subscribe({
        next: () => {
          this.snackBar.open('Template deleted successfully!', 'Close', { duration: 3000 });
          this.loadTemplates(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting template:', error);
          this.snackBar.open('Error deleting template', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getPreviewHtml(html: string): string {
    // Clean up HTML for preview
    return html
      .replace(/<div class="spacer"[^>]*><\/div>/g, '') // Remove spacers
      .replace(/<br\s*\/?>/g, ' ') // Replace <br> with spaces
      .substring(0, 200) + (html.length > 200 ? '...' : '');
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

  onClose() {
    this.dialogRef.close({ action: 'cancel' });
  }
}
