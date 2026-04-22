# Regex Guidelines

Regex-based rules should be treated as production logic, not quick heuristics.

## Requirements

- document the intent of each pattern,
- include positive and negative test cases,
- avoid overly broad character classes,
- handle Unicode and emoji intentionally,
- consider full-width punctuation and repeated punctuation explicitly.

## Risk Controls

- prefer anchored or well-scoped patterns where possible,
- avoid hidden backtracking costs,
- note false-positive candidates in tests,
- keep pattern behavior readable enough for future maintenance.
