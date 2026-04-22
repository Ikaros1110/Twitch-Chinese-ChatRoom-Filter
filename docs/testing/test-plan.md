# Test Plan

## Test Pyramid

- 70% unit tests
- 20% integration tests
- 10% E2E tests

## Primary Targets

- evaluator correctness,
- individual rule behavior,
- hold timing and cancellation,
- state transitions,
- settings validation,
- Twitch integration and send blocking,
- end-to-end locked-send flows.

## Recommended Tools

- unit/integration: project test runner with DOM simulation,
- E2E: Playwright,
- browser-specific smoke checks for Twitch selector validation.
