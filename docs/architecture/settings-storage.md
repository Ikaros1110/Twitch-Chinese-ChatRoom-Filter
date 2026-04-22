# Settings Storage

## Editable Settings

- warning lock duration
- violation lock duration

Defaults:

- warning: `3s`
- violation: `7s`

## Persistence

Recommended storage:

`chrome.storage.local`.

## Validation Rules

- warning duration must be greater than `0`,
- violation duration must be greater than `0`,
- violation duration should usually be greater than or equal to warning duration,
- decimals may be supported if the UI and timer logic remain precise and readable.

## UX Requirements

- reject invalid numeric input,
- expose default values clearly,
- provide a reset-to-defaults action,
- ensure saved settings are applied to subsequent evaluations and locks.
