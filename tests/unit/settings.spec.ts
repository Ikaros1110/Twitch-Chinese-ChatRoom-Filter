import { DEFAULT_GUARD_SETTINGS } from '../../src/settings/defaults';
import {
  coerceStoredGuardSettings,
  formatDurationSeconds,
  parseDurationSecondsInput,
  validateGuardSettings,
} from '../../src/settings/schema';

describe('settings schema', () => {
  it('formats milliseconds as decimal seconds', () => {
    expect(formatDurationSeconds(3_000)).toBe('3.0');
  });

  it('parses decimal seconds into milliseconds', () => {
    expect(parseDurationSecondsInput('2.7', 'warning')).toEqual({ ok: true, value: 2_700 });
  });

  it('rejects invalid values', () => {
    expect(validateGuardSettings({ warningDurationMs: 0, violationDurationMs: -1 }).ok).toBe(false);
  });

  it('coerces invalid stored data to defaults', () => {
    expect(coerceStoredGuardSettings({ warningDurationMs: 0 })).toEqual(DEFAULT_GUARD_SETTINGS);
  });
});
