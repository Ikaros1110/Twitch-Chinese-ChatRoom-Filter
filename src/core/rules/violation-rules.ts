import type { ChatRule } from '../../shared/types';
import { BLOCKED_EXACT_PHRASES, BLOCKED_PATTERN_DEFINITIONS } from './seed-data';
import { hasMeaningfulText, normalizeCasefold } from './utils';

export const violationRules: ChatRule[] = [
  {
    id: 'blocked-exact-phrase',
    name: 'Blocked Exact Phrase',
    severity: 'violation',
    priority: 10,
    description: 'Blocks a starter list of exact harassment phrases.',
    test: (input) => {
      if (!hasMeaningfulText(input)) {
        return false;
      }

      const normalized = normalizeCasefold(input);
      return BLOCKED_EXACT_PHRASES.includes(normalized);
    },
  },
  {
    id: 'blocked-pattern-match',
    name: 'Blocked Pattern Match',
    severity: 'violation',
    priority: 20,
    description: 'Blocks starter regex patterns for explicit targeted harassment.',
    test: (input) => hasMeaningfulText(input) && BLOCKED_PATTERN_DEFINITIONS.some(({ pattern }) => pattern.test(input)),
  },
];
