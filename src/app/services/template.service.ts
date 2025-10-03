import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface EmailTemplate {
  id?: string;
  organizationId: string;
  userId: string;
  name: string;
  subject: string;
  contentHtml: string;
  contentText: string;
  placeholders: string[];
  category: string;
  isPublic: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Organization {
  id?: string;
  name: string;
  industry: string;
  settings: {
    branding: {
      logo: string;
      colors: string[];
      fonts: string[];
    };
    aiConfig: {
      prompts: string;
      placeholders: string[];
    };
    subscription: {
      plan: string;
      limits: {
        maxTemplates: number;
        maxUsers: number;
        aiCredits: number;
      };
    };
  };
  members: { [userId: string]: string };
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private currentOrganizationId: string = 'demo-org-123';
  private mockTemplates: EmailTemplate[] = [
    {
      id: 'template-1',
      organizationId: 'demo-org-123',
      userId: 'demo-user-123',
      name: 'Welcome Email',
      subject: 'Welcome to our service!',
      contentHtml: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
      contentText: 'Welcome! Thank you for joining us.',
      placeholders: ['{user_name}', '{company_name}'],
      category: 'Welcome',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'template-2',
      organizationId: 'demo-org-123',
      userId: 'demo-user-123',
      name: 'Newsletter',
      subject: 'Monthly Newsletter',
      contentHtml: '<h2>Monthly Update</h2><p>Here are the latest news...</p>',
      contentText: 'Monthly Update: Here are the latest news...',
      placeholders: ['{month}', '{year}'],
      category: 'Newsletter',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    // Initialize with demo organization
  }

  // Save template to Firestore
  saveTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const templateData = {
      ...template,
      id: 'template-' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockTemplates.push(templateData);
    return of(templateData.id).pipe(delay(500));
  }

  // Update existing template
  updateTemplate(templateId: string, updates: Partial<EmailTemplate>): Observable<void> {
    const index = this.mockTemplates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      this.mockTemplates[index] = {
        ...this.mockTemplates[index],
        ...updates,
        updatedAt: new Date()
      };
    }
    return of(undefined).pipe(delay(500));
  }

  // Get templates for current organization
  getTemplates(category?: string, isPublic: boolean = false): Observable<EmailTemplate[]> {
    let templates = this.mockTemplates.filter(t => t.organizationId === this.currentOrganizationId);
    
    if (isPublic) {
      templates = templates.filter(t => t.isPublic);
    }
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }
    
    return of(templates).pipe(delay(500));
  }

  // Get single template
  getTemplate(templateId: string): Observable<EmailTemplate | undefined> {
    const template = this.mockTemplates.find(t => t.id === templateId);
    return of(template).pipe(delay(500));
  }

  // Delete template
  deleteTemplate(templateId: string): Observable<void> {
    const index = this.mockTemplates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      this.mockTemplates.splice(index, 1);
    }
    return of(undefined).pipe(delay(500));
  }

  // Duplicate template
  duplicateTemplate(templateId: string, newName: string): Observable<string> {
    const template = this.mockTemplates.find(t => t.id === templateId);
    if (!template) {
      return throwError('Template not found');
    }

    const duplicateData = {
      ...template,
      id: 'template-' + Date.now(),
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockTemplates.push(duplicateData);
    return of(duplicateData.id).pipe(delay(500));
  }

  // Get organization settings
  getOrganization(): Observable<Organization | undefined> {
    const org: Organization = {
      id: 'demo-org-123',
      name: 'Demo Organization',
      industry: 'Technology',
      settings: {
        branding: {
          logo: '',
          colors: ['#667eea', '#764ba2'],
          fonts: ['Roboto', 'Arial']
        },
        aiConfig: {
          prompts: 'Create professional email templates',
          placeholders: ['{user_name}', '{company_name}', '{date}']
        },
        subscription: {
          plan: 'pro',
          limits: {
            maxTemplates: 100,
            maxUsers: 10,
            aiCredits: 1000
          }
        }
      },
      members: { 'demo-user-123': 'admin' },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return of(org).pipe(delay(500));
  }

  // Create new organization
  createOrganization(orgData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const orgId = 'org-' + Date.now();
    return of(orgId).pipe(delay(500));
  }

  // Get template categories
  getTemplateCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockTemplates.map(t => t.category))];
    return of(categories.sort()).pipe(delay(500));
  }

  // Search templates
  searchTemplates(searchTerm: string): Observable<EmailTemplate[]> {
    const templates = this.mockTemplates.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(templates).pipe(delay(500));
  }
}




