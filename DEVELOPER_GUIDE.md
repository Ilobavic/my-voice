# Voice Email System - Quick Reference Guide

## 🚀 Quick Start

```bash
# Install & Run
cd voice
npm install
npm run dev
# Open http://localhost:5173
```

**Demo Login:** `demo@example.com` / `demo123`

## 🎤 Voice Commands Cheat Sheet

| Command             | Purpose          | Response                   |
| ------------------- | ---------------- | -------------------------- |
| Inbox               | Go to email list | "Opening inbox"            |
| Compose / New Email | Create email     | "Opening compose email"    |
| Read Email [N]      | Open email #N    | "Opening email [N]"        |
| Send                | Send email       | "Please confirm..."        |
| Reply               | Reply to email   | "Opening reply"            |
| Delete              | Delete email     | Voice confirmation         |
| Next                | Next email       | "Moving to next email"     |
| Previous            | Last email       | "Moving to previous email" |
| Mark Read           | Mark as read     | "Email marked as read"     |
| Mark Unread         | Mark as unread   | "Email marked as unread"   |
| Help                | Show commands    | Lists all commands         |
| Stop                | Stop listening   | "Stopped"                  |
| Exit                | Logout           | "Logged out successfully"  |

## 📁 Project Structure

```
voice/
├── src/
│   ├── App.jsx              # Main app
│   ├── App.css              # Styles
│   ├── index.css            # Global styles
│   ├── main.jsx             # Entry point
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── VoiceControl.jsx
│   │   ├── EmailInbox.jsx
│   │   ├── EmailRead.jsx
│   │   ├── EmailCompose.jsx
│   │   └── EmailReply.jsx
│   └── services/
│       ├── authService.js
│       ├── emailService.js
│       ├── voiceRecognition.js
│       ├── textToSpeech.js
│       └── voiceCommands.js
├── SETUP.md                 # Setup guide
├── TESTING_GUIDE.md         # Test checklist
├── ENHANCEMENT_SUMMARY.md   # Improvements
├── .env.local              # Config (create from .env.example)
├── package.json
├── vite.config.js
└── index.html
```

## 🔧 Development Tasks

### Add a New Voice Command

1. Edit `src/services/voiceCommands.js`
2. Add keyword to `this.commands` object
3. Handle action in `src/App.jsx` `handleCommand()` function
4. Add response text

Example:

```javascript
// In voiceCommands.js
this.commands = {
  // ... existing
  settings: ["settings", "preferences", "options"],
};

// In App.jsx
case "settings":
  setView("settings");
  textToSpeech.speak("Opening settings");
  break;
```

### Fix Voice Recognition Issues

1. Check `src/services/voiceRecognition.js`
2. Review browser console (F12)
3. Check microphone permissions
4. Test with Chrome/Edge first

### Improve Command Matching

Edit `src/services/voiceCommands.js`:

- Adjust `calculateConfidence()` threshold
- Add more keywords to `this.commands`
- Tweak Levenshtein distance in `stringSimilarity()`

### Add Text-to-Speech

```javascript
import textToSpeech from "../services/textToSpeech";

// Speak text
textToSpeech.speak("Your message here");

// With options
textToSpeech.speak("Hello", {
  rate: 1.0, // 0.5 to 2.0
  pitch: 1.0, // 0.1 to 2.0
  volume: 1.0, // 0 to 1.0
  onEnd: () => console.log("Done"),
});
```

### Listen to Voice Input

```javascript
import voiceRecognition from "../services/voiceRecognition";

// Start listening
voiceRecognition.start();

// Handle results
voiceRecognition.onResult((result) => {
  console.log("Interim:", result.interim);
  console.log("Final:", result.final);
});

// Handle errors
voiceRecognition.onError((err) => {
  console.error("Error:", err.code, err.message);
});

// Stop listening
voiceRecognition.stop();
```

## 📊 State Management Pattern

```javascript
// Access state
const [emails, setEmails] = useState([]);
const [selectedEmail, setSelectedEmail] = useState(null);

// Update state
setEmails(newEmailList);
setSelectedEmail(email);

// Use refs for component methods
const inboxRef = useRef(null);
inboxRef.current?.nextEmail();
```

## 🎨 Styling Variables

```css
--primary-color: #2563eb; /* Blue buttons */
--success-color: #10b981; /* Green success */
--danger-color: #ef4444; /* Red danger */
--text-primary: #1e293b; /* Dark text */
--text-secondary: #64748b; /* Gray text */
--background: #f8fafc; /* Light background */
--surface: #ffffff; /* White cards */
```

## 🧪 Testing Quick Checks

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
# Open browser DevTools: F12 → Console
```

## 🐛 Debug Mode

Add logging to services:

```javascript
// In voiceRecognition.js onstart
console.log("🎤 Voice recognition started");

// In textToSpeech.js speak
console.log("🔊 Speaking:", text);

// In voiceCommands.js processCommand
console.log("📝 Processing:", text);
console.log("✅ Matched:", command.action, confidence);
```

## 📱 Mobile Testing

```bash
# Get your IP
ipconfig getifaddr en0  # Mac
ipconfig              # Windows

# Run with host option
npm run dev -- --host

# Open from mobile: http://YOUR_IP:5173
```

## 🔑 Demo Accounts

```
Email: demo@example.com
Password: demo123

Email: test@example.com
Password: test123
```

## ⚡ Performance Tips

1. **Reduce TTS calls**: Batch announcements
2. **Optimize commands**: Use fewer keywords per action
3. **Cache voice settings**: Store in localStorage
4. **Lazy load emails**: Pagination instead of all at once
5. **Debounce search**: Delay search execution

## 🚨 Common Fixes

| Problem                | Solution                                  |
| ---------------------- | ----------------------------------------- |
| No microphone sound    | Check system volume + browser permissions |
| Commands not executing | Check console, verify confidence >50%     |
| TTS not working        | Try different browser, check speakers     |
| Component not updating | Check useState and useEffect dependencies |
| Voice not starting     | Refresh page, check permissions           |
| Emails not loading     | Check network tab (F12), API calls        |

## 📚 Key Files to Edit

- **Add Features**: `src/App.jsx`
- **Voice Commands**: `src/services/voiceCommands.js`
- **Component UI**: `src/components/*.jsx`
- **Styling**: `src/App.css`, `src/index.css`
- **Email Logic**: `src/services/emailService.js`
- **Auth Logic**: `src/services/authService.js`

## 🔗 Useful Links

- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Browser Support: https://caniuse.com/speech-recognition

## 📞 Need Help?

1. Check **TESTING_GUIDE.md** for test cases
2. Check **SETUP.md** for configuration
3. Check **ENHANCEMENT_SUMMARY.md** for feature overview
4. Review **browser console** for errors (F12)
5. Check the **src/ code** - it's well-commented

---

Happy coding! 🚀🎤
