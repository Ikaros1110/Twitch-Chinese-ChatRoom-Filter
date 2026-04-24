export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/gu, ' ').trim();
}

export function hasMeaningfulText(value: string): boolean {
  return normalizeWhitespace(value).length > 0;
}

export function normalizeCasefold(value: string): string {
  return normalizeWhitespace(value).toLocaleLowerCase();
}

export function tokenizeWords(value: string): string[] {
  return normalizeWhitespace(value)
    .split(/[^\p{L}\p{N}_]+/u)
    .map((token) => token.trim())
    .filter(Boolean);
}
