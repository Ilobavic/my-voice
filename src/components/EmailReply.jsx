import { useState, useEffect } from "react";
import emailService from "../services/emailService";
import textToSpeech from "../services/textToSpeech";
import voiceRecognition from "../services/voiceRecognition";

function EmailReply({ originalEmail, onSend, onCancel }) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState(false);

  useEffect(() => {
    if (originalEmail) {
      textToSpeech.speak(
        `Replying to email from ${originalEmail.from}. Subject: ${originalEmail.subject}. Speak your reply or type it.`
      );
    }

    voiceRecognition.onResult((result) => {
      if (result.final && voiceMode) {
        setBody((prev) => prev + (prev ? " " : "") + result.final.trim());
      }

      if (result.final && confirmationMode) {
        const text = result.final.toLowerCase().trim();
        if (
          text.includes("yes") ||
          text.includes("confirm") ||
          text.includes("send")
        ) {
          confirmAndSend();
        } else if (text.includes("no") || text.includes("cancel")) {
          textToSpeech.speak("Reply cancelled");
          setConfirmationMode(false);
          setNeedsConfirmation(false);
          voiceRecognition.stop();
        }
      }
    });

    return () => {
      voiceRecognition.stop();
    };
  }, [voiceMode, confirmationMode, originalEmail]);

  const handleVoiceInput = () => {
    if (voiceMode) {
      voiceRecognition.stop();
      setVoiceMode(false);
      textToSpeech.speak("Voice input stopped");
    } else {
      setVoiceMode(true);
      voiceRecognition.start();
      textToSpeech.speak("Speak your reply");
    }
  };

  const confirmAndSend = async () => {
    setConfirmationMode(false);
    setNeedsConfirmation(false);
    voiceRecognition.stop();

    setSending(true);
    setError(null);

    try {
      await emailService.replyToEmail(originalEmail.id, body);
      textToSpeech.speak("Reply sent successfully");
      if (onSend) {
        onSend();
      }
      setBody("");
    } catch (err) {
      setError("Failed to send reply");
      textToSpeech.speak(`Failed to send reply. ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    if (!body.trim()) {
      setError("Please enter a reply message");
      textToSpeech.speak("Please enter a reply message");
      return;
    }

    // Voice confirmation before sending
    setNeedsConfirmation(true);
    setConfirmationMode(true);
    voiceRecognition.start();

    const confirmationText = `Please confirm sending reply to ${originalEmail.from}. Say "yes" to confirm or "no" to cancel.`;
    textToSpeech.speak(confirmationText);
  };

  if (!originalEmail) {
    return null;
  }

  return (
    <div className="email-reply" role="main" aria-label="Reply to Email">
      <h1>Reply to Email</h1>

      <div className="original-email-preview">
        <p>
          <strong>To:</strong> {originalEmail.from}
        </p>
        <p>
          <strong>Subject:</strong> Re: {originalEmail.subject}
        </p>
        <details>
          <summary>Original Message</summary>
          <div className="original-body">
            <p>
              <strong>From:</strong> {originalEmail.from}
            </p>
            <p>
              <strong>Date:</strong> {originalEmail.date.toLocaleString()}
            </p>
            <p>{originalEmail.body}</p>
          </div>
        </details>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <div className="form-group">
          <label htmlFor="reply-body">
            Your Reply:
            <button
              type="button"
              className="voice-input-button"
              onClick={handleVoiceInput}
              aria-label="Use voice input for reply"
            >
              {voiceMode ? "🛑 Stop" : "🎤 Voice"}
            </button>
          </label>
          <textarea
            id="reply-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your reply here or use voice input"
            rows="10"
            aria-required="true"
            aria-label="Reply message"
          />
        </div>

        {error && (
          <div className="error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {needsConfirmation && (
          <div className="confirmation-box" role="alert" aria-live="polite">
            <p>Confirm sending reply to {originalEmail.from}?</p>
            <div className="confirmation-actions">
              <button
                type="button"
                onClick={confirmAndSend}
                aria-label="Confirm and send reply"
              >
                Yes, Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setNeedsConfirmation(false);
                  setConfirmationMode(false);
                  voiceRecognition.stop();
                  textToSpeech.speak("Reply cancelled");
                }}
                aria-label="Cancel reply"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} aria-label="Cancel reply">
            Cancel
          </button>
          <button type="submit" disabled={sending} aria-label="Send reply">
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailReply;
