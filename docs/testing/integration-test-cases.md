# Integration Test Cases

## Content Script + DOM

- safe input clears UI,
- warning input applies warning styling,
- violation input applies violation styling,
- triggered rule name is rendered,
- remaining-time display appears and updates during hold.

## Blocking

- Enter send path is blocked while locked,
- send button interaction is blocked while locked,
- submit flow is blocked while locked,
- safe input sends normally.

## Reset Behavior

- input changes trigger immediate reevaluation,
- releasing Enter resets progress,
- DOM reattachment resets progress and restores listeners.
