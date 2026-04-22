# Product Scope

## In Scope

- read the current Twitch chat input,
- evaluate text against configured rules,
- support multiple rule types, including regex-based rules,
- show warning and violation UI states,
- lock send interactions for risky input,
- require continuous Enter hold to unlock sending,
- show triggered rule name and required hold duration,
- persist configurable warning and violation durations.

## Out of Scope for MVP

- rule editing UI,
- remote rule sync,
- machine-learning moderation,
- Twitch account integration,
- support for non-Twitch platforms,
- full localization management.

## Success Criteria

The MVP succeeds when the moderation logic is understandable, deterministic, and difficult to bypass accidentally while remaining lightweight enough to run continuously during chat input.
