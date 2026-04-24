import { TwitchChatController } from '../src/content/twitch/controller';

export default defineContentScript({
  matches: ['https://www.twitch.tv/*', 'http://127.0.0.1/*', 'http://localhost/*'],
  runAt: 'document_idle',
  main() {
    const controller = new TwitchChatController(document);
    controller.start();
  },
});
