/**
 * Voice Recognition Service
 * Handles speech-to-text conversion using Web Speech API
 */
class VoiceRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.init();
  }

  init() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("Voice recognition started");
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (this.onResultCallback) {
        this.onResultCallback({
          interim: interimTranscript,
          final: finalTranscript.trim(),
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.isListening = false;

      let errorMessage = "Speech recognition error occurred";

      switch (event.error) {
        case "no-speech":
          errorMessage =
            "No speech detected. Please speak clearly into the microphone.";
          break;
        case "audio-capture":
          errorMessage =
            "Microphone not found or not accessible. Please check your microphone settings.";
          break;
        case "not-allowed":
          errorMessage =
            "Microphone access denied. Please allow microphone access in your browser settings.";
          break;
        case "network":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "aborted":
          errorMessage = "Speech recognition was aborted.";
          break;
        case "bad-grammar":
          errorMessage = "Grammar error in speech recognition.";
          break;
        case "language-not-supported":
          errorMessage = "Language not supported.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
      }

      if (this.onErrorCallback) {
        this.onErrorCallback({
          code: event.error,
          message: errorMessage,
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Voice recognition ended");
    };

    this.recognition.onnomatch = () => {
      this.isListening = false;
      console.warn("No speech match found");
      if (this.onErrorCallback) {
        this.onErrorCallback({
          code: "no-match",
          message:
            "No speech match found. Please speak more clearly or try again.",
        });
      }
    };
  }

  start() {
    if (!this.recognition) {
      throw new Error("Speech recognition not available");
    }

    if (!this.isListening) {
      try {
        this.isListening = true;
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        if (this.onErrorCallback) {
          this.onErrorCallback({
            code: "start-failed",
            message: "Failed to start voice recognition. Please try again.",
          });
        }
        throw error;
      }
    }
  }

  setLanguage(lang) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  onResult(callback) {
    this.onResultCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  isAvailable() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}

export default new VoiceRecognitionService();
