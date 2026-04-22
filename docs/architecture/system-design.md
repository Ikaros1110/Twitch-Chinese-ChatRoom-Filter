# System Design

## High-Level Modules

### Rule Engine

- pure logic,
- input string in, evaluation result out,
- no DOM or browser API dependencies.

### Lock Controller

- owns lock lifecycle,
- tracks hold start, progress, cancel, and completion,
- resets on interruption.

### Twitch Integration

- finds input, button, and submit elements,
- binds input, key, and submit listeners,
- recovers from Twitch rerenders.

### Settings Layer

- loads defaults,
- validates user configuration,
- exposes effective warning and violation durations.

### UI Layer

- renders severity state,
- shows triggered rule name,
- updates live countdown and progress text.

## Design Constraint

Moderation logic must remain independent from Twitch DOM integration so it can be unit tested without browser APIs.
