export type Severity = 'warning' | 'violation';

export type ChatRule = {
  id: string;
  name: string;
  severity: Severity;
  priority: number;
  description?: string;
  test: (input: string) => boolean;
};

export type EvaluationResult =
  | { status: 'safe' }
  | {
      status: Severity;
      ruleId: string;
      ruleName: string;
      lockDurationMs: number;
    };

export type GuardSettings = {
  warningDurationMs: number;
  violationDurationMs: number;
};

export type GuardPhase = 'safe' | 'warningLocked' | 'violationLocked' | 'unlocking' | 'unlocked';

export type GuardViewModel = {
  phase: GuardPhase;
  inputText: string;
  evaluation: EvaluationResult;
  progressMs: number;
  remainingMs: number;
  unlockedForInput?: string;
};

export type ChatInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLElement;

export type ChatElements = {
  inputEl: ChatInputElement;
  formEl: HTMLFormElement;
  sendButtonEl?: HTMLButtonElement;
};

export type RuleRegistry = {
  warningRules: ChatRule[];
  violationRules: ChatRule[];
};
