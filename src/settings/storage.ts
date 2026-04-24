import { DEFAULT_GUARD_SETTINGS, SETTINGS_STORAGE_KEY } from './defaults';
import { coerceStoredGuardSettings, validateGuardSettings } from './schema';
import type { GuardSettings } from '../shared/types';

export type StorageAreaLike = {
  get: (keys?: string | string[] | object | null) => Promise<Record<string, unknown>>;
  set: (items: Record<string, unknown>) => Promise<void>;
};

function getChromeStorageArea(): StorageAreaLike {
  return chrome.storage.local;
}

export async function readGuardSettings(storageArea: StorageAreaLike = getChromeStorageArea()): Promise<GuardSettings> {
  const stored = await storageArea.get(SETTINGS_STORAGE_KEY);
  return coerceStoredGuardSettings(stored[SETTINGS_STORAGE_KEY]);
}

export async function saveGuardSettings(
  settings: GuardSettings,
  storageArea: StorageAreaLike = getChromeStorageArea(),
): Promise<GuardSettings> {
  const validated = validateGuardSettings(settings);

  if (!validated.ok) {
    throw new Error(validated.errors.join(' '));
  }

  await storageArea.set({ [SETTINGS_STORAGE_KEY]: validated.value });
  return validated.value;
}

export async function ensureGuardSettings(
  storageArea: StorageAreaLike = getChromeStorageArea(),
): Promise<GuardSettings> {
  const existing = await storageArea.get(SETTINGS_STORAGE_KEY);

  if (existing[SETTINGS_STORAGE_KEY] == null) {
    await storageArea.set({ [SETTINGS_STORAGE_KEY]: DEFAULT_GUARD_SETTINGS });
    return DEFAULT_GUARD_SETTINGS;
  }

  const normalized = coerceStoredGuardSettings(existing[SETTINGS_STORAGE_KEY]);
  await storageArea.set({ [SETTINGS_STORAGE_KEY]: normalized });
  return normalized;
}
