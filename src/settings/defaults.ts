import type { GuardSettings } from '../shared/types';

export const DEFAULT_GUARD_SETTINGS: GuardSettings = {
  warningDurationMs: 3_000,
  violationDurationMs: 7_000,
};

export const SETTINGS_STORAGE_KEY = 'guardSettings';
