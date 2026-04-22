# Content Script Lifecycle

## Responsibilities

The content script owns Twitch-specific wiring:

- locating chat DOM elements,
- attaching event listeners,
- applying and removing UI state,
- reconnecting when Twitch rerenders.

## DOM Stability Strategy

- keep selectors in one module,
- make controller setup idempotent,
- use `MutationObserver` to detect chat reattachment,
- discard stale references immediately when the DOM changes.

## Reattachment Rules

When the chat form or input is replaced:

1. detach listeners from stale nodes,
2. reset hold progress,
3. reacquire active DOM nodes,
4. rebind listeners,
5. rerun evaluation for the current input value if available.
