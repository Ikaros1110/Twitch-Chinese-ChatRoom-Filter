import { HoldController } from '../../src/core/lock/hold-controller';

describe('HoldController', () => {
  it('completes only after the full continuous duration', () => {
    const controller = new HoldController();
    controller.start(0, 3_000);

    expect(controller.tick(2_000)).toMatchObject({
      progressMs: 2_000,
      remainingMs: 1_000,
      isComplete: false,
    });

    expect(controller.tick(3_000)).toMatchObject({
      progressMs: 3_000,
      remainingMs: 0,
      isComplete: true,
    });
  });

  it('cancels and resets progress', () => {
    const controller = new HoldController();
    controller.start(100, 3_000);
    controller.tick(1_400);
    expect(controller.cancel()).toMatchObject({
      progressMs: 0,
      isHolding: false,
      isComplete: false,
    });
  });

  it('fully resets state', () => {
    const controller = new HoldController();
    controller.start(100, 3_000);
    controller.tick(1_400);
    expect(controller.reset()).toMatchObject({
      requiredDurationMs: 0,
      progressMs: 0,
      remainingMs: 0,
    });
  });
});
