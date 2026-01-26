import { useState, useEffect } from "react";
import emailService from "../services/emailService";
import textToSpeech from "../services/textToSpeech";

function EmailRead({ emailId, onBack, onDelete, onReply }) {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (emailId) {
      loadEmail();
    }
  }, [emailId]);

  const loadEmail = async () => {
    try {
      setLoading(true);
      const emailData = await emailService.getEmail(emailId);
      if (emailData) {
        setEmail(emailData);
        // Read email aloud
        textToSpeech.speak(
          `Email from ${emailData.from}. Subject: ${emailData.subject}. ${emailData.body}`
        );
      } else {
        setError("Email not found");
        textToSpeech.speak("Email not found");
      }
    } catch (err) {
      setError("Failed to load email");
      textToSpeech.speak("Failed to load email");
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (email) {
      textToSpeech.speak(
        `Email from ${email.from}. Subject: ${email.subject}. ${email.body}`
      );
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this email?")) {
      try {
        await emailService.deleteEmail(emailId);
        textToSpeech.speak("Email deleted");
        if (onDelete) {
          onDelete();
        }
      } catch (err) {
        setError("Failed to delete email");
        textToSpeech.speak("Failed to delete email");
      }
    }
  };

  if (loading) {
    return (
      <div className="email-read" role="status" aria-live="polite">
        <p>Loading email...</p>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div className="email-read" role="alert">
        <p>{error || "Email not found"}</p>
        <button onClick={onBack}>Back to Inbox</button>
      </div>
    );
  }

  return (
    <div className="email-read" role="main" aria-label="Read Email">
      <div className="email-read-header">
        <button onClick={onBack} aria-label="Back to inbox">
          ← Back to Inbox
        </button>
        <div className="email-actions">
          {onReply && (
            <button
              onClick={() => onReply(email)}
              aria-label="Reply to email"
              className="reply-button"
            >
              Reply
            </button>
          )}
          <button onClick={handleReadAloud} aria-label="Read email aloud">
            🔊 Read Aloud
          </button>
          <button
            onClick={handleDelete}
            aria-label="Delete email"
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>

      <article className="email-content" aria-label="Email content">
        <div className="email-meta">
          <div className="email-field">
            <strong aria-label="From">From:</strong>
            <span aria-label={`Sender: ${email.from}`}>{email.from}</span>
          </div>
          <div className="email-field">
            <strong aria-label="To">To:</strong>
            <span aria-label={`Recipient: ${email.to}`}>{email.to}</span>
          </div>
          <div className="email-field">
            <strong aria-label="Date">Date:</strong>
            <span aria-label={`Date: ${email.date.toLocaleString()}`}>
              {email.date.toLocaleString()}
            </span>
          </div>
        </div>

        <h2 className="email-subject" aria-label={`Subject: ${email.subject}`}>
          {email.subject}
        </h2>

        <div className="email-body" aria-label="Email body">
          {email.body.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export default EmailRead;
