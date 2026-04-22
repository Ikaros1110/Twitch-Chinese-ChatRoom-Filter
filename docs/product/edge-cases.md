# Edge Cases

The implementation must define stable behavior for:

- empty input,
- whitespace-only input,
- pasted content,
- rapid text edits,
- repeated Enter taps without continuous hold,
- Twitch rerendering the chat DOM during a hold,
- send button temporarily missing,
- multiple matching rules of the same severity,
- emoji, Unicode, and full-width punctuation,
- aggressive regexes that create false positives.

## Expected Principles

- Empty or whitespace-only input should not produce noisy warnings.
- Hold progress should reset on any interruption or invalidated DOM reference.
- Multiple same-severity matches must resolve through deterministic priority.
- Unicode handling must be intentional rather than incidental.
