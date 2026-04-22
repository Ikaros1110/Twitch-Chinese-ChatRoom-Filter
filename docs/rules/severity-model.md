# Severity Model

## Ordering

Severity priority is fixed:

- `Violation`
- `Warning`
- `Safe`

## Evaluation Algorithm

1. Evaluate all violation rules first.
2. If any violation rule matches, return that result immediately.
3. Only if no violation rule matches, evaluate warning rules.
4. If a warning rule matches, return the highest-priority warning result.
5. If nothing matches, return `Safe`.

## Same-Severity Tie Breaking

If multiple rules of the same severity match:

- sort deterministically by `priority`,
- display the highest-priority matching rule,
- keep this ordering stable across releases unless intentionally changed.
