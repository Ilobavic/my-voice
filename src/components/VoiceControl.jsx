import { useState, useEffect } from 'react';
import voiceRecognition from '../services/voiceRecognition';
import textToSpeech from '../services/textToSpeech';
import voiceCommands from '../services/voiceCommands';

function VoiceControl({ onCommand, onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    setIsAvailable(voiceRecognition.isAvailable());
    
    voiceRecognition.onResult((result) => {
      setTranscript(result.final || result.interim);
      if (onTranscript) {
        onTranscript(result.final || result.interim);
      }
      
      // Process commands from final transcript
      if (result.final) {
        const command = voiceCommands.processCommand(result.final);
        if (command && onCommand) {
          onCommand(command);
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
      setTranscript('');
    } else {
      try {
        voiceRecognition.start();
        setIsListening(true);
        setError(null);
        textToSpeech.speak('Voice recognition started. You can now speak your commands.');
      } catch (err) {
        setError('Failed to start voice recognition');
        setIsListening(false);
      }
    }
  };

  if (!isAvailable) {
    return (
      <div className="voice-control" role="alert" aria-live="polite">
        <p>Voice recognition is not available in your browser.</p>
        <p>Please use a browser that supports the Web Speech API (Chrome, Edge, Safari).</p>
      </div>
    );
  }

  return (
    <div className="voice-control" role="region" aria-label="Voice Control">
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
        aria-pressed={isListening}
      >
        <span className="voice-icon">{isListening ? '🛑' : '🎤'}</span>
        <span>{isListening ? 'Stop Listening' : 'Start Voice Control'}</span>
      </button>
      
      {isListening && (
        <div className="listening-indicator" aria-live="polite">
          <span className="pulse"></span>
          <span>Listening...</span>
        </div>
      )}
      
      {transcript && (
        <div className="transcript" role="log" aria-live="polite" aria-label="Voice transcript">
          <strong>You said:</strong> {transcript}
        </div>
      )}
      
      {error && (
        <div className="error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      
      <div className="voice-help" role="region" aria-label="Voice Commands Help">
        <details>
          <summary>Available Voice Commands</summary>
          <ul>
            <li>"Compose" or "New Email" - Create a new email</li>
            <li>"Inbox" - View your inbox</li>
            <li>"Read Email [number]" - Read a specific email</li>
            <li>"Send" - Send the current email</li>
            <li>"Delete" - Delete the current email</li>
            <li>"Next" - Go to next email</li>
            <li>"Previous" - Go to previous email</li>
            <li>"Stop" - Stop listening</li>
            <li>"Help" - Show this help</li>
          </ul>
        </details>
      </div>
    </div>
  );
}

export default VoiceControl;
