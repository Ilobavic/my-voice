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
      console.error('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.lang || 'en-US';

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      if (options.onError) options.onError(event);
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
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
}

export default new TextToSpeechService();
