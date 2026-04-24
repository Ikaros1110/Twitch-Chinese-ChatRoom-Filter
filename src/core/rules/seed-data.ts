export const BLOCKED_EXACT_PHRASES = ['kill yourself', 'go die'];

export const BLOCKED_PATTERN_DEFINITIONS = [
  {
    id: 'targeted-harassment-kys-variant',
    pattern: /\bk\s*\.?\s*y\s*\.?\s*s\b/iu,
  },
  {
    id: 'targeted-harassment-die-now',
    pattern: /\bgo\s+die\s+now\b/iu,
  },
];
