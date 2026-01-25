/**
 * Voice Command Handler
 * Processes voice commands and triggers appropriate actions
 */
class VoiceCommandHandler {
  constructor() {
    this.commands = {
      'compose': ['compose', 'new email', 'write email', 'create email'],
      'inbox': ['inbox', 'show inbox', 'go to inbox', 'my emails'],
      'read': ['read', 'read email', 'open email'],
      'send': ['send', 'send email'],
      'delete': ['delete', 'delete email', 'remove email'],
      'next': ['next', 'next email', 'next message'],
      'previous': ['previous', 'previous email', 'last email'],
      'stop': ['stop', 'stop listening', 'cancel'],
      'help': ['help', 'what can I say', 'commands']
    };
  }

  processCommand(text) {
    const lowerText = text.toLowerCase().trim();

    // Check each command category
    for (const [action, keywords] of Object.entries(this.commands)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return {
            action,
            confidence: this.calculateConfidence(lowerText, keyword),
            originalText: text
          };
        }
      }
    }

    return null;
  }

  calculateConfidence(text, keyword) {
    // Simple confidence calculation based on exact match
    if (text === keyword) return 1.0;
    if (text.startsWith(keyword) || text.endsWith(keyword)) return 0.8;
    return 0.6;
  }

  extractEmailNumber(text) {
    // Extract number from text (e.g., "read email 1" -> 1)
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  extractEmailAddress(text) {
    // Simple email extraction (in production, use more robust regex)
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }
}

export default new VoiceCommandHandler();
