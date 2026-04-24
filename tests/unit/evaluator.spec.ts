import { evaluateMessage } from '../../src/core/evaluator';
import type { GuardSettings, RuleRegistry } from '../../src/shared/types';

const settings: GuardSettings = {
  warningDurationMs: 3_000,
  violationDurationMs: 7_000,
};

describe('evaluateMessage', () => {
  it('returns safe for whitespace-only input', () => {
    expect(evaluateMessage('   ', settings)).toEqual({ status: 'safe' });
  });

  it('evaluates violation rules before warning rules', () => {
    const rules: RuleRegistry = {
      warningRules: [
        { id: 'warning', name: 'Warning', severity: 'warning', priority: 1, test: () => true },
      ],
      violationRules: [
        { id: 'violation', name: 'Violation', severity: 'violation', priority: 1, test: () => true },
      ],
    };

    expect(evaluateMessage('HELLO!!!!', settings, rules)).toEqual({
      status: 'violation',
      ruleId: 'violation',
      ruleName: 'Violation',
      lockDurationMs: 7_000,
    });
  });

  it('uses deterministic priority ordering for same-severity matches', () => {
    const rules: RuleRegistry = {
      warningRules: [
        { id: 'late', name: 'Late', severity: 'warning', priority: 20, test: () => true },
        { id: 'early', name: 'Early', severity: 'warning', priority: 10, test: () => true },
      ],
      violationRules: [],
    };

    expect(evaluateMessage('warning', settings, rules)).toEqual({
      status: 'warning',
      ruleId: 'early',
      ruleName: 'Early',
      lockDurationMs: 3_000,
    });
  });
});
