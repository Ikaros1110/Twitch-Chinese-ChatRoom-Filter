import { evaluateMessage } from '../../core/evaluator';
import { HoldController } from '../../core/lock/hold-controller';
import { createSafeGuardViewModel, reduceGuardState } from '../../core/state/guard-state';
import { DEFAULT_GUARD_SETTINGS, SETTINGS_STORAGE_KEY } from '../../settings/defaults';
import { readGuardSettings } from '../../settings/storage';
import { mountGuardOverlay, type GuardOverlayMount } from '../../ui/content/mount';
import type { ChatElements, EvaluationResult, GuardSettings, GuardViewModel } from '../../shared/types';
import { findChatElements, getChatInputValue } from './selectors';

const DOM_RESET_ANNOUNCEMENT = 'Chat composer changed. Hold reset.';
const INPUT_RESET_ANNOUNCEMENT = 'Message changed. Hold reset.';
const ENTER_RESET_ANNOUNCEMENT = 'Enter released. Hold reset.';
const UNLOCKED_ANNOUNCEMENT = 'Message unlocked for one send.';

export class TwitchChatController {
  private readonly holdController = new HoldController();
  private readonly documentRef: Document;

  private chatElements: ChatElements | null = null;
  private overlay: GuardOverlayMount | null = null;
  private observer: MutationObserver | null = null;
  private animationFrameId: number | null = null;
  private settings: GuardSettings = DEFAULT_GUARD_SETTINGS;
  private viewModel: GuardViewModel = createSafeGuardViewModel();
  private liveMessage = '';
  private started = false;

  constructor(documentRef: Document) {
    this.documentRef = documentRef;
  }

  start() {
    if (this.started) {
      return;
    }

    this.started = true;
    void this.initialize();
  }

  stop() {
    this.stopAnimationLoop();
    this.detachObserver();
    this.detachCurrentBindings();
    chrome.storage.onChanged.removeListener(this.handleStorageChange);
    this.started = false;
  }

  getViewModel(): GuardViewModel {
    return this.viewModel;
  }

  private async initialize() {
    this.settings = await readGuardSettings().catch(() => DEFAULT_GUARD_SETTINGS);
    this.bindToCurrentComposer();
    this.attachObserver();
    chrome.storage.onChanged.addListener(this.handleStorageChange);
  }

  private handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
    if (areaName !== 'local' || !changes[SETTINGS_STORAGE_KEY]) {
      return;
    }

    const nextValue = changes[SETTINGS_STORAGE_KEY].newValue;
    if (!nextValue || typeof nextValue !== 'object') {
      this.settings = DEFAULT_GUARD_SETTINGS;
    } else {
      const candidate = nextValue as Partial<GuardSettings>;
      this.settings = {
        warningDurationMs:
          typeof candidate.warningDurationMs === 'number'
            ? candidate.warningDurationMs
            : DEFAULT_GUARD_SETTINGS.warningDurationMs,
        violationDurationMs:
          typeof candidate.violationDurationMs === 'number'
            ? candidate.violationDurationMs
            : DEFAULT_GUARD_SETTINGS.violationDurationMs,
      };
    }

