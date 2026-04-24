import type { EvaluationResult, GuardViewModel } from '../../shared/types';
import type { HoldSnapshot } from '../lock/hold-controller';

export type GuardAction =
  | { type: 'EVALUATED'; inputText: string; evaluation: EvaluationResult }
  | { type: 'HOLD_PROGRESS'; hold: HoldSnapshot }
  | { type: 'HOLD_COMPLETE'; hold: HoldSnapshot }
  | { type: 'RESET_LOCK' }
  | { type: 'MESSAGE_SENT'; inputText: string; evaluation: EvaluationResult };

export function createSafeGuardViewModel(inputText = ''): GuardViewModel {
  return {
    phase: 'safe',
    inputText,
    evaluation: { status: 'safe' },
    progressMs: 0,
    remainingMs: 0,
  };
}

function toLockedPhase(evaluation: EvaluationResult): GuardViewModel['phase'] {
  if (evaluation.status === 'warning') {
    return 'warningLocked';
  }

  if (evaluation.status === 'violation') {
    return 'violationLocked';
  }

  return 'safe';
}

export function reduceGuardState(state: GuardViewModel, action: GuardAction): GuardViewModel {
  switch (action.type) {
    case 'EVALUATED':
      if (action.evaluation.status === 'safe') {
        return createSafeGuardViewModel(action.inputText);
      }

      return {
        phase: toLockedPhase(action.evaluation),
        inputText: action.inputText,
        evaluation: action.evaluation,
        progressMs: 0,
        remainingMs: action.evaluation.lockDurationMs,
      };

    case 'HOLD_PROGRESS':
      if (state.evaluation.status === 'safe') {
        return state;
      }

      return {
        ...state,
        phase: 'unlocking',
        progressMs: action.hold.progressMs,
        remainingMs: action.hold.remainingMs,
      };

    case 'HOLD_COMPLETE':
      if (state.evaluation.status === 'safe') {
        return state;
      }

      return {
        ...state,
        phase: 'unlocked',
        progressMs: action.hold.progressMs,
        remainingMs: 0,
        unlockedForInput: state.inputText,
      };

    case 'RESET_LOCK':
      if (state.evaluation.status === 'safe') {
        return state;
      }

      return {
        ...state,
        phase: toLockedPhase(state.evaluation),
        progressMs: 0,
        remainingMs: state.evaluation.lockDurationMs,
        unlockedForInput: undefined,
      };

    case 'MESSAGE_SENT':
      if (action.evaluation.status === 'safe') {
        return createSafeGuardViewModel(action.inputText);
      }

      return {
        phase: toLockedPhase(action.evaluation),
        inputText: action.inputText,
        evaluation: action.evaluation,
        progressMs: 0,
        remainingMs: action.evaluation.lockDurationMs,
      };

    default:
      return state;
  }
}
