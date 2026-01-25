# Voice-Controlled Email System for the Visually Impaired

A fully accessible email management system built with React, Vite, and JavaScript that uses voice commands and text-to-speech for users with visual impairments.

## Features

- 🎤 **Voice Recognition**: Use natural voice commands to navigate and control the email system
- 🔊 **Text-to-Speech**: All content is read aloud automatically for accessibility
- 📧 **Email Management**: Compose, read, send, and delete emails using voice commands
- ⌨️ **Keyboard Navigation**: Full keyboard support with proper focus management
- ♿ **Accessibility**: ARIA labels, semantic HTML, and screen reader support
- 🎨 **Modern UI**: Clean, accessible design with high contrast support

## Voice Commands

The system recognizes the following voice commands:

- **"Compose"** or **"New Email"** - Create a new email
- **"Inbox"** - View your inbox
- **"Read Email [number]"** - Read a specific email (e.g., "Read Email 1")
- **"Send"** - Send the current email
- **"Delete"** - Delete the current email
- **"Next"** - Go to next email
- **"Previous"** - Go to previous email
- **"Stop"** - Stop listening
- **"Help"** - Show available commands

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Start Voice Control**: Click the "Start Voice Control" button or use the voice command "Help"
2. **Navigate**: Use voice commands to navigate between inbox, compose, and read views
3. **Compose Email**: 
   - Say "Compose" to open the compose view
   - Use the voice input buttons next to each field to dictate content
   - Say "Send" to send the email
4. **Read Emails**: 
   - Emails are automatically read aloud when opened
   - Use "Read Aloud" button to re-read the email
5. **Keyboard Navigation**: 
   - Use Tab to navigate between elements
   - Use Enter or Space to activate buttons
   - Use Escape to cancel actions

## Browser Compatibility

The Web Speech API is supported in:
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Safari (with some limitations)
- ❌ Firefox (not yet supported)

## Project Structure

```
src/
├── components/
│   ├── VoiceControl.jsx    # Voice recognition UI and controls
│   ├── EmailInbox.jsx       # Email inbox list view
│   ├── EmailCompose.jsx     # Email composition interface
│   └── EmailRead.jsx        # Email reading view
├── services/
│   ├── voiceRecognition.js # Speech-to-text service
│   ├── textToSpeech.js      # Text-to-speech service
│   ├── emailService.js      # Email operations (mock)
│   └── voiceCommands.js    # Voice command processing
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
├── App.css                  # Application styles
└── index.css                # Global styles
```

## Email Service Integration

The current implementation uses a mock email service. To connect to a real email API:

1. Update `src/services/emailService.js`
2. Replace the mock methods with actual API calls
3. Add authentication as needed

Example API integration:
```javascript
async getEmails() {
  const response = await fetch('/api/emails', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

## Accessibility Features

- **ARIA Labels**: All interactive elements have descriptive ARIA labels
- **Semantic HTML**: Proper use of HTML5 semantic elements
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Compatible with screen readers like NVDA, JAWS, and VoiceOver
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Development

### Adding New Voice Commands

1. Add the command keywords to `src/services/voiceCommands.js`:
```javascript
'newaction': ['keyword1', 'keyword2', 'synonym']
```

2. Handle the command in `src/App.jsx`:
```javascript
case 'newaction':
  // Your action here
  break;
```

### Customizing Text-to-Speech

Modify the speech options in `src/services/textToSpeech.js`:
```javascript
utterance.rate = 1.0;  // Speech rate (0.1 to 10)
utterance.pitch = 1.0; // Voice pitch (0 to 2)
utterance.volume = 1.0; // Volume (0 to 1)
```

## License

This project is open source and available for educational and personal use.

## Contributing

Contributions are welcome! Please ensure that any changes maintain accessibility standards and include proper ARIA labels.

## Support

For issues or questions, please check:
- Browser console for errors
- Ensure microphone permissions are granted
- Verify Web Speech API support in your browser
