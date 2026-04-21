/**
 * Voice Command Handler
 * Processes voice commands and triggers appropriate actions
 */
class VoiceCommandHandler {
  constructor() {
    this.commands = {
      compose: [
        "compose",
        "new email",
        "write email",
        "create email",
        "compose email",
      ],
      inbox: ["inbox", "show inbox", "go to inbox", "my emails", "read inbox"],
      read: ["read", "read email", "open email"],
      send: ["send", "send email"],
      delete: ["delete", "delete email", "remove email"],
      reply: ["reply", "reply to email", "respond"],
      next: ["next", "next email", "next message"],
      previous: ["previous", "previous email", "last email"],
      stop: ["stop", "stop listening", "cancel"],
      exit: ["exit", "quit", "close", "logout"],
      help: ["help", "what can I say", "commands"],
      search: ["search", "find email", "search inbox"],
      "mark read": ["mark as read", "mark read"],
      "mark unread": ["mark as unread", "mark unread"],
    };
  }

  processCommand(text) {
    const lowerText = text.toLowerCase().trim();
    let bestMatch = null;
    let bestConfidence = 0;

    // Check each command category
    for (const [action, keywords] of Object.entries(this.commands)) {
      for (const keyword of keywords) {
        const confidence = this.calculateConfidence(lowerText, keyword);

        // If we find an exact or high-confidence match, prioritize it
        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          bestMatch = {
            action,
            confidence,
            originalText: text,
          };
        }
      }
    }

    // Only return a match if confidence is above threshold
    if (bestMatch && bestConfidence >= 0.5) {
      return bestMatch;
    }

    return null;
  }

  calculateConfidence(text, keyword) {
    // Exact match
    if (text === keyword) return 1.0;

    // Keyword at start or end
    if (text.startsWith(keyword) || text.endsWith(keyword)) return 0.85;

    // Keyword is a complete word in the text
    const words = text.split(/\s+/);
    const keywordWords = keyword.split(/\s+/);

    // Check if all keyword words are in the text
    const allWordsPresent = keywordWords.every((kw) =>
      words.some((w) => w.includes(kw) || kw.includes(w)),
    );

    if (allWordsPresent) return 0.75;

    // Partial match using character similarity (Levenshtein-like)
    if (text.includes(keyword)) return 0.65;

    // Check for partial word matches
    const keywordMatch = keywordWords.some((kw) =>
      words.some((w) => this.stringSimilarity(w, kw) > 0.6),
    );

    if (keywordMatch) return 0.55;

    return 0;
  }

  // Simple string similarity algorithm (Levenshtein distance)
  stringSimilarity(s1, s2) {
    const len = Math.max(s1.length, s2.length);
    if (len === 0) return 1.0;

    const distance = this.levenshteinDistance(s1, s2);
    return (len - distance) / len;
  }

  levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
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
