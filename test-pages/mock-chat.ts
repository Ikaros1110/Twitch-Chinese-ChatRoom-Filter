import { TwitchChatController } from '../src/content/twitch/controller';
import { DEFAULT_GUARD_SETTINGS } from '../src/settings/defaults';
import { installChromeMock } from '../tests/helpers/chrome';

installChromeMock(DEFAULT_GUARD_SETTINGS);

const controller = new TwitchChatController(document);
controller.start();
