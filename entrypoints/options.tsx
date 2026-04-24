import React from 'react';
import { createRoot } from 'react-dom/client';
import { OptionsApp } from '../src/ui/options/OptionsApp';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Options root container not found.');
}

createRoot(container).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>,
);
