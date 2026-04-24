import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  manifest: ({ mode }) => ({
    name: 'Twitch Chat Guard Extension',
    description: 'Warns on risky Twitch chat messages and requires a deliberate Enter hold to send.',
    permissions: ['storage'],
    host_permissions:
      mode === 'development'
        ? ['https://www.twitch.tv/*', 'http://127.0.0.1/*', 'http://localhost/*']
        : ['https://www.twitch.tv/*'],
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
  }),
});
