# Twitch Chat Guard Extension

Chromium-based browser extension for Twitch chat that evaluates the message a user is typing before it is sent. When the text appears risky, the extension warns the user, locks sending, and requires a continuous Enter-key hold before the message can be submitted.

## Goal

The MVP is designed to:

- reduce accidental rule-breaking chat messages,
- provide immediate and understandable feedback,
- require deliberate user intent before sending risky messages.

## Core Behavior

Each draft message is evaluated into one of three states:

- `Safe`
- `Warning`
- `Violation`

Severity priority is strict:

- `Violation` rules are always evaluated before `Warning` rules.
- If a `Violation` rule matches, evaluation stops immediately.
- If no `Violation` matches, `Warning` rules are evaluated in deterministic priority order.
- If no rules match, the message is `Safe`.

## Locking Model

When the current message is `Warning` or `Violation`:

- sending is blocked across Enter, send button, and submit flows,
- the triggered rule name is shown in the UI,
- the user must hold Enter continuously to unlock sending,
- releasing Enter resets hold progress,
- changing the message resets progress and triggers re-evaluation.

Default durations:

- `Warning`: `3s`
- `Violation`: `7s`

Example live status:

```txt
Hold Enter to send (2.4s)
```

## UX Summary

- `Safe`: normal input, no warning UI, no lock.
- `Warning`: yellow styling, warning indicator, warning hold-to-send duration.
- `Violation`: red styling, violation indicator, longer hold-to-send duration.

Accessibility requirements include:

- do not rely on color alone,
- make status content keyboard accessible,
- expose state changes to assistive technology where practical,
- keep countdown text readable and stable.

## Architecture

The implementation is intended to stay split into five layers:

1. Rule Engine: pure input evaluation with no DOM dependencies.
2. Lock Controller: Enter-hold timing and unlock lifecycle.
3. Twitch Integration: DOM lookup, event binding, rerender recovery.
4. Settings Layer: persistence, defaults, validation.
5. UI Layer: indicators, styling, countdown, progress state.

Recommended source layout:

```txt
/src
  /background
  /content
    /twitch
  /core
    /rules
    /lock
    /state
  /ui
  /settings
  /shared
/tests
  /unit
  /integration
  /e2e
```

## Documentation

Detailed project docs live under [`docs/`](docs/README.md):

- Product: [`docs/product/overview.md`](docs/product/overview.md), [`scope.md`](docs/product/scope.md), [`user-flow.md`](docs/product/user-flow.md), [`edge-cases.md`](docs/product/edge-cases.md)
- Architecture: [`docs/architecture/system-design.md`](docs/architecture/system-design.md), [`state-machine.md`](docs/architecture/state-machine.md), [`content-script-lifecycle.md`](docs/architecture/content-script-lifecycle.md), [`settings-storage.md`](docs/architecture/settings-storage.md)
- Rules: [`docs/rules/rule-spec.md`](docs/rules/rule-spec.md), [`built-in-rules.md`](docs/rules/built-in-rules.md), [`severity-model.md`](docs/rules/severity-model.md), [`regex-guidelines.md`](docs/rules/regex-guidelines.md)
- UI: [`docs/ui/interaction-spec.md`](docs/ui/interaction-spec.md), [`visual-states.md`](docs/ui/visual-states.md), [`accessibility.md`](docs/ui/accessibility.md)
- Testing: [`docs/testing/test-plan.md`](docs/testing/test-plan.md), [`unit-test-cases.md`](docs/testing/unit-test-cases.md), [`integration-test-cases.md`](docs/testing/integration-test-cases.md), [`e2e-scenarios.md`](docs/testing/e2e-scenarios.md)
- ADRs: [`docs/decisions/adr-001-rule-engine.md`](docs/decisions/adr-001-rule-engine.md), [`adr-002-enter-hold-lock.md`](docs/decisions/adr-002-enter-hold-lock.md), [`adr-003-dom-observer-strategy.md`](docs/decisions/adr-003-dom-observer-strategy.md)

## MVP Acceptance Criteria

The MVP is complete when:

- input text is continuously evaluated,
- violation rules are checked before warning rules,
- the highest-priority matching rule is shown,
- warning and violation durations are configurable,
- unlocking requires continuous Enter hold,
- releasing Enter resets progress,
- editing text re-evaluates immediately,
- safe input restores normal state immediately,
- UI shows severity styling, rule name, and remaining hold time,
- automated tests cover the core logic and main user flows.

## Delivery Phases

1. Define types, rules, evaluator, and unit tests.
2. Add Twitch content integration, UI state rendering, and send blocking.
3. Implement Enter-hold unlock flow and interruption handling.
4. Add settings persistence and E2E coverage.
