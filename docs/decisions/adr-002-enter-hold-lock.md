# ADR 002: Use Continuous Enter Hold For Risky Messages

## Status

Accepted

## Context

The product goal is not to permanently block risky messages. It is to force deliberate intent before sending them.

## Decision

For `Warning` and `Violation` states, require the user to hold Enter continuously for a configured duration. Releasing Enter or changing the input resets progress.

## Consequences

- accidental sends are reduced,
- user intent is made explicit,
- timer and interruption logic become first-class implementation concerns.
