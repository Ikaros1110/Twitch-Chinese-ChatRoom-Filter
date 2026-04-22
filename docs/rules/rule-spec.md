# Rule Specification

## Rule Type

```ts
export type Severity = 'warning' | 'violation';

export type ChatRule = {
  id: string;
  name: string;
  severity: Severity;
  priority: number;
  description?: string;
  test: (input: string) => boolean;
};
```

## Evaluation Result

```ts
export type EvaluationResult =
  | { status: 'safe' }
  | {
      status: 'warning' | 'violation';
      ruleId: string;
      ruleName: string;
      lockDurationMs: number;
    };
```

## Rule Requirements

Each rule should:

- have a stable ID,
- expose a user-readable name,
- declare severity explicitly,
- define deterministic priority,
- be independently testable,
- avoid hidden DOM or runtime dependencies.

## Recommended Files

- `violation-rules.ts`
- `warning-rules.ts`
- `evaluator.ts`
- `rule-registry.ts`
