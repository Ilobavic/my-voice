import { useState, useEffect } from 'react';
import VoiceControl from './components/VoiceControl';
import EmailInbox from './components/EmailInbox';
import EmailCompose from './components/EmailCompose';
import EmailRead from './components/EmailRead';
import textToSpeech from './services/textToSpeech';
import voiceCommands from './services/voiceCommands';
import './App.css';

function App() {
  const [view, setView] = useState('inbox'); // 'inbox', 'compose', 'read'
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  useEffect(() => {
    // Welcome message
    textToSpeech.speak(
      'Welcome to Voice Controlled Email System. Say "Help" to learn available commands.'
    );
  }, []);

  const handleCommand = (command) => {
    const { action, originalText } = command;

    switch (action) {
      case 'compose':
        setView('compose');
        textToSpeech.speak('Opening compose email');
        break;
      
      case 'inbox':
        setView('inbox');
        setSelectedEmailId(null);
        textToSpeech.speak('Opening inbox');
        break;
      
      case 'read':
        const emailNumber = voiceCommands.extractEmailNumber(originalText);
        if (emailNumber) {
          // In a real app, you'd map this to actual email IDs
          setSelectedEmailId(emailNumber);
          setView('read');
          textToSpeech.speak(`Opening email ${emailNumber}`);
        } else {
          textToSpeech.speak('Please specify which email to read, for example, read email one');
        }
        break;
      
      case 'send':
        if (view === 'compose') {
          // Trigger send in compose component
          const sendButton = document.querySelector('.email-compose button[type="submit"]');
          if (sendButton) {
            sendButton.click();
          }
        } else {
          textToSpeech.speak('You are not in the compose view');
        }
        break;
      
      case 'delete':
        if (view === 'read' && selectedEmailId) {
          const deleteButton = document.querySelector('.email-read .delete-button');
          if (deleteButton) {
            deleteButton.click();
          }
        } else {
          textToSpeech.speak('Please open an email to delete it');
        }
        break;
      
      case 'next':
        textToSpeech.speak('Next email feature coming soon');
        break;
      
      case 'previous':
        textToSpeech.speak('Previous email feature coming soon');
        break;
      
      case 'stop':
        textToSpeech.speak('Stopped');
        break;
      
      case 'help':
        textToSpeech.speak(
          'Available commands: Compose, Inbox, Read Email, Send, Delete, Next, Previous, Stop, Help'
        );
        break;
      
      default:
        break;
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmailId(email.id);
    setView('read');
  };

  const handleCompose = () => {
    setView('compose');
  };

  const handleSendComplete = () => {
    setView('inbox');
    setSelectedEmailId(null);
  };

  const handleBackToInbox = () => {
    setView('inbox');
    setSelectedEmailId(null);
  };

  const handleDeleteComplete = () => {
    setView('inbox');
    setSelectedEmailId(null);
  };

  return (
    <div className="app" role="application" aria-label="Voice Controlled Email System">
      <header className="app-header" role="banner">
        <h1>📧 Voice-Controlled Email System</h1>
        <p className="subtitle">Accessible email management for the visually impaired</p>
      </header>

      <nav className="app-nav" role="navigation" aria-label="Main navigation">
        <VoiceControl onCommand={handleCommand} />
      </nav>

      <main className="app-main" role="main">
        {view === 'inbox' && (
          <EmailInbox
            onSelectEmail={handleSelectEmail}
            onCompose={handleCompose}
          />
        )}
        
        {view === 'compose' && (
          <EmailCompose
            onSend={handleSendComplete}
            onCancel={handleBackToInbox}
          />
        )}
        
        {view === 'read' && selectedEmailId && (
          <EmailRead
            emailId={selectedEmailId}
            onBack={handleBackToInbox}
            onDelete={handleDeleteComplete}
          />
        )}
      </main>

      <footer className="app-footer" role="contentinfo">
        <p>Voice-Controlled Email System - Designed for Accessibility</p>
      </footer>
    </div>
  );
}

export default App;
