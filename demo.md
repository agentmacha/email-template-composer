# Email Template Composer - Demo Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   ./setup.sh
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and go to `http://localhost:4200`

## Demo Features

### 1. Creating a New Template
- Click "Create New Template" on the main page
- Fill in template name: "Welcome Email"
- Fill in subject: "Welcome to Our Clinic"

### 2. Adding Components
- Click "Components" menu
- Try adding:
  - **Header**: Clinic branding with logo
  - **Button**: Call-to-action buttons
  - **Image**: Upload or use placeholder images
  - **Spacer**: Add vertical spacing
  - **Image + Text**: Side-by-side content

### 3. Using AI Features

#### AI Writing Assistant
- Click "Help me write"
- Type: "Write a friendly welcome message for new patients"
- Choose "Make friendly" to generate content
- Review and insert the AI-generated text

#### AI Design Generator
- Click "Design with AI"
- Type: "Create a professional appointment reminder email"
- Watch AI generate a complete email template
- Customize the generated design

### 4. Working with Placeholders
- Click "Placeholders" menu
- Search for specific placeholders like "clinic_name"
- Click to insert placeholders into your content
- These will be replaced with actual data when sent

### 5. Customizing Components
- Click on any component in the canvas
- Use the Properties panel on the right to:
  - Change colors and styling
  - Adjust sizes and alignment
  - Modify text content
  - Set URLs and links

### 6. Saving Your Template
- Click "Save" when you're done
- The template will be exported as HTML
- You can use this HTML in your email campaigns

## Sample Templates to Try

### Appointment Reminder
1. Add a header with clinic branding
2. Add text: "Dear {patient_name}, this is a reminder about your appointment on {appointment_date} at {appointment_time}."
3. Add a "Schedule Online" button
4. Use AI to make the text more friendly

### Newsletter
1. Add a header
2. Add an image + text block
3. Add multiple buttons for different actions
4. Add a footer with unsubscribe link

### Welcome Email
1. Add a header
2. Add welcoming text
3. Add buttons for "Schedule Appointment" and "Call Us"
4. Use AI to generate the welcome message

## Tips

- **Use AI frequently**: The AI features can save you time and improve your content
- **Test responsiveness**: The templates are mobile-friendly by default
- **Use placeholders**: They make your templates dynamic and personalized
- **Preview often**: Check how your email looks as you build it
- **Save regularly**: Don't lose your work!

## Troubleshooting

- If the app doesn't start, make sure all dependencies are installed
- If AI features don't work, check the browser console for errors
- If images don't upload, check your internet connection
- If styling looks off, try refreshing the page

## Next Steps

- Integrate with your email service provider
- Set up real AI API endpoints
- Customize the styling to match your brand
- Add more placeholder variables as needed




