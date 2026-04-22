# Built-In Rule Candidates

This project does not define final production rules yet, but the MVP should assume rules are organized into warning and violation registries.

## Example Warning Rules

- repeated punctuation
- excessive caps ratio
- repeated character spam
- repeated identical words

## Example Violation Rules

- banned phrase exact match
- banned pattern match
- severe spam pattern
- clearly disallowed slur or harassment pattern

## Guidance

- start with a small, auditable built-in rule set,
- prefer explicitness over broad heuristics,
- assign priorities so ties resolve predictably,
- document false-positive risks next to each rule.
