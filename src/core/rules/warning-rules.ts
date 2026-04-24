import type { ChatRule } from '../../shared/types';
import { hasMeaningfulText, tokenizeWords } from './utils';

function repeatedWordSpam(input: string): boolean {
  const words = tokenizeWords(input);

  if (words.length < 4) {
    return false;
  }

  let runLength = 1;

  for (let index = 1; index < words.length; index += 1) {
    if (words[index].toLocaleLowerCase() === words[index - 1].toLocaleLowerCase()) {
      runLength += 1;
      if (runLength >= 4) {
        return true;
      }
    } else {
      runLength = 1;
    }
  }

  return false;
}

function excessiveCapsRatio(input: string): boolean {
  const letters = [...input].filter((character) => /[A-Za-z]/.test(character));

  if (letters.length < 6) {
    return false;
  }

  const uppercase = letters.filter((character) => character === character.toUpperCase()).length;
  return uppercase / letters.length >= 0.8;
}

export const warningRules: ChatRule[] = [
  {
    id: 'repeated-punctuation',
    name: 'Repeated Punctuation',
    severity: 'warning',
    priority: 10,
    description: 'Flags repeated punctuation bursts that often read as spam.',
    test: (input) => hasMeaningfulText(input) && /([!?！？。．,.])\1{3,}/u.test(input),
  },
  {
    id: 'repeated-character-spam',
    name: 'Repeated Character Spam',
    severity: 'warning',
    priority: 20,
    description: 'Flags long runs of the same visible letter or digit.',
    test: (input) => hasMeaningfulText(input) && /([\p{L}\p{N}])\1{5,}/u.test(input),
  },
  {
    id: 'repeated-identical-words',
    name: 'Repeated Identical Words',
    severity: 'warning',
    priority: 30,
    description: 'Flags repeated adjacent words that often indicate spam.',
    test: repeatedWordSpam,
  },
  {
    id: 'excessive-caps-ratio',
    name: 'Excessive Caps Ratio',
    severity: 'warning',
    priority: 40,
    description: 'Flags mostly-uppercase Latin text once it is long enough to judge.',
    test: excessiveCapsRatio,
  },
];
