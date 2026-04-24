import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { GuardViewModel } from '../../shared/types';
import { GuardOverlay } from './GuardOverlay';

export type GuardOverlayMount = {
  render: (viewModel: GuardViewModel, liveMessage: string) => void;
  destroy: () => void;
  host: HTMLElement;
};

function createShadowHost(documentRef: Document, parent: HTMLElement): { host: HTMLElement; rootNode: HTMLElement } {
  const host = documentRef.createElement('div');
  host.dataset.chatGuardHost = 'true';
  parent.insertAdjacentElement('afterend', host);

  const shadowRoot = host.attachShadow({ mode: 'open' });
  const wrapper = documentRef.createElement('div');
  shadowRoot.appendChild(wrapper);

  return { host, rootNode: wrapper };
}

export function mountGuardOverlay(documentRef: Document, parent: HTMLElement): GuardOverlayMount {
  const { host, rootNode } = createShadowHost(documentRef, parent);
  const root: Root = createRoot(rootNode);

  return {
    host,
    render(viewModel, liveMessage) {
      root.render(
        <React.StrictMode>
          <GuardOverlay viewModel={viewModel} liveMessage={liveMessage} />
        </React.StrictMode>,
      );
    },
    destroy() {
      root.unmount();
      host.remove();
    },
  };
}
