import { defaultRuleRegistry } from './rules/rule-registry';
import { hasMeaningfulText } from './rules/utils';
import type { ChatRule, EvaluationResult, GuardSettings, RuleRegistry, Severity } from '../shared/types';

function toEvaluationResult(
  rule: ChatRule | undefined,
  severity: Severity,
  settings: GuardSettings,
): EvaluationResult | null {
  if (!rule) {
    return null;
  }

  return {
    status: severity,
    ruleId: rule.id,
    ruleName: rule.name,
    lockDurationMs: severity === 'warning' ? settings.warningDurationMs : settings.violationDurationMs,
  };
}

function firstMatchingRule(input: string, rules: ChatRule[]): ChatRule | undefined {
  return [...rules]
    .sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id))
    .find((rule) => rule.test(input));
}

export function evaluateMessage(
  input: string,
  settings: GuardSettings,
  rules: RuleRegistry = defaultRuleRegistry,
): EvaluationResult {
  if (!hasMeaningfulText(input)) {
    return { status: 'safe' };
  }

  const violation = toEvaluationResult(firstMatchingRule(input, rules.violationRules), 'violation', settings);
  if (violation) {
    return violation;
  }

  const warning = toEvaluationResult(firstMatchingRule(input, rules.warningRules), 'warning', settings);
  return warning ?? { status: 'safe' };
}
