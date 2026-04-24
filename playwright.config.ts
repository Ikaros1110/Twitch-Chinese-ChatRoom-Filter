import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'pnpm exec vite --host 127.0.0.1 --port 4173 test-pages',
    port: 4173,
    reuseExistingServer: true,
  },
});
