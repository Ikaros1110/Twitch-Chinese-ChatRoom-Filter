import { warningRules } from '../../src/core/rules/warning-rules';
import { violationRules } from '../../src/core/rules/violation-rules';

describe('warning rules', () => {
  it('detects repeated punctuation', () => {
    const rule = warningRules.find((item) => item.id === 'repeated-punctuation');
    expect(rule?.test('What????')).toBe(true);
    expect(rule?.test('What?')).toBe(false);
  });

  it('detects repeated character spam', () => {
    const rule = warningRules.find((item) => item.id === 'repeated-character-spam');
    expect(rule?.test('loooooool')).toBe(true);
    expect(rule?.test('look')).toBe(false);
  });

  it('detects repeated identical words', () => {
    const rule = warningRules.find((item) => item.id === 'repeated-identical-words');
    expect(rule?.test('spam spam spam spam')).toBe(true);
    expect(rule?.test('spam ham spam ham')).toBe(false);
  });

  it('detects excessive caps ratio', () => {
    const rule = warningRules.find((item) => item.id === 'excessive-caps-ratio');
    expect(rule?.test('THIS IS BAD')).toBe(true);
    expect(rule?.test('This Is Fine')).toBe(false);
  });
});

describe('violation rules', () => {
  it('matches exact blocked phrases', () => {
    const rule = violationRules.find((item) => item.id === 'blocked-exact-phrase');
    expect(rule?.test('kill yourself')).toBe(true);
    expect(rule?.test('please be kind')).toBe(false);
  });

  it('matches blocked regex patterns', () => {
    const rule = violationRules.find((item) => item.id === 'blocked-pattern-match');
    expect(rule?.test('k y s')).toBe(true);
    expect(rule?.test('go win now')).toBe(false);
  });
});
