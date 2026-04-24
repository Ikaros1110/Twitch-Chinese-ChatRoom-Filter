import type { GuardSettings } from '../../src/shared/types';

type StorageChangeListener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => void;

type MemoryStorageArea = {
  __data: Record<string, unknown>;
  get: (keys?: string | string[] | object | null) => Promise<Record<string, unknown>>;
  set: (items: Record<string, unknown>) => Promise<void>;
  remove: (keys: string | string[]) => Promise<void>;
  clear: () => Promise<void>;
  getBytesInUse: () => Promise<number>;
  setAccessLevel: () => Promise<void>;
};

function createMemoryStorageArea(
  listeners: StorageChangeListener[],
  initialData: Record<string, unknown>,
): MemoryStorageArea {
  const data = { ...initialData };

  return {
    __data: data,
    async get(keys?: string | string[] | object | null) {
      if (keys == null) {
        return { ...data };
      }

      if (typeof keys === 'string') {
        return { [keys]: data[keys] };
      }

      if (Array.isArray(keys)) {
        return keys.reduce<Record<string, unknown>>((accumulator, key) => {
          accumulator[key] = data[key];
          return accumulator;
        }, {});
      }

      return Object.entries(keys).reduce<Record<string, unknown>>((accumulator, [key, fallbackValue]) => {
        accumulator[key] = key in data ? data[key] : fallbackValue;
        return accumulator;
      }, {});
    },
    async set(items: Record<string, unknown>) {
      const changes = Object.entries(items).reduce<Record<string, chrome.storage.StorageChange>>((accumulator, [key, value]) => {
        accumulator[key] = {
          oldValue: data[key],
          newValue: value,
        };
        data[key] = value;
        return accumulator;
      }, {});

      listeners.forEach((listener) => listener(changes, 'local'));
    },
    async remove(keys: string | string[]) {
      const targets = Array.isArray(keys) ? keys : [keys];
      const changes = targets.reduce<Record<string, chrome.storage.StorageChange>>((accumulator, key) => {
        accumulator[key] = {
          oldValue: data[key],
          newValue: undefined,
        };
        delete data[key];
        return accumulator;
      }, {});

      listeners.forEach((listener) => listener(changes, 'local'));
    },
    async clear() {
      const changes = Object.keys(data).reduce<Record<string, chrome.storage.StorageChange>>((accumulator, key) => {
        accumulator[key] = {
          oldValue: data[key],
          newValue: undefined,
        };
        return accumulator;
      }, {});

      Object.keys(data).forEach((key) => delete data[key]);
      listeners.forEach((listener) => listener(changes, 'local'));
    },
    async getBytesInUse() {
      return JSON.stringify(data).length;
    },
    setAccessLevel: async () => undefined,
  } satisfies MemoryStorageArea;
}

export function installChromeMock(initialGuardSettings?: GuardSettings) {
  const listeners: StorageChangeListener[] = [];
  const local = createMemoryStorageArea(
    listeners,
    initialGuardSettings ? { guardSettings: initialGuardSettings } : {},
  );

  Object.defineProperty(globalThis, 'chrome', {
    configurable: true,
    value: {
      storage: {
        local,
        onChanged: {
          addListener(listener: StorageChangeListener) {
            listeners.push(listener);
          },
          removeListener(listener: StorageChangeListener) {
            const index = listeners.indexOf(listener);
            if (index >= 0) {
              listeners.splice(index, 1);
            }
          },
          hasListener(listener: StorageChangeListener) {
            return listeners.includes(listener);
          },
        },
      },
      runtime: {
        onInstalled: {
          addListener() {
            return undefined;
          },
          removeListener() {
            return undefined;
          },
        },
      },
    } as unknown as typeof chrome,
  });

  return globalThis.chrome;
}
