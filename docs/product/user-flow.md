# User Flow

## Safe Message

1. User types a message.
2. Evaluator returns `Safe`.
3. No warning UI is shown.
4. Input and send controls remain normal.

## Warning Message

1. User types a message that matches a warning rule.
2. Input styling changes to warning state.
3. Indicator displays the matching rule name and required action.
4. Send is blocked until Enter is held continuously for the configured warning duration.
5. Releasing Enter before completion resets progress.

## Violation Message

1. User types a message that matches a violation rule.
2. Input styling changes to violation state.
3. Indicator displays the matching rule name and required action.
4. Send is blocked until Enter is held continuously for the configured violation duration.
5. Releasing Enter before completion resets progress.

## During Hold

- Remaining time updates continuously.
- Any text change cancels the hold and re-runs evaluation.
- If severity changes, the UI and required hold duration update immediately.
- If the message becomes `Safe`, the lock is removed immediately.
