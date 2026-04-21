import { useState, useEffect, useRef } from "react";
import VoiceControl from "./components/VoiceControl";
import Login from "./components/Login";
import EmailInbox from "./components/EmailInbox";
import EmailCompose from "./components/EmailCompose";
import EmailRead from "./components/EmailRead";
import EmailReply from "./components/EmailReply";
import textToSpeech from "./services/textToSpeech";
import voiceCommands from "./services/voiceCommands";
import authService from "./services/authService";
import voiceRecognition from "./services/voiceRecognition";
import "./App.css";

function App() {
  const [view, setView] = useState("login"); // 'login', 'inbox', 'compose', 'read', 'reply', 'settings'
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    speechRate: 1.0,
    language: "en-US",
  });
  const inboxRef = useRef(null);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
      setView("inbox");
      loadSettings();
      textToSpeech.speak(
        `Welcome back ${
          authService.getCurrentUser().name ||
          authService.getCurrentUser().email
        }. Say "Help" to learn available commands.`,
      );
    } else {
      setView("login");
    }
  }, []);

  useEffect(() => {
    // Apply settings
    if (settings.speechRate) {
      textToSpeech.setRate(settings.speechRate);
    }
    if (settings.language) {
      textToSpeech.setLanguage(settings.language);
      voiceRecognition.setLanguage(settings.language);
    }
  }, [settings]);

  const loadSettings = () => {
    const storedRate = localStorage.getItem("tts_rate");
    const storedLang = localStorage.getItem("tts_language");
    if (storedRate || storedLang) {
      setSettings({
        speechRate: storedRate ? parseFloat(storedRate) : 1.0,
        language: storedLang || "en-US",
      });
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setView("inbox");
    loadSettings();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView("login");
    textToSpeech.speak("Logged out successfully");
  };

  const handleCommand = (command) => {
    const { action, originalText } = command;

    switch (action) {
      case "compose":
        setView("compose");
        textToSpeech.speak("Opening compose email");
        break;

      case "inbox":
        setView("inbox");
        setSelectedEmailId(null);
        textToSpeech.speak("Opening inbox");
        break;

      case "read":
        const emailNumber = voiceCommands.extractEmailNumber(originalText);
        if (emailNumber) {
          setSelectedEmailId(emailNumber);
          setView("read");
          textToSpeech.speak(`Opening email ${emailNumber}`);
        } else {
          textToSpeech.speak(
            "Please specify which email to read, for example, read email one",
          );
        }
        break;

      case "send":
        if (view === "compose") {
          const sendButton = document.querySelector(
            '.email-compose button[type="submit"]',
          );
          if (sendButton) {
            sendButton.click();
          }
        } else {
          textToSpeech.speak("You are not in the compose view");
        }
        break;

      case "delete":
        if (view === "read" && selectedEmailId) {
          const deleteButton = document.querySelector(
            ".email-read .delete-button",
          );
          if (deleteButton) {
            deleteButton.click();
          }
        } else {
          textToSpeech.speak("Please open an email to delete it");
        }
        break;

      case "next":
        if (inboxRef.current && inboxRef.current.nextEmail) {
          inboxRef.current.nextEmail();
          textToSpeech.speak("Moving to next email");
        }
        break;

      case "previous":
        if (inboxRef.current && inboxRef.current.previousEmail) {
          inboxRef.current.previousEmail();
          textToSpeech.speak("Moving to previous email");
        }
        break;

      case "stop":
        textToSpeech.speak("Stopped");
        break;

      case "reply":
        if (view === "read" && selectedEmail) {
          setView("reply");
          textToSpeech.speak("Opening reply");
        } else {
          textToSpeech.speak("Please open an email first to reply");
        }
        break;

      case "search":
        if (view === "inbox") {
          textToSpeech.speak(
            "Please use the search box or say your search query",
          );
        }
        break;

      case "mark read":
        textToSpeech.speak("Mark as read feature available in inbox");
        break;

      case "mark unread":
        textToSpeech.speak("Mark as unread feature available in inbox");
        break;

      case "exit":
        if (window.confirm("Are you sure you want to exit?")) {
          handleLogout();
        }
        break;

      case "help":
        textToSpeech.speak(
          "Available commands: Compose, Inbox, Read Email, Send, Delete, Reply, Next, Previous, Search, Mark Read, Mark Unread, Exit, Stop, Help",
        );
        break;

      default:
        break;
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmailId(email.id);
    setSelectedEmail(email);
    setView("read");
  };

  const handleReply = (email) => {
    setSelectedEmail(email);
    setView("reply");
  };

  const handleReplyComplete = () => {
    setView("inbox");
    setSelectedEmail(null);
    setSelectedEmailId(null);
  };

  const handleCompose = () => {
    setView("compose");
  };

  const handleSendComplete = () => {
    setView("inbox");
    setSelectedEmailId(null);
  };

  const handleBackToInbox = () => {
    setView("inbox");
    setSelectedEmailId(null);
  };

  const handleDeleteComplete = () => {
    setView("inbox");
    setSelectedEmailId(null);
  };

  if (view === "login") {
    return (
      <div className="app" role="application">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div
      className="app"
      role="application"
      aria-label="Voice Controlled Email System"
    >
      <header className="app-header" role="banner">
        <div className="header-content">
          <div>
            <h1>📧 Voice-Controlled Email System</h1>
            <p className="subtitle">
              Accessible email management for the visually impaired
            </p>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name || user?.email}</span>
            <button onClick={() => setView("settings")} aria-label="Settings">
              ⚙️ Settings
            </button>
            <button onClick={handleLogout} aria-label="Logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="app-nav" role="navigation" aria-label="Main navigation">
        <VoiceControl onCommand={handleCommand} />
      </nav>

      <main className="app-main" role="main">
        {view === "inbox" && (
          <EmailInbox
            ref={inboxRef}
            onSelectEmail={handleSelectEmail}
            onCompose={handleCompose}
            onReply={handleReply}
          />
        )}

        {view === "compose" && (
          <EmailCompose
            onSend={handleSendComplete}
            onCancel={handleBackToInbox}
          />
        )}

        {view === "read" && selectedEmailId && (
          <EmailRead
            emailId={selectedEmailId}
            onBack={handleBackToInbox}
            onDelete={handleDeleteComplete}
            onReply={handleReply}
          />
        )}

        {view === "reply" && selectedEmail && (
          <EmailReply
            originalEmail={selectedEmail}
            onSend={handleReplyComplete}
            onCancel={handleBackToInbox}
          />
        )}

        {view === "settings" && (
          <div className="settings-panel">
            <h1>Settings</h1>
            <div className="settings-group">
              <label>
                Speech Rate: {settings.speechRate.toFixed(1)}x
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.speechRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    setSettings({ ...settings, speechRate: rate });
                    textToSpeech.setRate(rate);
                    textToSpeech.speak(`Speech rate set to ${rate.toFixed(1)}`);
                  }}
                  aria-label="Speech rate"
                />
              </label>
            </div>
            <div className="settings-group">
              <label>
                Language:
                <select
                  value={settings.language}
                  onChange={(e) => {
                    const lang = e.target.value;
                    setSettings({ ...settings, language: lang });
                    textToSpeech.setLanguage(lang);
                    voiceRecognition.setLanguage(lang);
                    textToSpeech.speak(`Language set to ${lang}`);
                  }}
                  aria-label="Language"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </label>
            </div>
            <button onClick={() => setView("inbox")}>Back to Inbox</button>
          </div>
        )}
      </main>

      <footer className="app-footer" role="contentinfo">
        <p>Voice-Controlled Email System - Designed for Accessibility</p>
      </footer>
    </div>
  );
}

export default App;
