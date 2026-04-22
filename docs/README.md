# Documentation Index

This directory turns the product and technical specification into implementation-facing documentation.

## Sections

- [`product/`](product/overview.md): goals, scope, user flow, and edge cases
- [`architecture/`](architecture/system-design.md): modules, state model, DOM lifecycle, settings storage
- [`rules/`](rules/rule-spec.md): rule schema, severity ordering, candidate built-in rules, regex guidance
- [`ui/`](ui/interaction-spec.md): interaction model, visual states, accessibility expectations
- [`testing/`](testing/test-plan.md): test strategy and scenario coverage
- [`decisions/`](decisions/adr-001-rule-engine.md): architecture decisions recorded as ADRs

## Intended Use

These docs are written to support implementation in the following order:

1. types and interfaces,
2. pure rule evaluator,
3. hold/lock logic,
4. Twitch DOM bindings,
5. overlay UI,
6. settings persistence,
7. unit and integration tests,
8. Playwright scaffolding.
