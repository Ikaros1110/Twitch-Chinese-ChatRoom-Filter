import { render, screen } from '@testing-library/react';
import { GuardOverlay } from '../../src/ui/content/GuardOverlay';
import type { GuardViewModel } from '../../src/shared/types';

function buildViewModel(partial: Partial<GuardViewModel>): GuardViewModel {
  return {
    phase: 'warningLocked',
    inputText: 'HELLO!!!!',
    evaluation: {
      status: 'warning',
      ruleId: 'repeated-punctuation',
      ruleName: 'Repeated Punctuation',
      lockDurationMs: 3_000,
    },
    progressMs: 0,
    remainingMs: 3_000,
    ...partial,
  };
}

describe('GuardOverlay', () => {
  it('renders warning content', () => {
    render(<GuardOverlay viewModel={buildViewModel({})} liveMessage="Warning triggered." />);

    expect(screen.getByText('Warning Lock')).toBeInTheDocument();
    expect(screen.getByText('Rule: Repeated Punctuation')).toBeInTheDocument();
    expect(screen.getByText('Severity: Warning')).toBeInTheDocument();
  });

  it('renders violation content', () => {
    render(
      <GuardOverlay
        viewModel={buildViewModel({
          phase: 'violationLocked',
          evaluation: {
            status: 'violation',
            ruleId: 'blocked-pattern-match',
            ruleName: 'Blocked Pattern Match',
            lockDurationMs: 7_000,
          },
          remainingMs: 7_000,
        })}
        liveMessage="Violation triggered."
      />,
    );

    expect(screen.getByText('Violation Lock')).toBeInTheDocument();
    expect(screen.getByText('Severity: Violation')).toBeInTheDocument();
  });

  it('renders unlocked state copy', () => {
    render(
      <GuardOverlay
        viewModel={buildViewModel({
          phase: 'unlocked',
          progressMs: 3_000,
          remainingMs: 0,
          unlockedForInput: 'HELLO!!!!',
        })}
        liveMessage="Unlocked."
      />,
    );

    expect(screen.getByText('Unlocked for one send.')).toBeInTheDocument();
  });
});
