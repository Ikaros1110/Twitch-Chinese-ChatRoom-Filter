import type { ChatElements, ChatInputElement } from '../../shared/types';

const FORM_SELECTORS = [
  'form[data-a-target="chat-input-form"]',
  'form[data-a-target="chat-send-button"]',
  'form',
];

const INPUT_SELECTORS = [
  'textarea[data-a-target="chat-input"]',
  'textarea[placeholder]',
  'textarea',
  '[contenteditable="true"][role="textbox"]',
];

const SEND_BUTTON_SELECTORS = ['button[data-a-target="chat-send-button"]', 'button[type="submit"]'];

function findFirst<T extends Element>(root: ParentNode, selectors: string[]): T | null {
  for (const selector of selectors) {
    const match = root.querySelector<T>(selector);
    if (match) {
      return match;
    }
  }

  return null;
}

export function getChatInputValue(inputEl: ChatInputElement): string {
  if (inputEl instanceof HTMLTextAreaElement || inputEl instanceof HTMLInputElement) {
    return inputEl.value;
  }

  return inputEl.textContent ?? '';
}

export function findChatElements(root: Document | ParentNode): ChatElements | null {
  const formEl = findFirst<HTMLFormElement>(root, FORM_SELECTORS);
  if (!formEl) {
    return null;
  }

  const inputEl = findFirst<ChatInputElement>(formEl, INPUT_SELECTORS);
  if (!inputEl) {
    return null;
  }

  const sendButtonEl = findFirst<HTMLButtonElement>(formEl, SEND_BUTTON_SELECTORS) ?? undefined;

  return {
    formEl,
    inputEl,
    sendButtonEl,
  };
}
