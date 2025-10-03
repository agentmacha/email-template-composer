import { Component, Inject, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TextNotifyService } from '../services/text-notify.service';
import { AppStateService } from '../services/app-state.service';
import { SimpleTemplateService, EmailTemplate } from '../services/simple-template.service';
import { TemplateBrowserComponent } from '../template-browser/template-browser.component';
import { TemplateViewComponent } from '../template-view/template-view.component';

@Component({
  selector: 'app-email-composer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatSelectModule,
  ],
  templateUrl: './email-composer.component.html',
  styleUrls: ['./email-composer.component.scss']
})
export class EmailComposerComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  contentText = '';
  contentHtml = '';
  saving = false;

  // AI preview state
  aiLoading = false;
  aiPreviewVisible = false;
  aiPreviewText = '';
  aiPreviewMode: 'shorten' | 'expand' | 'friendly' = 'friendly';
  // New AI input bar state
  aiInputVisible = false;
  aiInputMode: 'write' | 'design' = 'write';
  aiInputText = '';
  recentPrompts = [
    'Salon appointment reminder email',
    'Create promotional offer for hair services',
    'Generate welcome email for new clients',
    'Write holiday special announcement',
    'Create loyalty program update',
    'Generate service cancellation policy'
  ];

  placeholders: string[] = ['{salon_name}', '{client_name}', '{booking_url}', '{phone_number}', '{unsubscribe_url}', '{appointment_date}', '{appointment_time}', '{stylist_name}', '{salon_address}', '{salon_email}', '{salon_website}', '{support_email}', '{support_phone}', '{team_name}', '{org_name}', '{tenant_id}', '{client_id}', '{service_name}', '{service_price}', '{booking_confirmation}', '{salon_hours}', '{special_offer}', '{loyalty_points}'];
  phQuery: string = '';
  propertiesForm: FormGroup | null = null;
  selectedType: 'button' | 'image' | 'spacer' | 'header' | 'header-block' | 'footer' | 'image-text' | null = null;
  selectedElement: HTMLElement | null = null;

  private savedRange: Range | null = null;
  imageUploading = false;
  uploadedImages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmailComposerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private textNotifyService: TextNotifyService,
    private appStateService: AppStateService,
    private templateService: SimpleTemplateService,
    private dialog: MatDialog,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const tpl = this.data?.template;
    if (tpl) {
      const name = tpl.name || '';
      const subject = tpl.subject || '';
      this.form.patchValue({ name, subject });
      const savedHtml: string = tpl.template || tpl.html_template || '';
      if (savedHtml) {
        const bodyHtml = this.extractBody(savedHtml) || savedHtml;
        setTimeout(() => {
          const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
          if (!canvas) return;
          canvas.innerHTML = bodyHtml;
          this.contentText = canvas.innerText;
          this.contentHtml = canvas.innerHTML;
        });
      }
    }
  }

  ngAfterViewInit(): void {
    const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
    if (!canvas) return;
    // Seed blank content only if creating a new template
    if (!canvas.innerHTML?.trim()) {
      const initial = `
        <p>Dear {client_name},</p>
        <p>Write your email here…</p>
        <div class="spacer" style="height:24px"></div>
      `;
      canvas.innerHTML = initial;
      this.contentText = canvas.innerText;
      this.contentHtml = canvas.innerHTML;
    }
    // Ensure Enter creates paragraphs, not just BRs or bare DIVs
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch {}
    canvas.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertParagraph', false);
        this.saveSelection();
        this.contentText = canvas.innerText;
        this.contentHtml = canvas.innerHTML;
      }
    }, { passive: false });
  }

  get filteredPlaceholders(): string[] {
    const q = (this.phQuery || '').toLowerCase();
    if (!q) return this.placeholders;
    return this.placeholders.filter(p => p.toLowerCase().includes(q));
  }

  onCanvasInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.contentText = target?.innerText ?? '';
    this.contentHtml = target?.innerHTML ?? '';
  }

  saveSelection(): void {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0);
    }
  }

  insertAtCaret(text: string): void {
    const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
    if (!canvas) return;
    canvas.focus();
    const sel = window.getSelection();
    if (this.savedRange) {
      sel?.removeAllRanges();
      sel?.addRange(this.savedRange);
    }
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = range.createContextualFragment(text);
      range.insertNode(node);
      range.collapse(false);
      this.contentText = (canvas as HTMLElement).innerText;
      this.contentHtml = (canvas as HTMLElement).innerHTML;
      this.saveSelection();
    }
  }

  insertButtonSnippet(): void {
    const html = '<a href="#" style="color:#1976d2;text-decoration:none;display:inline-block;padding:10px 16px;border-radius:6px;border:1px solid #1976d2">Button</a>';
    this.insertHtmlAtCaret(html);
    this.selectType('button');
  }

  insertImagePlaceholder(): void {
    const html = '<img src="https://via.placeholder.com/600x200" alt="Image" style="max-width:100%"/>';
    this.insertHtmlAtCaret(html);
    this.selectType('image');
  }

  onCanvasDrop(event: CdkDragDrop<any>): void {
    const data: any = (event as any).item?.data;
    if (!data) return;
    if (data.type === 'placeholder') {
      this.insertAtCaret(data.value);
    }
  }

  format(command: 'bold' | 'italic' | 'underline'): void {
    document.execCommand(command, false);
  }

  insertList(): void {
    document.execCommand('insertUnorderedList', false);
  }

  insertLink(): void {
    const url = prompt('Enter URL');
    if (!url) return;
    document.execCommand('createLink', false, url);
  }

  onCanvasClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target) return;
    if (target.closest('a')) { this.selectedElement = target.closest('a') as HTMLElement; this.selectType('button'); }
    else if (target.tagName === 'IMG') { this.selectedElement = target as HTMLElement; this.selectType('image'); }
    else if (target.classList.contains('spacer')) { this.selectedElement = target as HTMLElement; this.selectType('spacer'); }
    else if (target.closest('.composer-header')) { this.selectedElement = target.closest('.composer-header') as HTMLElement; this.selectType('header-block'); }
    else if (target.closest('.composer-footer')) { this.selectedElement = target.closest('.composer-footer') as HTMLElement; this.selectType('footer'); }
    else if (target.closest('.image-text')) { this.selectedElement = target.closest('.image-text') as HTMLElement; this.selectType('image-text'); }
    else if (/^H[1-6]$/.test(target.tagName)) { this.selectedElement = target as HTMLElement; this.selectType('header'); }
    else this.clearSelection();
  }

  private insertHtmlAtCaret(html: string): void {
    const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
    if (!canvas) return;
    canvas.focus();
    const sel = window.getSelection();
    if (this.savedRange) {
      sel?.removeAllRanges();
      sel?.addRange(this.savedRange);
    }
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
      range.collapse(false);
      this.contentText = (canvas as HTMLElement).innerText;
      this.contentHtml = (canvas as HTMLElement).innerHTML;
      this.saveSelection();
    }
  }

  selectType(type: 'button' | 'image' | 'spacer' | 'header' | 'header-block' | 'footer' | 'image-text'): void {
    this.selectedType = type;
    const fb = this.fb;
    if (type === 'button') {
      const link = (this.selectedElement as HTMLAnchorElement | null);
      this.propertiesForm = fb.group({
        preset: ['custom'],
        text: [link?.textContent || 'Button'],
        href: [link?.getAttribute('href') || '#'],
        bg: [link ? (link as HTMLElement).style.background || '#1a73e8' : '#1a73e8'],
        color: ['#ffffff'],
        radius: [link ? (link as HTMLElement).style.borderRadius || '6px' : '6px'],
        align: [(link?.parentElement?.style.textAlign || 'center')]
      });
    } else if (type === 'image') {
      const img = (this.selectedElement as HTMLImageElement | null);
      this.propertiesForm = fb.group({
        src: [img?.src || 'https://via.placeholder.com/600x200'],
        alt: [img?.alt || 'Image'],
        width: [img ? (img as HTMLImageElement).style.width || '100%' : '100%'],
        align: [(img?.parentElement?.style.textAlign || 'left')]
      });
    } else if (type === 'spacer') {
      const sp = (this.selectedElement as HTMLElement | null);
      this.propertiesForm = fb.group({ height: [sp?.style.height || '20px'] });
    } else if (type === 'header') {
      const h = (this.selectedElement as HTMLElement | null);
      this.propertiesForm = fb.group({ text: [h?.textContent || 'Header'], align: [h?.style.textAlign || 'left'], fontSize: [h?.style.fontSize || '24px'] });
    } else if (type === 'image-text') {
      const block = (this.selectedElement as HTMLElement | null);
      const img = block?.querySelector('img') as HTMLImageElement | null;
      const txt = block?.querySelector('.it-text') as HTMLElement | null;
      const row = block?.querySelector('.it-row') as HTMLElement | null;
      this.propertiesForm = fb.group({
        src: [img?.src || 'https://via.placeholder.com/300x200'],
        alt: [img?.alt || 'Image'],
        imgWidth: [img?.style.width || '40%'],
        orientation: [row?.style.flexDirection === 'row-reverse' ? 'image-right' : 'image-left'],
        text: [txt?.innerText || 'Your text here…']
      });
    } else if (type === 'header-block') {
      const block = (this.selectedElement as HTMLElement | null);
      const logo = block?.querySelector('.ch-logo') as HTMLImageElement | null;
      const name = block?.querySelector('.ch-name') as HTMLElement | null;
      const addr = block?.querySelector('.ch-address') as HTMLElement | null;
      const email = block?.querySelector('.ch-email') as HTMLAnchorElement | null;
      this.propertiesForm = fb.group({
        logoSrc: [logo?.src || '{salon_logo}'],
        salonName: [name?.textContent || '{salon_name}'],
        addressLine: [addr?.textContent || '{salon_address} | {phone_number} | {salon_email}'],
        emailHref: [email?.getAttribute('href') || 'mailto:{salon_email}'],
        color: [name ? (name as HTMLElement).style.color || '#1a73e8' : '#1a73e8']
      });
    } else if (type === 'footer') {
      const block = (this.selectedElement as HTMLElement | null);
      const brand = block?.querySelector('.cf-brand') as HTMLElement | null;
      const unsub = block?.querySelector('.cf-unsub') as HTMLAnchorElement | null;
      this.propertiesForm = fb.group({
        brandLine: [brand?.textContent || '{salon_name} © {current_year} | Your Beauty Destination.'],
        unsubText: [unsub?.textContent || 'Unsubscribe'],
        unsubHref: [unsub?.getAttribute('href') || '{unsubscribe_url}']
      });
    }
    this.propertiesForm?.valueChanges.subscribe((v: any) => this.applyProperties(v));
  }

  clearSelection(): void {
    this.selectedType = null;
    this.propertiesForm = null;
    this.selectedElement = null;
  }

  private applyProperties(values: any): void {
    const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
    if (!canvas || !this.selectedType) return;
    if (this.selectedType === 'button') {
      const link = (this.selectedElement as HTMLElement) || canvas.querySelector('a');
      if (!link) return;
      // Apply preset mapping
      if (values.preset && values.preset !== 'custom') {
        const presetMap: any = {
          call: { text: 'Call Us', href: 'tel:{phone_number}', bg: '#666' },
          schedule: { text: 'Schedule Online', href: '{schedule_url}', bg: '#f29900' },
          directions: { text: 'Get Directions', href: '{maps_url}', bg: '#00bcd4' },
          review: { text: 'Leave a Review', href: '{clinic_url}', bg: '#1a73e8' }
        };
        const p = presetMap[values.preset];
        values.text = p.text;
        values.href = p.href;
        values.bg = p.bg;
      }
      link.textContent = values.text ?? 'Button';
      (link as HTMLAnchorElement).setAttribute('href', values.href ?? '#');
      (link as HTMLElement).style.background = values.bg || '';
      (link as HTMLElement).style.color = values.color || '#1976d2';
      (link as HTMLElement).style.borderRadius = values.radius || '6px';
      (link.parentElement as HTMLElement | null)?.style?.setProperty('text-align', values.align || 'left');
    } else if (this.selectedType === 'image') {
      const img = (this.selectedElement as HTMLElement) || canvas.querySelector('img');
      if (!img) return;
      const normalizedSrc = this.normalizeImageUrl(values.src || (img as HTMLImageElement).src);
      (img as HTMLImageElement).src = normalizedSrc;
      (img as HTMLImageElement).alt = values.alt || 'Image';
      (img as HTMLImageElement).style.width = values.width || '100%';
      (img.parentElement as HTMLElement | null)?.style?.setProperty('text-align', values.align || 'left');
    } else if (this.selectedType === 'spacer') {
      const sp = (this.selectedElement as HTMLElement) || canvas.querySelector('.spacer');
      if (!sp) return;
      (sp as HTMLElement).style.height = values.height || '20px';
    } else if (this.selectedType === 'header') {
      const h = (this.selectedElement as HTMLElement) || canvas.querySelector('h2, h1, h3');
      if (!h) return;
      h.textContent = values.text || 'Header';
      (h as HTMLElement).style.textAlign = values.align || 'left';
      (h as HTMLElement).style.fontSize = values.fontSize || '24px';
    } else if (this.selectedType === 'header-block') {
      const block = (this.selectedElement as HTMLElement) || canvas.querySelector('.composer-header');
      if (!block) return;
      const logo = block.querySelector('.ch-logo') as HTMLImageElement | null;
      const name = block.querySelector('.ch-name') as HTMLElement | null;
      const addr = block.querySelector('.ch-address') as HTMLElement | null;
      const email = block.querySelector('.ch-email') as HTMLAnchorElement | null;
      if (logo && values.logoSrc) logo.src = this.normalizeImageUrl(values.logoSrc);
      if (name && values.salonName) name.textContent = values.salonName;
      if (addr && values.addressLine) addr.textContent = values.addressLine;
      if (email && values.emailHref) email.setAttribute('href', values.emailHref);
      if (name && values.color) (name as HTMLElement).style.color = values.color;
    } else if (this.selectedType === 'footer') {
      const block = (this.selectedElement as HTMLElement) || canvas.querySelector('.composer-footer');
      if (!block) return;
      const brand = block.querySelector('.cf-brand') as HTMLElement | null;
      const unsub = block.querySelector('.cf-unsub') as HTMLAnchorElement | null;
      if (brand && values.brandLine) brand.textContent = values.brandLine;
      if (unsub && values.unsubText) unsub.textContent = values.unsubText;
      if (unsub && values.unsubHref) unsub.setAttribute('href', values.unsubHref);
    } else if (this.selectedType === 'image-text') {
      const block = (this.selectedElement as HTMLElement) || canvas.querySelector('.image-text');
      if (!block) return;
      const img = block.querySelector('img') as HTMLImageElement | null;
      const txt = block.querySelector('.it-text') as HTMLElement | null;
      if (img) {
        img.src = values.src || img.src;
        img.alt = values.alt || 'Image';
        img.style.width = values.imgWidth || '40%';
      }
      if (txt) txt.innerText = values.text || 'Your text here…';
      const row = block.querySelector('.it-row') as HTMLElement | null;
      if (row) {
        row.style.flexDirection = values.orientation === 'image-right' ? 'row-reverse' : 'row';
      }
    }
    // Keep internal state in sync so Save uses latest DOM edits
    this.contentText = canvas.innerText;
    this.contentHtml = canvas.innerHTML;
  }

  insertHeader(): void {
    const html = '<div class="composer-header" style="text-align:center;">' +
      '<img class="ch-logo" src="{salon_logo}" alt="{salon_name}" style="height:24px; display:block; margin:8px auto 4px auto;"/>' +
      '<h2 class="ch-name" style="margin:0; color:#1a73e8;">{salon_name}</h2>' +
      '<div class="ch-address" style="margin-top:6px; font-size:12px; color:#1a73e8;">{salon_address} | {phone_number} | <a class="ch-email" href="mailto:{salon_email}" style="color:#1a73e8">{salon_email}</a></div>' +
      '</div>';
    this.insertHtmlAtCaret(html);
    this.selectedElement = document.querySelector('.composer-canvas .composer-header:last-of-type') as HTMLElement | null;
    this.selectType('header-block');
  }

  insertSpacer(): void {
    const html = '<div class="spacer" style="height:20px"></div>';
    this.insertHtmlAtCaret(html);
    this.selectType('spacer');
  }

  insertFooter(): void {
    const html = '<div class="composer-footer" style="text-align:center; padding:16px; background:#f8f9fa; border-top:1px solid #e0e0e0; margin-top:24px;">' +
      '<div class="cf-brand" style="font-size:12px; color:#666; margin-bottom:8px;">{salon_name} © {current_year} | Your Beauty Destination.</div>' +
      '<div style="font-size:11px; color:#999;">' +
        '<a href="{unsubscribe_url}" class="cf-unsub" style="color:#999; text-decoration:none;">Unsubscribe</a>' +
      '</div>' +
      '</div>';
    this.insertHtmlAtCaret(html);
    this.selectedElement = document.querySelector('.composer-canvas .composer-footer:last-of-type') as HTMLElement | null;
    this.selectType('footer');
  }

  // Save template to GCP Firestore
  saveTemplate(): void {
    if (!this.form.valid) {
      this.snackBar.open('Please fill in template name and subject', 'Close', { duration: 3000 });
      return;
    }

    const canvas = document.querySelector('.composer-canvas') as HTMLElement;
    if (!canvas) {
      this.snackBar.open('No content to save', 'Close', { duration: 3000 });
      return;
    }

    const templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
      name: this.form.value.name,
      subject: this.form.value.subject,
      contentHtml: canvas.innerHTML,
      contentText: canvas.innerText,
      placeholders: this.extractPlaceholders(canvas.innerHTML),
      category: 'custom'
    };

    this.templateService.saveTemplate(templateData).subscribe({
      next: (templateId) => {
        this.snackBar.open(`Template saved successfully! ID: ${templateId}`, 'Close', { duration: 5000 });
        console.log('Template saved to GCP Firestore:', templateId);
        console.log('Template data:', templateData);
      },
      error: (error) => {
        console.error('Error saving template:', error);
        this.snackBar.open('Error saving template. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  // Extract placeholders from HTML content
  private extractPlaceholders(html: string): string[] {
    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders = new Set<string>();
    let match;

    while ((match = placeholderRegex.exec(html)) !== null) {
      placeholders.add(`{${match[1]}}`);
    }

    return Array.from(placeholders);
  }


  // Open template browser to view and load saved templates
  getSavedTemplates(): void {
    const dialogRef = this.dialog.open(TemplateBrowserComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '80vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'load' && result.template) {
        this.loadTemplate(result.template);
      }
    });
  }

  // Open template view dialog
  viewTemplate(template: EmailTemplate): void {
    const dialogRef = this.dialog.open(TemplateViewComponent, {
      width: '80vw',
      maxWidth: '1000px',
      height: '80vh',
      data: { template }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'load' && result.template) {
        this.loadTemplate(result.template);
      }
    });
  }

  // Load a specific template into the composer
  loadTemplate(template: EmailTemplate): void {
    this.form.patchValue({
      name: template.name,
      subject: template.subject
    });

    const canvas = document.querySelector('.composer-canvas') as HTMLElement;
    if (canvas) {
      canvas.innerHTML = template.contentHtml;
      this.contentText = template.contentText;
      this.contentHtml = template.contentHtml;
    }

    this.snackBar.open(`Template loaded: ${template.name}`, 'Close', { duration: 3000 });
  }

  insertTwoColumn(): void {
    const html = '<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="width:50%; vertical-align:top; padding-right:8px;">Left</td><td style="width:50%; vertical-align:top; padding-left:8px;">Right</td></tr></table>';
    this.insertHtmlAtCaret(html);
    this.clearSelection();
  }

  insertImageText(): void {
    const html = '<div class="image-text"><div class="it-row" style="display:flex; gap:12px; align-items:flex-start;">' +
      '<img src="https://via.placeholder.com/300x200" alt="Image" style="width:40%; max-width:100%"/>' +
      '<div class="it-text" style="flex:1;">Your text here…</div>' +
    '</div></div>';
    this.insertHtmlAtCaret(html);
    this.selectedElement = document.querySelector('.composer-canvas .image-text:last-of-type') as HTMLElement | null;
    this.selectType('image-text');
  }

  private makeButton(label: string, href: string, color: string = '#1a73e8'): string {
    return `<a href="${href}" style="background:${color}; color:#fff; text-decoration:none; display:inline-block; padding:10px 16px; border-radius:6px;">${label}</a>`;
  }

  insertCallButton(): void {
    const html = this.makeButton('Call Salon', 'tel:{phone_number}');
    this.insertHtmlAtCaret(html);
    this.selectedElement = document.querySelector('.composer-canvas a:last-of-type') as HTMLElement | null;
    this.selectType('button');
  }

  insertScheduleButton(): void {
    const html = this.makeButton('Book Appointment', '{booking_url}');
    this.insertHtmlAtCaret(html);
    this.selectedElement = document.querySelector('.composer-canvas a:last-of-type') as HTMLElement | null;
    this.selectType('button');
  }

  insertDirectionsButton(): void {
    const html = this.makeButton('Visit Salon', '{maps_url}');
    this.insertHtmlAtCaret(html);
    this.selectedElement = document.querySelector('.composer-canvas a:last-of-type') as HTMLElement | null;
    this.selectType('button');
  }

  insertButtonRow(): void {
    const row = '<div class="btn-row" style="display:flex; gap:12px; justify-content:center;">' +
      this.makeButton('Call Salon', 'tel:{phone_number}', '#666') +
      this.makeButton('Book Appointment', '{booking_url}', '#f29900') +
      this.makeButton('Visit Salon', '{maps_url}', '#00bcd4') +
    '</div>';
    this.insertHtmlAtCaret(row);
    this.clearSelection();
  }

  // AI Methods
  aiForImageText(mode: 'shorten' | 'expand' | 'friendly'): void {
    this.aiPreviewMode = mode;
    this.callAi(mode);
  }

  onAiGeneratePreview(mode: 'shorten' | 'expand' | 'friendly'): void {
    this.aiPreviewMode = mode;
    this.callAi(mode);
  }

  refineAiPreview(mode: 'shorten' | 'expand' | 'friendly'): void {
    this.onAiGeneratePreview(mode);
  }

  recreateAiPreview(): void {
    this.onAiGeneratePreview(this.aiPreviewMode);
  }

  closeAiPreview(): void {
    this.aiPreviewVisible = false;
    this.aiPreviewText = '';
  }

  private callAi(mode: 'shorten' | 'expand' | 'friendly'): void {
    if (this.aiLoading) return;
    const selection = window.getSelection();
    let selectedText = selection && selection.toString() ? selection.toString() : this.contentText;
    if (this.selectedType === 'image-text' && this.selectedElement) {
      const txt = this.selectedElement.querySelector('.it-text') as HTMLElement | null;
      if (txt && txt.innerText.trim()) selectedText = txt.innerText.trim();
    }
    if (!selectedText) return;

    const state: any = this.appStateService.getState();
    const clientId = state?.clientInfo?.clientId || state?.clientId || '';
    const tenantId = state?.clientInfo?.tenantId || state?.tenantId || state?.orgTenantId || '';
    if (!clientId || !tenantId) {
      this.snackBar.open('Missing client or tenant info for AI', 'Close', { duration: 3000 });
      return;
    }

    this.aiLoading = true;
    const prompt = `Rewrite this email text. Keep placeholders like {salon_name}, {client_name}, {stylist_name} unchanged. Mode: ${mode}. Text: ${selectedText}`;
    this.textNotifyService.aiRewrite({ prompt, mode, tenantId, clientId }).subscribe({
      next: (res) => {
        const raw = res?.text || '';
        const parsed = this.extractSubjectFromText(raw);
        if (parsed.subject) {
          this.form.patchValue({ subject: parsed.subject });
        }
        this.aiPreviewText = parsed.body;
        this.aiPreviewVisible = true;
        this.aiLoading = false;
        if (!this.aiPreviewText) {
          this.snackBar.open('AI returned empty text', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('AI rewrite error', err);
        const msg = err?.error?.message || err?.message || 'AI request failed';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        this.aiLoading = false;
      }
    });
  }

  // New AI input bar controls
  openAiWriteBar(): void {
    this.aiInputMode = 'write';
    this.aiInputVisible = true;
    this.aiInputText = '';
  }
  openAiDesignBar(): void {
    this.aiInputMode = 'design';
    this.aiInputVisible = true;
    this.aiInputText = '';
  }
  closeAiInputBar(): void {
    this.aiInputVisible = false;
    this.aiInputText = '';
  }

  onRecentPromptClick(prompt: string): void {
    this.aiInputText = prompt;
    this.onAiGenerateFromInput();
  }
  
  onAiGenerateFromInput(mode?: 'shorten' | 'expand' | 'friendly'): void {
    if (!this.aiInputText?.trim()) return;
    const selectedMode = mode || 'friendly';
    this.aiPreviewMode = selectedMode;
    this.callAiWithText(this.aiInputText.trim(), selectedMode);
  }
  private callAiWithText(text: string, mode: 'shorten' | 'expand' | 'friendly'): void {
    if (this.aiLoading) return;
    const state: any = this.appStateService.getState();
    const clientId = state?.clientInfo?.clientId || state?.clientId || '';
    const tenantId = state?.clientInfo?.tenantId || state?.tenantId || state?.orgTenantId || '';
    if (!clientId || !tenantId) {
      this.snackBar.open('Missing client or tenant info for AI', 'Close', { duration: 3000 });
      return;
    }
    this.aiLoading = true;
    this.snackBar.open('AI is rewriting your content...', '', { duration: 2000 });
    const prompt = `Rewrite this email text. Keep placeholders like {salon_name}, {client_name}, {stylist_name} unchanged. Mode: ${mode}. Text: ${text}`;
    this.textNotifyService.aiRewrite({ prompt, mode, tenantId, clientId }).subscribe({
      next: (res) => {
        const raw = res?.text || '';
        const parsed = this.extractSubjectFromText(raw);
        if (parsed.subject) {
          this.form.patchValue({ subject: parsed.subject });
        }
        this.aiPreviewText = parsed.body;
        this.aiPreviewVisible = true;
        this.aiLoading = false;
        if (!this.aiPreviewText) {
          this.snackBar.open('AI returned empty text', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('AI rewrite error', err);
        const msg = err?.error?.message || err?.message || 'AI request failed';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        this.aiLoading = false;
      }
    });
  }
  designWithAiFromInput(): void {
    const brief = this.aiInputText?.trim();
    if (!brief) return;
    this.designWithAi(brief);
  }

  // Generate full HTML design
  designWithAi(overrideBrief?: string): void {
    if (this.aiLoading) return;
    const state: any = this.appStateService.getState();
    const clientId = state?.clientInfo?.clientId || state?.clientId || '';
    const tenantId = state?.clientInfo?.tenantId || state?.tenantId || state?.orgTenantId || '';
    if (!clientId || !tenantId) {
      this.snackBar.open('Missing client or tenant info for AI design', 'Close', { duration: 3000 });
      return;
    }
    const { name, subject } = this.form.value;
    const sourceText = overrideBrief ?? this.contentText;
    const brief = (sourceText || '').trim() || 'Create a clean, accessible, mobile-friendly email design.';
    const body = {
      subject: subject || name || 'Email',
      brief,
      brandColor: '#1a73e8',
      logoUrl: 'https://storage.googleapis.com/cdn.tensorlinks.app/cdn-buckets/tensorlinks/assets/tensorlinks_logo.png',
      preferredWidth: 600,
      keepPlaceholders: true,
      tenantId,
      clientId,
    };
    this.aiLoading = true;
    this.snackBar.open('AI is designing your email template...', '', { duration: 3000 });
    this.textNotifyService.aiDesignEmail(body).subscribe({
      next: (res) => {
        const html = (res?.html || '').trim();
        if (!html) { this.aiLoading = false; return; }
        const safe = this.sanitizeEmailHtml(html);
        const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
        if (!canvas) { this.aiLoading = false; return; }
        canvas.innerHTML = safe;
        this.contentText = canvas.innerText;
        this.contentHtml = canvas.innerHTML;
        // If backend provides a subject, or we can parse one, set it into form
        const returnedSubject = (res as any)?.subject || this.tryExtractSubjectFromHtml(html);
        if (returnedSubject) {
          this.form.patchValue({ subject: returnedSubject });
        }
        this.aiLoading = false;
      },
      error: (err) => {
        console.error('AI design error', err);
        const msg = err?.error?.message || err?.message || 'AI design failed';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        this.aiLoading = false;
      }
    });
  }

  private sanitizeEmailHtml(html: string): string {
    // Basic sanitization: strip <script>, <style> tags, and ensure https images only
    let out = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    out = out.replace(/\s(src)=\"(?!https?:)[^\"]*\"/gi, '');
    // Remove javascript: and data: links in href
    out = out.replace(/\s(href)=\"(javascript:|data:)[^\"]*\"/gi, '');
    return out;
  }

  private tryExtractSubjectFromHtml(html: string): string | null {
    // Heuristics: look for first h1/h2 or a line starting with "Subject:" in the content
    const hMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (hMatch && hMatch[1]) {
      const text = hMatch[1].replace(/<[^>]+>/g, '').trim();
      if (text) return text;
    }
    const subjMatch = html.match(/Subject\s*:\s*([^\n<]+)/i);
    if (subjMatch && subjMatch[1]) {
      return subjMatch[1].trim();
    }
    return null;
  }

  private extractSubjectFromText(text: string): { subject: string | null; body: string } {
    if (!text) return { subject: null, body: '' };
    // Look for a line beginning with Subject: ... (case-insensitive)
    const lines = text.split(/\r?\n/);
    let subject: string | null = null;
    const bodyLines: string[] = [];
    for (const line of lines) {
      const m = line.match(/^\s*subject\s*:\s*(.+)$/i);
      if (!subject && m && m[1]) {
        subject = m[1].trim();
        continue; // skip adding this line to body
      }
      bodyLines.push(line);
    }
    const body = bodyLines.join('\n').trim();
    return { subject, body };
  }

  applyAiPreview(): void {
    if (!this.aiPreviewText) return;
    const sel = window.getSelection();
    const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
    if (!canvas) return;
    canvas.focus();
    if (this.selectedType === 'image-text' && this.selectedElement) {
      const txt = this.selectedElement.querySelector('.it-text') as HTMLElement | null;
      if (txt) {
        txt.innerHTML = this.convertTextToEmailHtml(this.aiPreviewText);
        this.contentText = canvas.innerText;
        this.contentHtml = canvas.innerHTML;
        this.closeAiPreview();
        return;
      }
    }
    if (this.savedRange) {
      sel?.removeAllRanges();
      sel?.addRange(this.savedRange);
    }
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const html = this.convertTextToEmailHtml(this.aiPreviewText);
      range.insertNode(range.createContextualFragment(html));
      range.collapse(false);
      this.contentText = canvas.innerText;
      this.contentHtml = canvas.innerHTML;
      this.saveSelection();
    } else {
      const html = this.convertTextToEmailHtml(this.aiPreviewText);
      // Wrap paragraphs in a single container to avoid stray margins collapsing oddly
      canvas.innerHTML = `<div>${html}</div>`;
      this.contentText = canvas.innerText;
      this.contentHtml = canvas.innerHTML;
    }
    this.closeAiPreview();
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const { name, subject } = this.form.value;
    const html = this.generateSimpleHtml(subject, this.contentHtml);
    this.dialogRef.close({ name, subject, template: html, template_structure: null });
  }

  private generateSimpleHtml(subject: string, bodyHtml: string): string {
    // Match legacy template typography to keep old and new consistent
    return `<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"></head><body style=\"font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#333;\"><div style=\"font-family:inherit; font-size:inherit; line-height:inherit; color:inherit;\">${bodyHtml}</div></body></html>`;
  }

  private extractBody(html: string): string | null {
    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return match ? match[1] : null;
  }

  private normalizeImageUrl(url: string): string {
    const val = (url || '').trim();
    if (!val) return '';
    if (/^\d{2,4}x\d{2,4}$/i.test(val)) return `https://via.placeholder.com/${val}`;
    if (/^data:image\//i.test(val)) return val;
    if (/^https?:\/\//i.test(val)) return val;
    if (/^www\./i.test(val)) return `https://${val}`;
    if (/^storage\.googleapis\.com\//i.test(val)) return `https://${val}`;
    return val;
  }

  private convertTextToEmailHtml(text: string): string {
    const safe = (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const normalized = safe.replace(/\r\n/g, '\n');
    // Treat a single blank line or a single line-break as a new paragraph to ensure spacing
    const chunks = normalized
      .split(/\n\s*\n|\n/g)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    return chunks.map(p => `<p>${p}</p>`).join('');
  }

  // Image upload methods
  triggerImageUpload(): void {
    const input = document.getElementById('composerImageInput') as HTMLInputElement | null;
    if (input) input.click();
  }

  onToolbarImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const state = this.appStateService.getState();
    const clientId = state?.clientId || '';
    const tenantId = state?.orgTenantId || state?.orgId || '';
    if (!clientId || !tenantId) {
      console.warn('Missing clientId or tenantId for upload');
      return;
    }
    this.imageUploading = true;
    this.textNotifyService.uploadImage(clientId, tenantId, file).subscribe({
      next: (res) => {
        const url = res?.link || res?.url || res?.path || '';
        this.imageUploading = false;
        if (!url) return;
        const canvas = document.querySelector('.composer-canvas') as HTMLElement | null;
        if (!canvas) return;
        if (this.selectedType === 'image' && this.selectedElement && this.selectedElement.tagName === 'IMG') {
          (this.selectedElement as HTMLImageElement).src = url;
          this.propertiesForm?.patchValue({ src: url });
          this.contentHtml = canvas.innerHTML;
          this.contentText = canvas.innerText;
          this.saveSelection();
        } else if (this.selectedType === 'header-block') {
          const block = (this.selectedElement as HTMLElement) || canvas.querySelector('.composer-header');
          const logo = block?.querySelector('.ch-logo') as HTMLImageElement | null;
          if (logo) logo.src = url;
          this.propertiesForm?.patchValue({ logoSrc: url });
          this.contentHtml = canvas.innerHTML;
          this.contentText = canvas.innerText;
          this.saveSelection();
        } else {
          this.insertHtmlAtCaret(`<img src="${url}" alt="Image" style="max-width:100%; height:auto; display:block; margin:8px 0;"/>`);
        }
      },
      error: (err) => {
        console.error('Image upload failed', err);
        this.imageUploading = false;
      }
    });
    input.value = '';
  }
}
