import { TwitchChatController } from '../../src/content/twitch/controller';
import { installChromeMock } from '../helpers/chrome';

function createComposerDom() {
  document.body.innerHTML = `
    <main>
      <form data-a-target="chat-input-form">
        <textarea data-a-target="chat-input"></textarea>
        <button type="submit" data-a-target="chat-send-button">Send</button>
      </form>
    </main>
  `;

  const form = document.querySelector('form') as HTMLFormElement;
  const input = document.querySelector('textarea') as HTMLTextAreaElement;
  const button = document.querySelector('button') as HTMLButtonElement;

  return { form, input, button };
}

describe('TwitchChatController', () => {
  beforeEach(() => {
    installChromeMock();
    createComposerDom();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(performance.now() + 3_500);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('blocks submit while locked and unlocks after a full hold', async () => {
    const controller = new TwitchChatController(document);
    controller.start();
    await vi.waitFor(() => {
      expect(document.querySelector('[data-chat-guard-host="true"]')).not.toBeNull();
    });

    const input = document.querySelector('textarea') as HTMLTextAreaElement;
    const form = document.querySelector('form') as HTMLFormElement;

    input.value = 'What????';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    expect(submitEvent.defaultPrevented).toBe(true);

    const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input.dispatchEvent(keydownEvent);

    expect(controller.getViewModel().phase).toBe('unlocked');

    const unlockedSubmit = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(unlockedSubmit);
    expect(unlockedSubmit.defaultPrevented).toBe(false);
  });

  it('resets hold progress when the DOM reattaches', async () => {
    const controller = new TwitchChatController(document);
    controller.start();
    await vi.waitFor(() => {
      expect(document.querySelector('[data-chat-guard-host="true"]')).not.toBeNull();
    });

    const input = document.querySelector('textarea') as HTMLTextAreaElement;
    input.value = 'What????';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    document.body.innerHTML = `
      <form data-a-target="chat-input-form">
        <textarea data-a-target="chat-input"></textarea>
        <button type="submit" data-a-target="chat-send-button">Send</button>
      </form>
    `;

    await vi.waitFor(() => {
      expect(controller.getViewModel().phase).toBe('safe');
    });
  });
});
