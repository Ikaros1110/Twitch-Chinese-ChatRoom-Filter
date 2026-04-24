export type HoldSnapshot = {
  requiredDurationMs: number;
  startedAt: number | null;
  progressMs: number;
  remainingMs: number;
  isHolding: boolean;
  isComplete: boolean;
};

function createIdleSnapshot(requiredDurationMs = 0): HoldSnapshot {
  return {
    requiredDurationMs,
    startedAt: null,
    progressMs: 0,
    remainingMs: requiredDurationMs,
    isHolding: false,
    isComplete: false,
  };
}

export class HoldController {
  private snapshot: HoldSnapshot = createIdleSnapshot();

  start(now: number, requiredDurationMs: number): HoldSnapshot {
    this.snapshot = {
      requiredDurationMs,
      startedAt: now,
      progressMs: 0,
      remainingMs: requiredDurationMs,
      isHolding: true,
      isComplete: false,
    };

    return this.snapshot;
  }

  tick(now: number): HoldSnapshot {
    if (!this.snapshot.isHolding || this.snapshot.startedAt == null) {
      return this.snapshot;
    }

    const progressMs = Math.min(now - this.snapshot.startedAt, this.snapshot.requiredDurationMs);
    this.snapshot = {
      ...this.snapshot,
      progressMs,
      remainingMs: Math.max(this.snapshot.requiredDurationMs - progressMs, 0),
      isComplete: progressMs >= this.snapshot.requiredDurationMs,
      isHolding: progressMs >= this.snapshot.requiredDurationMs ? false : this.snapshot.isHolding,
    };

    return this.snapshot;
  }

  cancel(): HoldSnapshot {
    this.snapshot = createIdleSnapshot(this.snapshot.requiredDurationMs);
    return this.snapshot;
  }

  reset(): HoldSnapshot {
    this.snapshot = createIdleSnapshot();
    return this.snapshot;
  }

  complete(): HoldSnapshot {
    this.snapshot = {
      ...this.snapshot,
      progressMs: this.snapshot.requiredDurationMs,
      remainingMs: 0,
      isHolding: false,
      isComplete: true,
    };
    return this.snapshot;
  }

  getSnapshot(): HoldSnapshot {
    return this.snapshot;
  }
}
