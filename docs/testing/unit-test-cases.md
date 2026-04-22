# Unit Test Cases

## Evaluator

- violation rules are evaluated before warning rules,
- violation match stops evaluation immediately,
- safe input returns `{ status: 'safe' }`,
- returned rule metadata matches the triggered rule,
- deterministic priority resolves same-severity ties.

## Rules

- each regex rule includes positive and negative examples,
- Unicode and punctuation handling is explicit,
- false-positive candidates are covered where risk is known.

## Hold Logic

- hold completes only after continuous duration,
- releasing Enter cancels progress,
- text changes cancel progress,
- severity change cancels progress,
- stale controller references cancel progress.

## Settings

- invalid values are rejected,
- defaults load correctly,
- saved durations are converted to milliseconds accurately.
