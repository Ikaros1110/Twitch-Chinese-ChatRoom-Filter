import { warningRules } from './warning-rules';
import { violationRules } from './violation-rules';
import type { ChatRule, RuleRegistry } from '../../shared/types';

function sortRulesByPriority(rules: ChatRule[]): ChatRule[] {
  return [...rules].sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

export const defaultRuleRegistry: RuleRegistry = {
  warningRules: sortRulesByPriority(warningRules),
  violationRules: sortRulesByPriority(violationRules),
};
