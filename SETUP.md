# Voice-Controlled Email System - Setup & Running Guide

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- A modern web browser with Web Speech API support:
  - Chrome/Chromium (best support)
  - Edge (good support)
  - Safari (supported)
  - Firefox (limited support)
- Microphone and speakers/headphones

## Installation

1. Navigate to the project directory:

```bash
cd voice
```

2. Install dependencies:

```bash
npm install
```

## Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Demo Credentials

Use these credentials to test the application:

**Demo Account 1:**

- Email: `demo@example.com`
- Password: `demo123`

**Demo Account 2:**

- Email: `test@example.com`
- Password: `test123`

## Features

### Voice Commands

The system recognizes the following voice commands:

**Navigation:**

- "Inbox" - Go to inbox
- "Compose" or "New Email" - Create new email
- "Read Email [number]" - Open specific email
- "Next" - Go to next email
- "Previous" - Go to previous email

**Email Actions:**

- "Send" - Send current email
- "Reply" - Reply to current email
- "Delete" - Delete current email
- "Mark Read" - Mark email as read
- "Mark Unread" - Mark email as unread

**System:**

- "Help" - Show available commands
- "Stop" - Stop listening
- "Exit" - Logout

### Features

- ✅ Voice input (speech-to-text) for commands and email composition
- ✅ Voice output (text-to-speech) for reading emails and system messages
- ✅ Email inbox with filtering and search
- ✅ Email composition with voice input
- ✅ Email reading with read-aloud functionality
- ✅ Email reply with voice confirmation
- ✅ Email deletion with confirmation
- ✅ Settings for speech rate and language
- ✅ Full keyboard navigation
- ✅ Accessibility features (ARIA labels, semantic HTML, high contrast)
- ✅ Responsive design for all devices

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` to configure SMTP settings:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your email service credentials:

```
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your-email@gmail.com
VITE_SMTP_PASS=your-app-password
```

**Note:** SMTP configuration is optional. The demo uses mock email storage.

## Troubleshooting

### Microphone Not Working

1. Check browser permissions - allow microphone access when prompted
2. Ensure your microphone is connected and functional
3. Test microphone in system settings
4. Try a different browser (Chrome has best support)

### Voice Recognition Not Starting

- Make sure you're using a compatible browser
- Check that microphone permission is granted
- Try refreshing the page
- Check browser console for errors (F12 → Console tab)

### No Sound Output

- Ensure speakers/headphones are connected
- Check system volume is not muted
- Verify browser volume is not muted
- Try adjusting speech rate in settings (may be too fast/slow)

### Speech Recognition Errors

- Speak clearly and slowly
- Reduce background noise
- Check internet connection (needed for speech recognition)
- Try different language in settings
- If error persists, refresh and try again

## Development Notes

### Project Structure

```
src/
├── App.jsx                 # Main application component
├── App.css                 # Main styling
├── components/
│   ├── Login.jsx          # Login component
│   ├── EmailInbox.jsx     # Inbox listing
│   ├── EmailRead.jsx      # Email viewer
│   ├── EmailCompose.jsx   # Email composition
│   ├── EmailReply.jsx     # Email reply
│   └── VoiceControl.jsx   # Voice control interface
├── services/
│   ├── authService.js     # Authentication
│   ├── emailService.js    # Email operations
│   ├── voiceRecognition.js # Speech-to-text
│   ├── textToSpeech.js    # Text-to-speech
│   ├── voiceCommands.js   # Command processing
│   └── index.css          # Global styles
└── main.jsx               # Entry point
```

### Adding Mock Emails

Edit `src/services/emailService.js` to add more demo emails:

```javascript
this.emails = [
  {
    id: 7,
    from: "sender@example.com",
    to: "user@example.com",
    subject: "Your Subject",
    body: "Your message here",
    date: new Date("2024-01-10T10:00:00"),
    read: false,
  },
  // ... more emails
];
```

### Backend Integration

To integrate with a real email backend:

1. Update `src/services/emailService.js` - replace mock API calls with real endpoints
2. Update `src/services/authService.js` - connect to your auth API
3. Create backend API endpoints for:
   - User authentication
   - Fetching emails
   - Sending emails
   - Email operations (mark read, delete, etc.)

## Performance Optimization

### Build Size

- Current: ~70KB (gzipped)
- Main dependencies: React (19.2.3), Vite (7.2.4)

### Accessibility Features

- ARIA labels on all interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Focus management
- High contrast mode support
- Screen reader friendly

## Security Notes

⚠️ **Important:** This is a demo application with mock data. For production:

1. Never store passwords in plain text
2. Use secure authentication (OAuth, JWT, etc.)
3. Never expose SMTP credentials in frontend code
4. Implement backend API for email operations
5. Add CORS protection
6. Use HTTPS in production
7. Validate all user inputs server-side
8. Implement rate limiting
9. Add logging and monitoring

## Support & Issues

For issues or questions:

1. Check the browser console (F12) for error messages
2. Review the troubleshooting section above
3. Test with demo accounts first
4. Verify browser compatibility
5. Check internet connection

## License

This project is provided as-is for educational purposes.
