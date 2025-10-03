# Backend Setup Guide

This guide will help you set up the backend API with OpenAI integration for the Email Template Composer.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- OpenAI API key

## Quick Start

1. **Set up the backend**:
   ```bash
   cd backend
   ./setup.sh
   ```

2. **Configure your OpenAI API key**:
   - Edit `backend/.env` file
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - Get your API key from: https://platform.openai.com/api-keys

3. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Start the full stack application**:
   ```bash
   # From the root directory
   ./start-full-stack.sh
   ```

## API Endpoints

### AI Endpoints

#### POST `/api/ai/rewrite`
Rewrites email text using OpenAI.

**Request Body:**
```json
{
  "prompt": "Rewrite this email text...",
  "mode": "friendly|expand|shorten",
  "tenantId": "tenant-123",
  "clientId": "client-456"
}
```

**Response:**
```json
{
  "success": true,
  "text": "Rewritten email text...",
  "mode": "friendly",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

#### POST `/api/ai/design`
Generates complete email templates using OpenAI.

**Request Body:**
```json
{
  "subject": "Welcome Email",
  "brief": "Create a professional welcome email",
  "brandColor": "#1a73e8",
  "logoUrl": "https://example.com/logo.png",
  "preferredWidth": 600,
  "keepPlaceholders": true,
  "tenantId": "tenant-123",
  "clientId": "client-456"
}
```

**Response:**
```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "subject": "Welcome Email",
  "usage": {
    "prompt_tokens": 200,
    "completion_tokens": 800,
    "total_tokens": 1000
  }
}
```

#### POST `/api/ai/analyze`
Analyzes email content and provides suggestions.

**Request Body:**
```json
{
  "content": "Email content to analyze...",
  "type": "email"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "Analysis and suggestions...",
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
```

### Upload Endpoints

#### POST `/api/upload/image`
Uploads an image file.

**Request:** Multipart form data
- `image`: Image file
- `clientId`: Client ID
- `tenantId`: Tenant ID

**Response:**
```json
{
  "success": true,
  "link": "http://localhost:3001/uploads/image-123456789.jpg",
  "url": "http://localhost:3001/uploads/image-123456789.jpg",
  "path": "/uploads/image-123456789.jpg",
  "filename": "image-123456789.jpg",
  "originalName": "logo.jpg",
  "size": 12345,
  "mimetype": "image/jpeg"
}
```

#### GET `/api/upload/images`
Lists uploaded images for a client/tenant.

**Query Parameters:**
- `clientId`: Client ID
- `tenantId`: Tenant ID

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "1",
      "url": "http://localhost:3001/uploads/image1.jpg",
      "name": "Image 1",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### DELETE `/api/upload/image/:filename`
Deletes an uploaded image.

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
BASE_URL=http://localhost:3001
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse
- **File Validation**: Only image files allowed
- **Error Handling**: Comprehensive error responses

## Development

### Running in Development Mode

```bash
cd backend
npm run dev
```

This uses `nodemon` for automatic restarts on file changes.

### Testing the API

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Test AI rewrite
curl -X POST http://localhost:3001/api/ai/rewrite \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a friendly welcome message",
    "mode": "friendly",
    "tenantId": "test",
    "clientId": "test"
  }'
```

## Troubleshooting

### Common Issues

1. **OpenAI API Key Not Set**
   - Error: "OpenAI API key not configured"
   - Solution: Set `OPENAI_API_KEY` in `.env` file

2. **CORS Errors**
   - Error: "Access to fetch at 'http://localhost:3001' from origin 'http://localhost:4200' has been blocked by CORS policy"
   - Solution: Check `CORS_ORIGIN` in `.env` file

3. **Rate Limit Exceeded**
   - Error: "Too many requests from this IP"
   - Solution: Wait or increase rate limit in `.env` file

4. **File Upload Errors**
   - Error: "Only image files are allowed"
   - Solution: Ensure you're uploading image files only

### Logs

Check the console output for detailed error messages. In development mode, full error details are shown.

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Set up proper logging
4. Configure a reverse proxy (nginx)
5. Use environment-specific configuration
6. Set up monitoring and alerting

## Support

If you encounter issues:

1. Check the console logs
2. Verify your OpenAI API key
3. Ensure all dependencies are installed
4. Check the health endpoint: `http://localhost:3001/health`




