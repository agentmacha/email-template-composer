# 🚀 GCP Multi-Tenant SaaS Setup Guide

This guide will help you transform your email template composer into a production-ready, multi-tenant SaaS application using Google Cloud Platform.

## 📋 Prerequisites

- ✅ GCP Project: `salon-database-464315`
- ✅ Service Account Key: `serviceaccountkey.json`
- ✅ OpenAI API Key (already configured)

## 🔧 Step 1: Enable Required APIs

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/library?project=salon-database-464315

### 1.2 Enable These APIs
- ✅ **Cloud Resource Manager API**
- ✅ **Firebase Authentication API**
- ✅ **Cloud Firestore API**
- ✅ **Cloud Storage API**
- ✅ **Cloud Functions API**
- ✅ **Firebase Hosting API**
- ✅ **Cloud Run API**

## 🔐 Step 2: Set Up Firebase Project

### 2.1 Initialize Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

### 2.2 Select Services
When prompted, select:
- ✅ **Firestore** (database)
- ✅ **Functions** (backend)
- ✅ **Hosting** (frontend)
- ✅ **Storage** (file uploads)

### 2.3 Configure Project
- Project ID: `salon-database-464315`
- Use existing project: Yes

## 🗄️ Step 3: Set Up Firestore Database

### 3.1 Create Collections
The following collections will be created automatically:

```typescript
// Organizations
organizations: {
  [orgId]: {
    name: string,
    industry: 'salon' | 'healthcare' | 'restaurant' | 'retail',
    settings: {
      branding: { logo, colors, fonts },
      aiConfig: { prompts, placeholders },
      subscription: { plan, limits }
    },
    members: { [userId]: 'admin' | 'editor' | 'viewer' },
    createdAt: timestamp
  }
}

// Users
users: {
  [userId]: {
    email: string,
    name: string,
    organizationId: string,
    role: 'admin' | 'editor' | 'viewer',
    createdAt: timestamp
  }
}

// Templates
templates: {
  [templateId]: {
    organizationId: string,
    userId: string,
    name: string,
    subject: string,
    contentHtml: string,
    contentText: string,
    placeholders: string[],
    category: string,
    isPublic: boolean,
    createdAt: timestamp
  }
}
```

### 3.2 Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## 🔧 Step 4: Deploy Cloud Functions

### 4.1 Install Dependencies
```bash
cd functions
npm install
```

### 4.2 Set Environment Variables
```bash
# Set OpenAI API key
firebase functions:config:set openai.key="your-openai-api-key-here"
```

### 4.3 Deploy Functions
```bash
firebase deploy --only functions
```

## 🎨 Step 5: Update Frontend for Multi-Tenancy

### 5.1 Install Angular Fire
```bash
npm install firebase @angular/fire@^17.0.0 --legacy-peer-deps
```

### 5.2 Update Angular Configuration
Add to `angular.json`:
```json
{
  "projects": {
    "email-template-composer": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/email-template-composer"
          }
        }
      }
    }
  }
}
```

### 5.3 Update main.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions())
  ]
});
```

## 🚀 Step 6: Deploy to Production

### 6.1 Build Frontend
```bash
ng build --prod
```

### 6.2 Deploy Everything
```bash
firebase deploy
```

## 💰 Step 7: Set Up Billing & Monitoring

### 7.1 Enable Billing
- Go to: https://console.cloud.google.com/billing?project=salon-database-464315
- Link a billing account

### 7.2 Set Up Monitoring
- Enable Cloud Monitoring
- Set up alerts for usage limits
- Monitor AI API costs

## 🎯 Step 8: Multi-Tenant Features

### 8.1 Industry Configuration
The system supports multiple industries:
- **Salon** - Hair, beauty, wellness
- **Healthcare** - Medical, dental, clinics
- **Restaurant** - Food service, catering
- **Retail** - E-commerce, stores

### 8.2 Subscription Plans
- **Free**: 5 templates, 1 user, 100 AI credits
- **Pro**: 50 templates, 5 users, 1000 AI credits ($29/month)
- **Enterprise**: Unlimited, custom features ($99/month)

### 8.3 Organization Management
- User invitation system
- Role-based access control
- Custom branding per organization
- Industry-specific AI prompts

## 🔒 Security Features

### 8.1 Authentication
- Firebase Authentication
- Google OAuth integration
- Role-based access control
- Organization-based isolation

### 8.2 Data Security
- Firestore security rules
- Cloud Storage access controls
- API rate limiting
- Data encryption at rest

## 📊 Monitoring & Analytics

### 8.1 Usage Tracking
- AI usage per organization
- Template creation limits
- Storage usage monitoring
- User activity analytics

### 8.2 Performance Monitoring
- Cloud Functions performance
- Firestore query optimization
- CDN performance
- Error tracking

## 🚀 Next Steps

1. **Enable APIs** in GCP Console
2. **Initialize Firebase** project
3. **Deploy Cloud Functions**
4. **Update frontend** for multi-tenancy
5. **Deploy to production**
6. **Set up monitoring**

## 📞 Support

If you encounter any issues:
1. Check the Firebase Console logs
2. Verify API permissions
3. Check Cloud Functions logs
4. Review Firestore security rules

## 🎉 Expected Results

After completing this setup, you'll have:
- ✅ **Multi-tenant SaaS** application
- ✅ **Industry-specific** AI prompts
- ✅ **User authentication** and management
- ✅ **Template persistence** and sharing
- ✅ **Scalable cloud infrastructure**
- ✅ **Production-ready** deployment

Your email template composer will be ready to serve multiple clients across different industries! 🚀




