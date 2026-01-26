# Voice-Controlled Email System for the Visually Impaired

A fully accessible email management system built with React, Vite, and JavaScript that uses voice commands and text-to-speech for users with visual impairments.

## Features

### Core Features (Required)

- 🎤 **Voice Input (Speech-to-Text)**: Enhanced error handling for no voice/unclear speech
- 🔊 **Voice Output (Text-to-Speech)**: Converts system messages and emails to speech
- 📧 **Email Composition**: Voice input for recipient, subject, and body with voice confirmation
- 📨 **Email Sending**: SMTP integration ready (configure via environment variables)
- 📬 **Inbox Reading**: Retrieve and read emails aloud with navigation
- 🔄 **Reply Functionality**: Reply to emails via voice commands
- 🗑️ **Email Actions**: Delete emails with voice confirmation
- ⌨️ **Keyboard Navigation**: Full keyboard support with proper focus management
- ♿ **Accessibility**: ARIA labels, semantic HTML, and screen reader support
- 🎨 **Modern UI**: Clean, accessible design with high contrast support

### Optional Features (Implemented)

- 🔐 **User Authentication**: Voice-guided login system
- 🔍 **Inbox Management**: Search, filter (all/unread/read/today/this-week), mark read/unread
- 🌍 **Language Support**: Multiple languages (EN-US, EN-GB, ES, FR, DE) with adjustable speech speed
- 🔒 **Security Enhancements**: Voice confirmation for sensitive actions
- 📱 **Mobile Optimization**: Fully responsive design with touch-friendly buttons

## Voice Commands

The system recognizes the following voice commands:

### Navigation Commands

- **"Compose"** or **"New Email"** or **"Compose Email"** - Create a new email
- **"Inbox"** or **"Read Inbox"** - View your inbox
- **"Read Email [number]"** - Read a specific email (e.g., "Read Email 1")
- **"Next"** or **"Next Email"** - Go to next email in inbox
- **"Previous"** or **"Previous Email"** - Go to previous email in inbox
- **"Exit"** or **"Quit"** - Logout from the system

### Email Actions

- **"Send"** or **"Send Email"** - Send the current email (with voice confirmation)
- **"Reply"** or **"Reply to Email"** - Reply to the current email
- **"Delete"** or **"Delete Email"** - Delete the current email
- **"Mark Read"** or **"Mark as Read"** - Mark email as read
- **"Mark Unread"** or **"Mark as Unread"** - Mark email as unread

### Search & Filter

- **"Search"** or **"Find Email"** - Search emails by voice
- Filter buttons available: All, Unread, Read, Today, This Week

### System Commands

- **"Stop"** or **"Stop Listening"** - Stop voice recognition
- **"Help"** or **"What Can I Say"** - Show available commands

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

### Initial Setup

1. **Login**:

   - Enter email and password manually or use voice input
   - Say "Email" to enter email via voice
   - Say "Password" to enter password via voice

2. **Start Voice Control**: Click the "Start Voice Control" button or use the voice command "Help"

### Using Voice Commands

1. **Navigate**: Use voice commands to navigate between inbox, compose, read, and reply views
2. **Compose Email**:
   - Say "Compose" to open the compose view
   - Use the voice input buttons (🎤) next to each field to dictate content
   - Say "Send" to send the email (voice confirmation required)
3. **Read Emails**:
   - Emails are automatically read aloud when opened
   - Use "Read Aloud" button to re-read the email
   - Use "Next" and "Previous" commands to navigate between emails
4. **Reply to Emails**:
   - Open an email and say "Reply"
   - Use voice input to compose your reply
   - Confirm sending with voice
5. **Search & Filter**:
   - Use the search box or say "Search" followed by your query
   - Use filter buttons: All, Unread, Read, Today, This Week
6. **Settings**:
   - Click Settings (⚙️) to adjust speech rate and language
   - Adjust speech rate slider (0.5x to 2.0x)
   - Select language from dropdown

### Keyboard Navigation

