# Visual States

## Warning State

- yellow-adjacent styling for the input or container,
- text or icon that indicates a warning state,
- clear copy such as `Hold Enter for 3.0s to send`.

## Violation State

- red-adjacent styling for the input or container,
- text or icon that indicates a higher-severity state,
- clear copy such as `Hold Enter for 7.0s to send`.

## Indicator Content

The info indicator should display:

- rule name,
- severity,
- required hold duration.

Example:

```txt
Rule: Repeated Punctuation
Severity: Warning
Action: Hold Enter for 3.0s to send
```
