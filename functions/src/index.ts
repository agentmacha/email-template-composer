import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { OpenAI } from 'openai';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: functions.config().openai?.key || process.env.OPENAI_API_KEY,
});

// CORS middleware
const corsHandler = cors({ origin: true });

// Industry configurations
const INDUSTRY_CONFIGS = {
  salon: {
    placeholders: ['{salon_name}', '{client_name}', '{stylist_name}', '{service_name}', '{appointment_date}'],
    aiPrompts: 'salon business terminology (clients, salon, stylists, services, appointments)',
    templates: 'salon-specific templates',
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
  },
  healthcare: {
    placeholders: ['{clinic_name}', '{patient_name}', '{doctor_name}', '{appointment_date}', '{service_name}'],
    aiPrompts: 'healthcare terminology (patients, clinic, doctors, appointments, medical services)',
    templates: 'medical templates',
    colors: ['#2c3e50', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c']
  },
  restaurant: {
    placeholders: ['{restaurant_name}', '{customer_name}', '{chef_name}', '{reservation_date}', '{menu_item}'],
    aiPrompts: 'restaurant terminology (customers, restaurant, chefs, reservations, menu items)',
    templates: 'food service templates',
    colors: ['#e67e22', '#f39c12', '#d35400', '#c0392b', '#8e44ad']
  },
  retail: {
    placeholders: ['{store_name}', '{customer_name}', '{product_name}', '{order_date}', '{sale_price}'],
    aiPrompts: 'retail terminology (customers, store, products, orders, sales)',
    templates: 'retail templates',
    colors: ['#27ae60', '#2ecc71', '#16a085', '#f1c40f', '#e67e22']
  }
};

// AI Rewrite Function
export const aiRewrite = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { prompt, mode = 'friendly', organizationId } = data;
  
  if (!prompt) {
    throw new functions.https.HttpsError('invalid-argument', 'Prompt is required');
  }

  try {
    // Get organization settings
    const orgDoc = await admin.firestore().collection('organizations').doc(organizationId).get();
    const orgData = orgDoc.data();
    const industry = orgData?.industry || 'salon';
    const industryConfig = INDUSTRY_CONFIGS[industry as keyof typeof INDUSTRY_CONFIGS] || INDUSTRY_CONFIGS.salon;

    // Create system prompt based on mode and industry
    const systemPrompts = {
      friendly: `You are a helpful assistant that rewrites email text to be more friendly, warm, and approachable while maintaining professionalism. This is for a ${industry.toUpperCase()} BUSINESS, so use ${industryConfig.aiPrompts}. Keep all placeholders like ${industryConfig.placeholders.join(', ')} unchanged.`,
      expand: `You are a helpful assistant that expands and elaborates on email text to provide more detail and context while maintaining the original message. This is for a ${industry.toUpperCase()} BUSINESS, so use ${industryConfig.aiPrompts}. Keep all placeholders like ${industryConfig.placeholders.join(', ')} unchanged.`,
      shorten: `You are a helpful assistant that shortens and condenses email text to be more concise while keeping the essential information. This is for a ${industry.toUpperCase()} BUSINESS, so use ${industryConfig.aiPrompts}. Keep all placeholders like ${industryConfig.placeholders.join(', ')} unchanged.`
    };

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.friendly;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return {
      success: true,
      text: completion.choices[0].message.content,
      mode,
      usage: completion.usage
    };

  } catch (error) {
    console.error('AI Rewrite Error:', error);
    throw new functions.https.HttpsError('internal', 'AI processing failed');
  }
});

// AI Design Function
export const aiDesign = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { subject, brief, brandColor, logoUrl, preferredWidth, organizationId } = data;
  
  if (!brief) {
    throw new functions.https.HttpsError('invalid-argument', 'Brief is required');
  }

  try {
    // Get organization settings
    const orgDoc = await admin.firestore().collection('organizations').doc(organizationId).get();
    const orgData = orgDoc.data();
    const industry = orgData?.industry || 'salon';
    const industryConfig = INDUSTRY_CONFIGS[industry as keyof typeof INDUSTRY_CONFIGS] || INDUSTRY_CONFIGS.salon;

    const systemPrompt = `You are an expert email template designer. Create a professional, mobile-responsive HTML email template based on the user's requirements.

Requirements:
- Use inline CSS for email client compatibility
- Make it mobile-responsive with max-width: ${preferredWidth || 600}px
- Use professional ${industry.toUpperCase()} styling with modern, elegant design
- Include proper email HTML structure with DOCTYPE, head, and body
- Use the brand color: ${brandColor || '#1a73e8'}
- Logo URL: ${logoUrl || 'placeholder'}
- Preferred width: ${preferredWidth || 600}px
- Keep placeholders like ${industryConfig.placeholders.join(', ')} if requested
- Use clean, modern design principles suitable for ${industry} business
- Include proper spacing and typography
- Make it accessible and professional
- Use ${industry}-appropriate colors and styling

Return only the HTML code, no explanations.`;

    const userPrompt = `Create an email template for: ${subject || 'Email'}

Brief: ${brief}

Make it professional and suitable for ${industry.toUpperCase()} business use. Use ${industryConfig.aiPrompts}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    return {
      success: true,
      html: completion.choices[0].message.content,
      subject: subject || 'Email',
      usage: completion.usage
    };

  } catch (error) {
    console.error('AI Design Error:', error);
    throw new functions.https.HttpsError('internal', 'AI design failed');
  }
});

// Template Management Functions
export const saveTemplate = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { templateData, organizationId } = data;
  
  try {
    const templateRef = admin.firestore().collection('templates').doc();
    
    await templateRef.set({
      ...templateData,
      organizationId,
      userId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      templateId: templateRef.id
    };

  } catch (error) {
    console.error('Save Template Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to save template');
  }
});

export const getTemplates = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { organizationId, category, isPublic = false } = data;
  
  try {
    let query = admin.firestore().collection('templates');
    
    if (isPublic) {
      query = query.where('isPublic', '==', true);
    } else {
      query = query.where('organizationId', '==', organizationId);
    }
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    query = query.orderBy('createdAt', 'desc').limit(50);
    
    const snapshot = await query.get();
    const templates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      templates
    };

  } catch (error) {
    console.error('Get Templates Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get templates');
  }
});

// Organization Management
export const createOrganization = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { name, industry, settings } = data;
  
  try {
    const orgRef = admin.firestore().collection('organizations').doc();
    
    await orgRef.set({
      name,
      industry,
      settings: {
        ...settings,
        branding: {
          logo: '',
          colors: INDUSTRY_CONFIGS[industry as keyof typeof INDUSTRY_CONFIGS]?.colors || ['#1a73e8'],
          fonts: ['Arial', 'Helvetica', 'sans-serif']
        },
        aiConfig: {
          prompts: INDUSTRY_CONFIGS[industry as keyof typeof INDUSTRY_CONFIGS]?.aiPrompts || '',
          placeholders: INDUSTRY_CONFIGS[industry as keyof typeof INDUSTRY_CONFIGS]?.placeholders || []
        },
        subscription: {
          plan: 'free',
          limits: {
            maxTemplates: 5,
            maxUsers: 1,
            aiCredits: 100
          }
        }
      },
      members: {
        [context.auth.uid]: 'admin'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user's organization
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      organizationId: orgRef.id,
      role: 'admin'
    });

    return {
      success: true,
      organizationId: orgRef.id
    };

  } catch (error) {
    console.error('Create Organization Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create organization');
  }
});




