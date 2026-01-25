import { useState, useEffect, useRef } from 'react';
import emailService from '../services/emailService';
import textToSpeech from '../services/textToSpeech';
import voiceRecognition from '../services/voiceRecognition';

function EmailCompose({ onSend, onCancel }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [voiceMode, setVoiceMode] = useState(null); // 'to', 'subject', 'body'
  const bodyRef = useRef(null);

  useEffect(() => {
    // Announce compose screen
    textToSpeech.speak('Compose email. Use voice commands to fill in the fields.');
    
    voiceRecognition.onResult((result) => {
      if (result.final && voiceMode) {
        const text = result.final.trim();
        switch (voiceMode) {
          case 'to':
            setTo(text);
            textToSpeech.speak(`Recipient set to ${text}`);
            break;
          case 'subject':
            setSubject(text);
            textToSpeech.speak(`Subject set to ${text}`);
            break;
          case 'body':
            setBody(prev => prev + (prev ? ' ' : '') + text);
            break;
          default:
            break;
        }
        setVoiceMode(null);
        voiceRecognition.stop();
      }
    });

    return () => {
      voiceRecognition.stop();
    };
  }, [voiceMode]);

  const handleVoiceInput = (field) => {
    if (voiceMode === field) {
      voiceRecognition.stop();
      setVoiceMode(null);
      textToSpeech.speak('Voice input stopped');
    } else {
      setVoiceMode(field);
      voiceRecognition.start();
      const fieldNames = {
        to: 'recipient',
        subject: 'subject',
        body: 'body'
      };
      textToSpeech.speak(`Speak the ${fieldNames[field]}`);
    }
  };

  const handleSend = async () => {
    if (!to || !subject || !body) {
      setError('Please fill in all fields');
      textToSpeech.speak('Please fill in all fields before sending');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await emailService.sendEmail({ to, subject, body });
      textToSpeech.speak('Email sent successfully');
      if (onSend) {
        onSend();
      }
      // Reset form
      setTo('');
      setSubject('');
      setBody('');
    } catch (err) {
      setError('Failed to send email');
      textToSpeech.speak('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="email-compose" role="main" aria-label="Compose Email">
      <h1>Compose Email</h1>
      
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <div className="form-group">
          <label htmlFor="to">
            To:
            <button
              type="button"
              className="voice-input-button"
              onClick={() => handleVoiceInput('to')}
              aria-label="Use voice input for recipient"
            >
              {voiceMode === 'to' ? '🛑 Stop' : '🎤 Voice'}
            </button>
          </label>
          <input
            id="to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            aria-required="true"
            aria-label="Email recipient"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject:
            <button
              type="button"
              className="voice-input-button"
              onClick={() => handleVoiceInput('subject')}
              aria-label="Use voice input for subject"
            >
              {voiceMode === 'subject' ? '🛑 Stop' : '🎤 Voice'}
            </button>
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            aria-required="true"
            aria-label="Email subject"
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">
            Body:
            <button
              type="button"
              className="voice-input-button"
              onClick={() => handleVoiceInput('body')}
              aria-label="Use voice input for email body"
            >
              {voiceMode === 'body' ? '🛑 Stop' : '🎤 Voice'}
            </button>
          </label>
          <textarea
            id="body"
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message here or use voice input"
            rows="10"
            aria-required="true"
            aria-label="Email body"
          />
        </div>

        {error && (
          <div className="error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel composing email"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            aria-label="Send email"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailCompose;
