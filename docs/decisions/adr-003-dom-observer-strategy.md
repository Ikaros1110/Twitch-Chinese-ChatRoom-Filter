# ADR 003: Recover From Twitch Rerenders With Observers

## Status

Accepted

## Context

Twitch chat UI can rerender, replace nodes, or temporarily invalidate DOM references during normal use.

## Decision

Centralize selectors and use an idempotent controller plus `MutationObserver` to detect reattachment and rebuild bindings safely.

## Consequences

- the content script becomes more resilient to Twitch DOM churn,
- stale references can be invalidated cleanly,
- hold progress must reset when reattachment occurs.
