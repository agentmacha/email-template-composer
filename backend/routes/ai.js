const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set in environment variables');
  console.error('Please set your OpenAI API key in the .env file');
}

/**
 * POST /api/ai/rewrite
 * Rewrite email text using OpenAI
 */
router.post('/rewrite', async (req, res) => {
  try {
    const { prompt, mode, tenantId, clientId } = req.body;

    // Validate required fields
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }

    // Create system prompt based on mode
    const systemPrompts = {
      friendly: 'You are a helpful assistant that rewrites email text to be more friendly, warm, and approachable while maintaining professionalism. This is for a SALON BUSINESS, so use salon terminology (clients, salon, stylists, services, appointments, etc.). Keep all placeholders like {salon_name}, {client_name}, {stylist_name} unchanged.',
      expand: 'You are a helpful assistant that expands and elaborates on email text to provide more detail and context while maintaining the original message. This is for a SALON BUSINESS, so use salon terminology (clients, salon, stylists, services, appointments, etc.). Keep all placeholders like {salon_name}, {client_name}, {stylist_name} unchanged.',
      shorten: 'You are a helpful assistant that shortens and condenses email text to be more concise while keeping the essential information. This is for a SALON BUSINESS, so use salon terminology (clients, salon, stylists, services, appointments, etc.). Keep all placeholders like {salon_name}, {client_name}, {stylist_name} unchanged.'
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts.friendly;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      text: generatedText,
      mode: mode,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        message: 'OpenAI API quota exceeded. Please check your billing.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate text',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/ai/design
 * Generate complete email template using OpenAI
 */
router.post('/design', async (req, res) => {
  try {
    const { subject, brief, brandColor, logoUrl, preferredWidth, keepPlaceholders, tenantId, clientId } = req.body;

    // Validate required fields
    if (!brief) {
      return res.status(400).json({
        success: false,
        message: 'Brief is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }

    // Create system prompt for email design
    const systemPrompt = `You are an expert email template designer. Create a professional, mobile-responsive HTML email template based on the user's requirements.

Requirements:
- Use inline CSS for email client compatibility
- Make it mobile-responsive with max-width: 600px
- Use professional SALON/HAIR styling with modern, elegant design
- Include proper email HTML structure with DOCTYPE, head, and body
- Use the brand color: ${brandColor || '#1a73e8'}
- Logo URL: ${logoUrl || 'placeholder'}
- Preferred width: ${preferredWidth || 600}px
- Keep placeholders like {salon_name}, {client_name}, {stylist_name} if requested: ${keepPlaceholders}
- Use clean, modern design principles suitable for salon business
- Include proper spacing and typography
- Make it accessible and professional
- Use salon-appropriate colors and styling (elegant, beauty-focused)

Return only the HTML code, no explanations.`;

    const userPrompt = `Create an email template for: ${subject || 'Email'}

Brief: ${brief}

Make it professional and suitable for SALON/HAIR business use. Use salon terminology (clients, salon, stylists, services, appointments, etc.).`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const generatedHtml = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      html: generatedHtml,
      subject: subject,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI Design API Error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        message: 'OpenAI API quota exceeded. Please check your billing.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate email design',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/ai/analyze
 * Analyze email content and provide suggestions
 */
router.post('/analyze', async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured'
      });
    }

    const systemPrompt = `You are an email marketing expert. Analyze the provided email content and provide suggestions for improvement.

Focus on:
- Clarity and readability
- Call-to-action effectiveness
- Professional tone
- Mobile responsiveness
- Accessibility
- Healthcare/clinic appropriateness

Provide specific, actionable suggestions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analyze this email content:\n\n${content}`
        }
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    const analysis = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      analysis: analysis,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI Analysis API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
