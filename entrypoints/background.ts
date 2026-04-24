import { ensureGuardSettings } from '../src/settings/storage';

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async () => {
    await ensureGuardSettings();
  });
});
