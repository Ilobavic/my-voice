import { useState, useEffect } from "react";
import voiceRecognition from "../services/voiceRecognition";
import textToSpeech from "../services/textToSpeech";
import voiceCommands from "../services/voiceCommands";

function VoiceControl({ onCommand, onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState(null);
  const [commandConfidence, setCommandConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  useEffect(() => {
    setIsAvailable(voiceRecognition.isAvailable());

    voiceRecognition.onResult((result) => {
      setInterimTranscript(result.interim);
      setTranscript(result.final);

      if (onTranscript) {
        onTranscript(result.final || result.interim);
      }

      // Process commands from final transcript
      if (result.final && result.final.trim()) {
        const command = voiceCommands.processCommand(result.final);
        if (command && onCommand) {
          // Update UI with command and confidence
          setLastCommand(command.action);
          setCommandConfidence(Math.round(command.confidence * 100));

          // Add to history
          setCommandHistory((prev) => [
            {
              command: command.action,
              text: result.final,
              confidence: command.confidence,
              timestamp: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 4), // Keep last 5
          ]);

          // Announce command recognition
          textToSpeech.speak(`Recognized: ${command.action}`);

          // Execute command
          onCommand(command);
        } else if (result.final.trim()) {
          // No command recognized - provide feedback
          const suggestion =
            "I didn't recognize that command. Try: Compose, Inbox, Read Email, Send, Delete, Reply, Next, Previous, Help";
          setError(suggestion);
          textToSpeech.speak(suggestion);
        }
      }
    });

    voiceRecognition.onError((err) => {
      setError(`Error: ${err}`);
      setIsListening(false);
    });

    return () => {
      voiceRecognition.stop();
    };
  }, [onCommand, onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
      setTranscript("");
    } else {
      try {
        voiceRecognition.start();
        setIsListening(true);
        setError(null);
        textToSpeech.speak(
          "Voice recognition started. You can now speak your commands.",
        );
      } catch (err) {
        setError("Failed to start voice recognition");
        setIsListening(false);
      }
    }
  };

  if (!isAvailable) {
    return (
      <div className="voice-control" role="alert" aria-live="polite">
        <p>Voice recognition is not available in your browser.</p>
        <p>
          Please use a browser that supports the Web Speech API (Chrome, Edge,
          Safari).
        </p>
      </div>
    );
  }

  return (
    <div className="voice-control" role="region" aria-label="Voice Control">
      <button
        className={`voice-button ${isListening ? "listening" : ""}`}
        onClick={toggleListening}
        aria-label={isListening ? "Stop listening" : "Start listening"}
        aria-pressed={isListening}
      >
        <span className="voice-icon">{isListening ? "🛑" : "🎤"}</span>
        <span>{isListening ? "Stop Listening" : "Start Voice Control"}</span>
      </button>

      {isListening && (
        <div className="listening-indicator" aria-live="polite">
          <span className="pulse"></span>
          <span className="listening-text">Listening...</span>
        </div>
      )}

      {interimTranscript && (
        <div
          className="interim-transcript"
          role="log"
          aria-live="polite"
          aria-label="Interim voice transcript"
        >
          <small>
            Hearing: <em>{interimTranscript}</em>
          </small>
        </div>
      )}

      {transcript && (
        <div
          className="transcript"
          role="log"
          aria-live="assertive"
          aria-label="Final voice transcript"
        >
          <strong>You said:</strong> {transcript}
        </div>
      )}

      {lastCommand && (
        <div className="command-feedback" role="status" aria-live="polite">
          <strong>Command:</strong> {lastCommand.toUpperCase()}
          <div className="confidence-meter">
            <div
              className="confidence-bar"
              style={{ width: `${commandConfidence}%` }}
            ></div>
          </div>
          <small>{commandConfidence}% confidence</small>
        </div>
      )}

      {error && (
        <div className="error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {commandHistory.length > 0 && (
        <div
          className="command-history"
          role="region"
          aria-label="Command history"
        >
          <details>
            <summary>Recent Commands ({commandHistory.length})</summary>
            <ul className="history-list">
              {commandHistory.map((cmd, idx) => (
                <li
                  key={idx}
                  className={`history-item confidence-${Math.round(cmd.confidence * 3)}`}
                >
                  <span className="history-command">{cmd.command}</span>
                  <span className="history-time">{cmd.timestamp}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}

      <div
        className="voice-help"
        role="region"
        aria-label="Voice Commands Help"
      >
        <details>
          <summary>Available Voice Commands</summary>
          <ul>
            <li>"Compose" or "New Email" - Create a new email</li>
            <li>"Inbox" - View your inbox</li>
            <li>"Read Email [number]" - Read a specific email</li>
            <li>"Send" - Send the current email</li>
            <li>"Delete" - Delete the current email</li>
            <li>"Reply" - Reply to current email</li>
            <li>"Next" - Go to next email</li>
            <li>"Previous" - Go to previous email</li>
            <li>"Mark Read" - Mark email as read</li>
            <li>"Mark Unread" - Mark email as unread</li>
            <li>"Stop" - Stop listening</li>
            <li>"Help" - Show this help</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

export default VoiceControl;