- Use Tab to navigate between elements
- Use Enter or Space to activate buttons
- Use Escape to cancel actions
- All buttons are keyboard accessible

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
│   ├── Login.jsx            # User authentication with voice-guided login
│   ├── EmailInbox.jsx       # Email inbox with search, filter, navigation
│   ├── EmailCompose.jsx     # Email composition with voice input & confirmation
│   ├── EmailRead.jsx        # Email reading view with read-aloud
│   └── EmailReply.jsx       # Reply to email interface
├── services/
│   ├── voiceRecognition.js  # Speech-to-text with enhanced error handling
│   ├── textToSpeech.js      # Text-to-speech with rate/language settings
│   ├── emailService.js      # Email operations with SMTP support
│   ├── voiceCommands.js     # Voice command processing
│   └── authService.js      # User authentication service
├── App.jsx                  # Main application with routing & settings
├── main.jsx                 # Application entry point
├── App.css                  # Application styles with mobile optimization
└── index.css                # Global styles with accessibility features
```

## Email Service Integration

### SMTP Configuration

The system supports SMTP email sending. To configure:

1. Copy `.env.example` to `.env`
2. Fill in your SMTP credentials:

```env
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASS=your-app-password
```

**Note**: For Gmail, you need to use an App Password, not your regular password. Generate one at: https://myaccount.google.com/apppasswords

### Backend API Integration

For production use, you'll need a backend API. The frontend is ready to connect:

1. Create a backend endpoint at `/api/send-email`
2. Update `src/services/emailService.js` to point to your API
3. The service already includes the structure for API calls

Example backend integration:

```javascript
async sendViaSMTP(emailData) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      replyTo: emailData.replyTo
    })
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
utterance.rate = 1.0; // Speech rate (0.1 to 10)
utterance.pitch = 1.0; // Voice pitch (0 to 2)
utterance.volume = 1.0; // Volume (0 to 1)
```

## License

This project is open source and available for educational and personal use.

## Contributing

Contributions are welcome! Please ensure that any changes maintain accessibility standards and include proper ARIA labels.

## Error Handling

The system includes comprehensive error handling:

- **No Speech Detected**: Clear voice feedback when no speech is detected
- **Unclear Speech**: Prompts user to speak more clearly
- **Microphone Access**: Guides user to grant microphone permissions
- **Network Errors**: Handles poor internet connection gracefully
- **Speech Recognition Errors**: Provides clear feedback for all error types
- **Email Validation**: Validates email addresses before sending
- **Voice Confirmation**: Confirms sensitive actions (send, delete) via voice

## Testing & Evaluation

### Test Scenarios

1. **Voice Recognition Accuracy**: Test with different accents and speech clarity
2. **Text-to-Speech Quality**: Verify all messages are read clearly
3. **Navigation**: Test all voice commands work correctly
4. **Error Handling**: Test with no microphone, poor connection, unclear speech
5. **Accessibility**: Test with screen readers (NVDA, JAWS, VoiceOver)
6. **Mobile Devices**: Test on various mobile browsers

### Sample Test Cases

- ✅ Compose email using voice input
- ✅ Send email with voice confirmation
- ✅ Read inbox and navigate emails
- ✅ Reply to email via voice
- ✅ Search and filter emails
- ✅ Mark emails as read/unread
- ✅ Delete email with confirmation
- ✅ Adjust speech rate and language
- ✅ Login with voice-guided input
- ✅ Handle errors gracefully

## Support

For issues or questions, please check:

- Browser console for errors
- Ensure microphone permissions are granted
- Verify Web Speech API support in your browser
- Check network connection for email operations
- Review `.env` file for SMTP configuration

## Features Checklist

### ✅ Required Features (All Implemented)

- [x] Voice Input (Speech-to-Text) with error handling
- [x] Voice Output (Text-to-Speech)
- [x] Email Composition with voice input
- [x] Email Sending with SMTP support
- [x] Inbox Reading with navigation
- [x] Basic Email Actions (Reply, Delete)
- [x] Simple User Interface
- [x] Error Handling
- [x] Testing & Evaluation ready

### ✅ Optional Features (All Implemented)

- [x] User Authentication with voice-guided login
- [x] Inbox Management (search, filter, mark read/unread)
- [x] Language Support (multiple languages)
- [x] Security Enhancements (voice confirmation)
- [x] Mobile Optimization (responsive design)