    this.resetLock('Settings updated. Hold reset.');
    this.evaluateCurrentInput();
  };

  private attachObserver() {
    if (this.observer) {
      return;
    }

    this.observer = new MutationObserver(() => {
      this.bindToCurrentComposer();
    });

    this.observer.observe(this.documentRef.body, { childList: true, subtree: true });
  }

  private detachObserver() {
    this.observer?.disconnect();
    this.observer = null;
  }

  private bindToCurrentComposer() {
    const nextElements = findChatElements(this.documentRef);

    if (!nextElements) {
      this.detachCurrentBindings();
      return;
    }

    if (
      this.chatElements &&
      this.chatElements.formEl === nextElements.formEl &&
      this.chatElements.inputEl === nextElements.inputEl &&
      this.chatElements.sendButtonEl === nextElements.sendButtonEl
    ) {
      return;
    }

    if (this.chatElements) {
      this.resetLock(DOM_RESET_ANNOUNCEMENT);
      this.detachCurrentBindings();
    }

    this.chatElements = nextElements;
    this.overlay = mountGuardOverlay(this.documentRef, nextElements.formEl);
    this.attachListeners(nextElements);
    this.evaluateCurrentInput();
  }

  private detachCurrentBindings() {
    if (!this.chatElements) {
      this.overlay?.destroy();
      this.overlay = null;
      return;
    }

    const { inputEl, formEl, sendButtonEl } = this.chatElements;
    inputEl.removeEventListener('input', this.handleInput);
    inputEl.removeEventListener('blur', this.handleBlur);
    inputEl.removeEventListener('keydown', this.handleKeyDown as EventListener);
    inputEl.removeEventListener('keyup', this.handleKeyUp as EventListener);
    formEl.removeEventListener('submit', this.handleSubmit);
    sendButtonEl?.removeEventListener('click', this.handleSendClick);

    this.chatElements = null;
    this.overlay?.destroy();
    this.overlay = null;
  }

  private attachListeners(elements: ChatElements) {
    elements.inputEl.addEventListener('input', this.handleInput);
    elements.inputEl.addEventListener('blur', this.handleBlur);
    elements.inputEl.addEventListener('keydown', this.handleKeyDown as EventListener);
    elements.inputEl.addEventListener('keyup', this.handleKeyUp as EventListener);
    elements.formEl.addEventListener('submit', this.handleSubmit);
    elements.sendButtonEl?.addEventListener('click', this.handleSendClick);
  }

  private handleInput = () => {
    this.resetLock(INPUT_RESET_ANNOUNCEMENT);
    this.evaluateCurrentInput();
  };

  private handleBlur = () => {
    if (this.viewModel.phase === 'unlocking') {
      this.resetLock('Focus moved away. Hold reset.');
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
      return;
    }

    if (this.viewModel.phase === 'safe') {
      return;
    }

    if (this.viewModel.phase === 'unlocked' && this.isCurrentInputUnlocked()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.viewModel.evaluation.status === 'safe' || this.viewModel.phase === 'unlocking') {
      return;
    }

    this.holdController.start(performance.now(), this.viewModel.evaluation.lockDurationMs);
    this.viewModel = reduceGuardState(this.viewModel, {
      type: 'HOLD_PROGRESS',
      hold: this.holdController.getSnapshot(),
    });
    this.liveMessage = `Holding Enter. ${Math.ceil(this.viewModel.remainingMs / 1_000)} seconds remaining.`;
    this.render();
    this.startAnimationLoop();
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (this.viewModel.phase === 'unlocking') {
      event.preventDefault();
      event.stopPropagation();
      this.resetLock(ENTER_RESET_ANNOUNCEMENT);
    }
  };

  private handleSubmit = (event: Event) => {
    if (this.shouldBlockSend()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.handleMessageSent();
  };

  private handleSendClick = (event: MouseEvent) => {
    if (this.shouldBlockSend()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.handleMessageSent();
  };

  private handleMessageSent() {
    this.holdController.reset();
    this.stopAnimationLoop();

    queueMicrotask(() => {
      const inputText = this.chatElements ? getChatInputValue(this.chatElements.inputEl) : '';
      const evaluation = evaluateMessage(inputText, this.settings);
      this.viewModel = reduceGuardState(this.viewModel, {
        type: 'MESSAGE_SENT',
        inputText,
        evaluation,
      });
      this.liveMessage = inputText ? 'Message sent. Guard reevaluated.' : 'Message sent.';
      this.render();
    });
  }

  private startAnimationLoop() {
    if (this.animationFrameId != null) {
      return;
    }

    const tick = (timestamp: number) => {
      this.animationFrameId = null;
      const snapshot = this.holdController.tick(timestamp);

      if (snapshot.isComplete) {
        this.holdController.complete();
        this.viewModel = reduceGuardState(this.viewModel, {
          type: 'HOLD_COMPLETE',
          hold: this.holdController.getSnapshot(),
        });
        this.liveMessage = UNLOCKED_ANNOUNCEMENT;
        this.render();
        return;
      }

      if (snapshot.isHolding) {
        this.viewModel = reduceGuardState(this.viewModel, {
          type: 'HOLD_PROGRESS',
          hold: snapshot,
        });
        this.render();
        this.animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    this.animationFrameId = window.requestAnimationFrame(tick);
  }

  private stopAnimationLoop() {
    if (this.animationFrameId == null) {
      return;
    }

    window.cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  private shouldBlockSend(): boolean {
    if (this.viewModel.phase === 'safe') {
      return false;
    }

    if (this.viewModel.phase === 'unlocked' && this.isCurrentInputUnlocked()) {
      return false;
    }

    return true;
  }

  private isCurrentInputUnlocked(): boolean {
    return this.viewModel.unlockedForInput != null && this.getCurrentInput() === this.viewModel.unlockedForInput;
  }

  private getCurrentInput(): string {
    return this.chatElements ? getChatInputValue(this.chatElements.inputEl) : '';
  }

  private evaluateCurrentInput() {
    const inputText = this.getCurrentInput();
    const evaluation = evaluateMessage(inputText, this.settings);

    this.viewModel = reduceGuardState(this.viewModel, {
      type: 'EVALUATED',
      inputText,
      evaluation,
    });

    if (evaluation.status === 'safe') {
      this.liveMessage = '';
    } else {
      this.liveMessage = `${evaluation.status === 'violation' ? 'Violation' : 'Warning'} rule ${evaluation.ruleName} triggered.`;
    }

    this.render();
  }

  private resetLock(message: string) {
    this.holdController.reset();
    this.stopAnimationLoop();
    this.viewModel = reduceGuardState(this.viewModel, { type: 'RESET_LOCK' });
    this.liveMessage = message;
    this.render();
  }

  private render() {
    this.overlay?.render(this.viewModel, this.liveMessage);
  }
}
