# State Machine

## Recommended States

- `Idle`
- `Evaluating`
- `Safe`
- `WarningLocked`
- `ViolationLocked`
- `UnlockingByHold`
- `Unlocked`

## Events

- `INPUT_CHANGED`
- `EVALUATION_SAFE`
- `EVALUATION_WARNING`
- `EVALUATION_VIOLATION`
- `HOLD_ENTER_START`
- `HOLD_ENTER_PROGRESS`
- `HOLD_ENTER_CANCEL`
- `HOLD_ENTER_COMPLETE`
- `MESSAGE_SENT`
- `DOM_REATTACHED`

## Transition Rules

- Any input change triggers reevaluation.
- `Warning` transitions to `WarningLocked`.
- `Violation` transitions to `ViolationLocked`.
- `Safe` clears UI and hold state immediately.
- Hold progress exists only while the active message is locked.
- Releasing Enter cancels progress and returns to the current locked state.
- DOM invalidation or controller reattachment resets progress.
