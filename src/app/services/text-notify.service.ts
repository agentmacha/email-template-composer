import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface AiRewriteRequest {
  prompt: string;
  mode: 'shorten' | 'expand' | 'friendly';
  tenantId: string;
  clientId: string;
}

export interface AiRewriteResponse {
  text: string;
  success: boolean;
}

export interface AiDesignRequest {
  subject: string;
  brief: string;
  brandColor: string;
  logoUrl: string;
  preferredWidth: number;
  keepPlaceholders: boolean;
  tenantId: string;
  clientId: string;
}

export interface AiDesignResponse {
  html: string;
  subject?: string;
  success: boolean;
}

export interface ImageUploadResponse {
  link: string;
  url: string;
  path: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TextNotifyService {
  private baseUrl = 'http://localhost:3001/api'; // Backend API URL

  constructor(private http: HttpClient) {}

  // AI Content Rewriting
  aiRewrite(request: AiRewriteRequest): Observable<AiRewriteResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AiRewriteResponse>(`${this.baseUrl}/ai/rewrite`, request, { headers });
  }

  // AI Email Design
  aiDesignEmail(request: AiDesignRequest): Observable<AiDesignResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AiDesignResponse>(`${this.baseUrl}/ai/design`, request, { headers });
  }

  // Image Upload
  uploadImage(clientId: string, tenantId: string, file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('clientId', clientId);
    formData.append('tenantId', tenantId);

    return this.http.post<ImageUploadResponse>(`${this.baseUrl}/upload/image`, formData);
  }

  // List Images
  listImages(clientId: string, tenantId: string): Observable<any[]> {
    const params = {
      clientId: clientId,
      tenantId: tenantId
    };

    return this.http.get<any>(`${this.baseUrl}/upload/images`, { params });
  }

  private generateMockRewrittenText(originalText: string, mode: 'shorten' | 'expand' | 'friendly'): string {
    const baseText = originalText.replace(/Rewrite this email text\. Keep placeholders like \{clinic_name\} unchanged\. Mode: \w+\. Text: /, '');
    
    switch (mode) {
      case 'friendly':
        return `Hi there!\n\n${baseText}\n\nThanks so much for your time!\n\nBest regards,\nThe Team`;
      case 'expand':
        return `Dear Valued Customer,\n\n${baseText}\n\nWe truly appreciate your business and look forward to serving you in the future. If you have any questions or concerns, please don't hesitate to reach out to us.\n\nWarm regards,\nThe Customer Service Team`;
      case 'shorten':
        return baseText.split('\n').slice(0, 2).join('\n');
      default:
        return baseText;
    }
  }

  private generateMockEmailHtml(request: AiDesignRequest): string {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff;">
        <div style="background-color: ${request.brandColor}; padding: 20px; text-align: center;">
          <img src="${request.logoUrl}" alt="Logo" style="height: 40px; margin-bottom: 10px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${request.subject}</h1>
        </div>
        <div style="padding: 30px 20px;">
          <p>Dear {patient_name},</p>
          <p>${request.brief}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{schedule_url}" style="background-color: ${request.brandColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule Appointment</a>
          </div>
          <p>Best regards,<br>{clinic_name}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>{clinic_address} | {phone_number} | {clinic_email}</p>
          <p><a href="{unsubscribe_url}" style="color: ${request.brandColor};">Unsubscribe</a></p>
        </div>
      </div>
    `;
  }
}
