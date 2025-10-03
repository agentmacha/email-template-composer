Y# Email Template Composer

A sophisticated Angular email template composer with AI integration, designed specifically for healthcare applications.

## Features

### 🎨 Visual Email Editor
- **WYSIWYG editing** with contenteditable canvas
- **Drag-and-drop** functionality for components
- **Real-time HTML generation** with text/HTML sync
- **Mobile-responsive** design with proper email HTML structure

### 🤖 AI Integration
- **AI Writing Assistant**: Rewrite content (friendly, expand, shorten modes)
- **AI Design Generator**: Create complete email templates from descriptions
- **Smart content generation** with placeholder preservation
- **Real-time AI preview** with refinement options

### 🧩 Component Library
- **Text formatting**: Bold, italic, underline, lists, links
- **Pre-built components**:
  - Buttons (with presets: Call Us, Schedule Online, Get Directions, Leave Review)
  - Images (with upload capability)
  - Headers and spacers
  - Two-column layouts
  - Image + Text combinations
  - Header blocks (clinic branding)
  - Footer blocks

### 🎯 Dynamic Properties Panel
- **Context-sensitive editing** based on selected element type
- **Live property updates** with immediate visual feedback
- **Form validation** and preset configurations
- **Color pickers** and styling controls

### 📝 Placeholder System
- **Dynamic placeholder insertion** with search/filter
- **Healthcare-specific placeholders**: `{clinic_name}`, `{patient_name}`, `{schedule_url}`, etc.
- **Template variable support** for personalization

### 🖼️ Image Management
- **Cloud upload integration** via `TextNotifyService`
- **Image URL normalization** and validation
- **Drag-and-drop image insertion**
- **Alt text and sizing controls**

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI (v17 or higher)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   ├── text-notify.service.ts      # AI operations and image uploads
│   │   └── app-state.service.ts        # Application state management
│   ├── email-composer/
│   │   ├── email-composer.component.ts # Main composer component
│   │   ├── email-composer.component.html
│   │   └── email-composer.component.scss
│   └── app.component.ts                # Main app component
├── styles.scss                         # Global styles
└── main.ts                            # Application bootstrap
```

## Usage

### Creating a New Template

1. Click "Create New Template" on the main page
2. Fill in the template name and subject
3. Use the component library to add elements
4. Customize properties in the right panel
5. Use AI features for content generation
6. Save your template

### AI Features

#### Writing Assistant
- Click "Help me write" to open the writing assistant
- Enter your text or select existing content
- Choose from: Make friendly, Elaborate, or Shorten
- Review and insert the AI-generated content

#### Design Generator
- Click "Design with AI" to open the design assistant
- Describe the email you want to create
- AI will generate a complete email template
- Customize the generated design as needed

### Component Types

#### Buttons
- **Custom buttons** with full styling control
- **Preset buttons** for common actions (Call, Schedule, Directions, Review)
- **Button rows** for multiple action buttons

#### Images
- **Image placeholders** with upload capability
- **Responsive sizing** and alignment options
- **Alt text** support for accessibility

#### Layout Components
- **Headers** with clinic branding
- **Spacers** for vertical spacing
- **Two-column layouts** for side-by-side content
- **Image + Text** combinations

## Configuration

### Services Configuration

The application uses two main services that can be configured:

#### TextNotifyService
- Configure API endpoints for AI operations
- Set up image upload endpoints
- Customize AI prompts and responses

#### AppStateService
- Set default client and tenant IDs
- Configure application state management

### Styling Customization

The component uses SCSS for styling and can be customized by modifying:
- `src/app/email-composer/email-composer.component.scss`
- `src/styles.scss` for global styles

## API Integration

### AI Services
The component integrates with AI services for:
- Content rewriting and generation
- Email template design
- Subject line extraction

### Image Upload
- Cloud storage integration
- Image URL normalization
- Upload progress tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

