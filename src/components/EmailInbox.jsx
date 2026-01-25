import { useState, useEffect } from 'react';
import emailService from '../services/emailService';
import textToSpeech from '../services/textToSpeech';

function EmailInbox({ onSelectEmail, onCompose }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setLoading(true);
      const emailList = await emailService.getEmails();
      setEmails(emailList);
      setError(null);
      
      // Announce inbox loaded
      textToSpeech.speak(`Inbox loaded. You have ${emailList.length} emails.`);
    } catch (err) {
      setError('Failed to load emails');
      textToSpeech.speak('Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedId(email.id);
    if (onSelectEmail) {
      onSelectEmail(email);
    }
    textToSpeech.speak(`Email from ${email.from}. Subject: ${email.subject}`);
  };

  const handleDelete = async (emailId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this email?')) {
      try {
        await emailService.deleteEmail(emailId);
        await loadEmails();
        textToSpeech.speak('Email deleted');
      } catch (err) {
        setError('Failed to delete email');
        textToSpeech.speak('Failed to delete email');
      }
    }
  };

  if (loading) {
    return (
      <div className="email-inbox" role="status" aria-live="polite">
        <p>Loading emails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="email-inbox" role="alert">
        <p>{error}</p>
        <button onClick={loadEmails}>Retry</button>
      </div>
    );
  }

  return (
    <div className="email-inbox" role="main" aria-label="Email Inbox">
      <div className="inbox-header">
        <h1>Inbox</h1>
        <button 
          className="compose-button"
          onClick={onCompose}
          aria-label="Compose new email"
        >
          + Compose
        </button>
      </div>
      
      <div className="email-list" role="list" aria-label="Email list">
        {emails.length === 0 ? (
          <p className="empty-state">No emails found</p>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className={`email-item ${selectedId === email.id ? 'selected' : ''} ${!email.read ? 'unread' : ''}`}
              role="listitem"
              tabIndex={0}
              onClick={() => handleEmailClick(email)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEmailClick(email);
                }
              }}
              aria-label={`Email from ${email.from}, subject: ${email.subject}, ${email.read ? 'read' : 'unread'}`}
            >
              <div className="email-item-header">
                <span className="email-from" aria-label={`From: ${email.from}`}>
                  {email.from}
                </span>
                <span className="email-date" aria-label={`Date: ${email.date.toLocaleDateString()}`}>
                  {email.date.toLocaleDateString()}
                </span>
              </div>
              <div className="email-subject" aria-label={`Subject: ${email.subject}`}>
                {!email.read && <span className="unread-indicator" aria-label="Unread"></span>}
                {email.subject}
              </div>
              <div className="email-preview" aria-label={`Preview: ${email.body.substring(0, 100)}`}>
                {email.body.substring(0, 100)}...
              </div>
              <button
                className="delete-button"
                onClick={(e) => handleDelete(email.id, e)}
                aria-label={`Delete email from ${email.from}`}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmailInbox;
