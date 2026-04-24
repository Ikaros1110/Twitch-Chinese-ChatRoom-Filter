import { DEFAULT_GUARD_SETTINGS } from './defaults';
import type { GuardSettings } from '../shared/types';

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

const DURATION_STEP_MS = 100;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeDurationMs(value: number): number {
  return Math.round(value / DURATION_STEP_MS) * DURATION_STEP_MS;
}

export function validateGuardSettings(candidate: Partial<GuardSettings>): ValidationResult<GuardSettings> {
  const errors: string[] = [];

  if (!isFiniteNumber(candidate.warningDurationMs) || candidate.warningDurationMs <= 0) {
    errors.push('Warning duration must be a positive number.');
  }

  if (!isFiniteNumber(candidate.violationDurationMs) || candidate.violationDurationMs <= 0) {
    errors.push('Violation duration must be a positive number.');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const warningDurationMs = candidate.warningDurationMs as number;
  const violationDurationMs = candidate.violationDurationMs as number;

  const normalized = {
    warningDurationMs: normalizeDurationMs(warningDurationMs),
    violationDurationMs: normalizeDurationMs(violationDurationMs),
  };

  if (normalized.violationDurationMs < normalized.warningDurationMs) {
    errors.push('Violation duration should be greater than or equal to warning duration.');
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: normalized };
}

export function parseDurationSecondsInput(value: string, label: 'warning' | 'violation'): ValidationResult<number> {
  const numeric = Number.parseFloat(value);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return { ok: false, errors: [`${label[0].toUpperCase() + label.slice(1)} duration must be greater than 0.`] };
  }

  return { ok: true, value: Math.round(numeric * 1_000) };
}

export function formatDurationSeconds(ms: number): string {
  return (ms / 1_000).toFixed(1);
}

export function coerceStoredGuardSettings(value: unknown): GuardSettings {
  if (!value || typeof value !== 'object') {
    return DEFAULT_GUARD_SETTINGS;
  }

  const candidate = value as Partial<GuardSettings>;
  const validated = validateGuardSettings(candidate);
  return validated.ok ? validated.value : DEFAULT_GUARD_SETTINGS;
}
