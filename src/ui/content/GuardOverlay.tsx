import type { GuardViewModel } from '../../shared/types';

type GuardOverlayProps = {
  viewModel: GuardViewModel;
  liveMessage: string;
};

function formatSeconds(ms: number): string {
  return (ms / 1_000).toFixed(1);
}

export function GuardOverlay({ viewModel, liveMessage }: GuardOverlayProps) {
  if (viewModel.phase === 'safe' || viewModel.evaluation.status === 'safe') {
    return (
      <div aria-live="polite" style={{ position: 'absolute', inlineSize: 1, blockSize: 1, overflow: 'hidden' }}>
        {liveMessage}
      </div>
    );
  }

  const isViolation = viewModel.evaluation.status === 'violation';
  const label = isViolation ? 'Violation' : 'Warning';
  const totalMs = viewModel.evaluation.lockDurationMs;
  const progressPercent = totalMs === 0 ? 0 : Math.round((viewModel.progressMs / totalMs) * 100);
  const actionText =
    viewModel.phase === 'unlocked'
      ? 'Unlocked for one send.'
      : `Hold Enter for ${formatSeconds(viewModel.remainingMs)}s to send`;

  return (
    <section
      aria-label="Chat guard status"
      style={{
        fontFamily:
          '"IBM Plex Sans", "Avenir Next", BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#1f1d18',
        background: isViolation
          ? 'linear-gradient(135deg, #ffd5cc 0%, #fff0e8 100%)'
          : 'linear-gradient(135deg, #ffe8ad 0%, #fff7dd 100%)',
        border: `1px solid ${isViolation ? '#c94c2b' : '#c28a0a'}`,
        borderRadius: '14px',
        padding: '12px 14px',
        marginTop: '10px',
        boxShadow: '0 8px 20px rgba(33, 25, 17, 0.14)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <strong style={{ fontSize: '14px', letterSpacing: '0.02em' }}>{label} Lock</strong>
        <span
          aria-hidden="true"
          style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: '999px',
            background: isViolation ? '#9b2c16' : '#8a5e00',
            color: '#fff',
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ display: 'grid', gap: '4px' }}>
        <span style={{ fontSize: '13px' }}>Rule: {viewModel.evaluation.ruleName}</span>
        <span style={{ fontSize: '13px' }}>Severity: {label}</span>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>{actionText}</span>
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: '10px',
          height: '8px',
          borderRadius: '999px',
          background: 'rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.max(0, Math.min(progressPercent, 100))}%`,
            background: isViolation ? '#c94c2b' : '#c28a0a',
            transition: viewModel.phase === 'unlocking' ? 'none' : 'width 160ms ease',
          }}
        />
      </div>

      <div
        aria-live="polite"
        style={{
          position: 'absolute',
          inlineSize: 1,
          blockSize: 1,
          overflow: 'hidden',
          clipPath: 'inset(50%)',
        }}
      >
        {liveMessage}
      </div>
    </section>
  );
}
