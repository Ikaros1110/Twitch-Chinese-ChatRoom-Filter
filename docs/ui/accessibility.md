# Accessibility

## Required Behaviors

- do not rely on color alone to distinguish warning from violation,
- keep tooltip or status content keyboard accessible,
- expose lock state changes to screen readers where practical,
- keep countdown text stable and readable while it updates.

## Recommended Tactics

- pair color with text or icon labels,
- use an `aria-live` region carefully for lock and unlock status,
- avoid overly noisy countdown announcements,
- preserve sufficient contrast in warning and violation states.
