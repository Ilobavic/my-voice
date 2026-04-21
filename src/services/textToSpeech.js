/**
 * Text-to-Speech Service
 * Handles reading text aloud for accessibility
 */
class TextToSpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  speak(text, options = {}) {
    if (!this.synthesis) {
      console.error("Speech synthesis not supported");
      return;
    }

    if (!text || text.trim() === "") {
      console.warn("Empty text provided to speech synthesis");
      return;
    }

    // Stop any current speech
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || this.getStoredRate() || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.lang || this.getStoredLanguage() || "en-US";

      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log("Speech started");
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        console.log("Speech ended");
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        this.isSpeaking = false;
        if (options.onError) options.onError(event);
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    } catch (error) {
      console.error("Failed to speak:", error);
    }
  }

  stop() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  pause() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  isAvailable() {
    return !!window.speechSynthesis;
  }

  setRate(rate) {
    localStorage.setItem("tts_rate", rate.toString());
  }

  getStoredRate() {
    const stored = localStorage.getItem("tts_rate");
    return stored ? parseFloat(stored) : null;
  }

  setLanguage(lang) {
    localStorage.setItem("tts_language", lang);
  }

  getStoredLanguage() {
    return localStorage.getItem("tts_language");
  }

  getAvailableVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }
}

export default new TextToSpeechService();
