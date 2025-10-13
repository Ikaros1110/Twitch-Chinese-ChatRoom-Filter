// Filter module for detecting blocked terms and Unicode attacks
class MessageFilter {
  constructor() {
    this.blockedTerms = [];
    this.enabled = true;
  }

  // Load blocked terms from JSON file
  async loadBlockedTerms() {
    try {
      const response = await fetch(chrome.runtime.getURL('blocked_terms.json'));
      const data = await response.json();
      // Decode base64 encoded terms
      this.blockedTerms = data.blocked_terms.map(encoded => {
        try {
          return atob(encoded);
        } catch (e) {
          console.warn('Failed to decode term:', encoded);
          return '';
        }
      }).filter(term => term.length > 0);
    } catch (error) {
      console.error('Failed to load blocked terms:', error);
      this.blockedTerms = [];
    }
  }

  // Check if the filter is enabled
  async isEnabled() {
    const result = await chrome.storage.sync.get(['filterEnabled']);
    return result.filterEnabled !== false; // Default to true
  }

  // Detect Unicode attacks (invisible characters, RTL override, etc.)
  detectUnicodeAttack(text) {
    // Check for invisible/zero-width characters
    const invisibleChars = /[\u200B-\u200F\uFEFF\u202A-\u202E]/;
    if (invisibleChars.test(text)) {
      return true;
    }

    // Check for excessive use of combining characters
    const combiningChars = /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g;
    const matches = text.match(combiningChars);
    if (matches && matches.length > 10) {
      return true;
    }

    // Check for RTL override attacks
    const rtlOverride = /[\u202E\u202D]/;
    if (rtlOverride.test(text)) {
      return true;
    }

    // Check for homoglyph attacks (characters that look similar to Latin)
    const suspiciousChars = /[\u0430-\u044F\u0410-\u042F].*[a-zA-Z]|[a-zA-Z].*[\u0430-\u044F\u0410-\u042F]/;
    if (suspiciousChars.test(text)) {
      return true;
    }

    return false;
  }

  // Check if message contains blocked terms
  containsBlockedTerm(text) {
    const lowerText = text.toLowerCase();
    return this.blockedTerms.some(term => {
      const lowerTerm = term.toLowerCase();
      return lowerText.includes(lowerTerm);
    });
  }

  // Main filter function
  shouldFilterMessage(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }

    // Check for Unicode attacks
    if (this.detectUnicodeAttack(text)) {
      return true;
    }

    // Check for blocked terms
    if (this.containsBlockedTerm(text)) {
      return true;
    }

    return false;
  }
}

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MessageFilter;
}
