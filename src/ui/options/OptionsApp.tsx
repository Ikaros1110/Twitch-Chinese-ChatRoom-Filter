import { type CSSProperties, type FormEvent, useEffect, useState } from 'react';
import { DEFAULT_GUARD_SETTINGS } from '../../settings/defaults';
import { formatDurationSeconds, parseDurationSecondsInput, validateGuardSettings } from '../../settings/schema';
import { readGuardSettings, saveGuardSettings, type StorageAreaLike } from '../../settings/storage';

type OptionsAppProps = {
  storageArea?: StorageAreaLike;
};

const panelStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '32px 20px',
  background: 'radial-gradient(circle at top, #fff4d6 0%, #f5efe3 48%, #ece6d9 100%)',
  color: '#1e1b16',
  fontFamily: '"IBM Plex Sans", "Avenir Next", BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const cardStyle: CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '22px',
  padding: '28px',
  boxShadow: '0 18px 48px rgba(34, 28, 18, 0.14)',
  border: '1px solid rgba(109, 88, 31, 0.18)',
};

export function OptionsApp({ storageArea }: OptionsAppProps) {
  const [warningSeconds, setWarningSeconds] = useState(formatDurationSeconds(DEFAULT_GUARD_SETTINGS.warningDurationMs));
  const [violationSeconds, setViolationSeconds] = useState(formatDurationSeconds(DEFAULT_GUARD_SETTINGS.violationDurationMs));
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState('Loading settings...');

  useEffect(() => {
    let active = true;

    void readGuardSettings(storageArea)
      .then((settings) => {
        if (!active) {
          return;
        }

        setWarningSeconds(formatDurationSeconds(settings.warningDurationMs));
        setViolationSeconds(formatDurationSeconds(settings.violationDurationMs));
        setStatus('Settings loaded.');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setErrors(['Could not load settings. Defaults are shown.']);
        setStatus('Using default settings.');
      });

    return () => {
      active = false;
    };
  }, [storageArea]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const warningResult = parseDurationSecondsInput(warningSeconds, 'warning');
    const violationResult = parseDurationSecondsInput(violationSeconds, 'violation');

    const nextErrors = [
      ...(warningResult.ok ? [] : warningResult.errors),
      ...(violationResult.ok ? [] : violationResult.errors),
    ];

    if (!warningResult.ok || !violationResult.ok) {
      setErrors(nextErrors);
      setStatus('Fix validation errors before saving.');
      return;
    }

    const validated = validateGuardSettings({
      warningDurationMs: warningResult.value,
      violationDurationMs: violationResult.value,
    });

    if (!validated.ok) {
      setErrors(validated.errors);
      setStatus('Fix validation errors before saving.');
      return;
    }

    await saveGuardSettings(validated.value, storageArea);
    setErrors([]);
    setWarningSeconds(formatDurationSeconds(validated.value.warningDurationMs));
    setViolationSeconds(formatDurationSeconds(validated.value.violationDurationMs));
    setStatus('Settings saved.');
  }

  async function handleReset() {
    await saveGuardSettings(DEFAULT_GUARD_SETTINGS, storageArea);
    setWarningSeconds(formatDurationSeconds(DEFAULT_GUARD_SETTINGS.warningDurationMs));
    setViolationSeconds(formatDurationSeconds(DEFAULT_GUARD_SETTINGS.violationDurationMs));
    setErrors([]);
    setStatus('Defaults restored.');
  }

  return (
    <main style={panelStyle}>
      <section style={cardStyle}>
        <header style={{ marginBottom: '24px' }}>
          <p
            style={{
              margin: 0,
              color: '#8a5e00',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            Twitch Chat Guard
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: '32px', lineHeight: 1.1 }}>Lock Durations</h1>
          <p style={{ margin: '10px 0 0', color: '#51493c', maxWidth: '56ch' }}>
            Configure how long a user must hold Enter to send warning and violation messages.
          </p>
        </header>

        <form noValidate onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
          <label style={{ display: 'grid', gap: '8px', fontWeight: 600 }}>
            Warning hold duration (seconds)
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={warningSeconds}
              onChange={(event) => setWarningSeconds(event.target.value)}
              style={{
                font: 'inherit',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(68, 53, 18, 0.25)',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: '8px', fontWeight: 600 }}>
            Violation hold duration (seconds)
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={violationSeconds}
              onChange={(event) => setViolationSeconds(event.target.value)}
              style={{
                font: 'inherit',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(68, 53, 18, 0.25)',
              }}
            />
          </label>

          {errors.length > 0 ? (
            <div
              role="alert"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#fff0ea',
                color: '#822d13',
                border: '1px solid rgba(130, 45, 19, 0.2)',
              }}
            >
              {errors.map((error) => (
                <p key={error} style={{ margin: 0 }}>
                  {error}
                </p>
              ))}
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              style={{
                font: 'inherit',
                fontWeight: 700,
                padding: '12px 18px',
                borderRadius: '999px',
                border: 'none',
                background: '#1f1d18',
                color: '#fff8ee',
                cursor: 'pointer',
              }}
            >
              Save settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                font: 'inherit',
                fontWeight: 700,
                padding: '12px 18px',
                borderRadius: '999px',
                border: '1px solid rgba(31, 29, 24, 0.18)',
                background: 'transparent',
                color: '#1f1d18',
                cursor: 'pointer',
              }}
            >
              Reset to defaults
            </button>
          </div>
        </form>

        <p aria-live="polite" style={{ marginTop: '18px', color: '#51493c' }}>
          {status}
        </p>
      </section>
    </main>
  );
}
