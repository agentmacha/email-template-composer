import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  contentHtml: string;
  contentText: string;
  placeholders: string[];
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SimpleTemplateService {
  private baseUrl = 'http://localhost:3001/api'; // Your existing backend

  constructor(private http: HttpClient) {}

  // Save template to your existing Firestore via backend
  saveTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Observable<{id: string}> {
    return this.http.post<{id: string}>(`${this.baseUrl}/templates`, template);
  }

  // Get all templates
  getTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`${this.baseUrl}/templates`);
  }

  // Get single template
  getTemplate(id: string): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`${this.baseUrl}/templates/${id}`);
  }

  // Update template
  updateTemplate(id: string, template: Partial<EmailTemplate>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/templates/${id}`, template);
  }

  // Delete template
  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/templates/${id}`);
  }
}




