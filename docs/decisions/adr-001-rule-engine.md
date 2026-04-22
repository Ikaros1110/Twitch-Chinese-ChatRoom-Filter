# ADR 001: Keep The Rule Engine Pure

## Status

Accepted

## Context

Moderation rules need strong unit coverage and must remain easy to evolve without coupling them to Twitch DOM behavior.

## Decision

Implement the evaluator and rule definitions as pure logic with no dependency on browser APIs or DOM references.

## Consequences

- unit testing stays fast and reliable,
- Twitch integration remains replaceable,
- rule behavior is easier to reason about and review.
