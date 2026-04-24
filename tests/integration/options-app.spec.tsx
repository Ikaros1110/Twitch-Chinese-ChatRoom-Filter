import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OptionsApp } from '../../src/ui/options/OptionsApp';
import { DEFAULT_GUARD_SETTINGS } from '../../src/settings/defaults';
import { installChromeMock } from '../helpers/chrome';

describe('OptionsApp', () => {
  it('loads settings and resets to defaults', async () => {
    const chromeMock = installChromeMock({
      warningDurationMs: 4_000,
      violationDurationMs: 8_000,
    });

    render(<OptionsApp storageArea={chromeMock.storage.local} />);

    expect(await screen.findByDisplayValue('4.0')).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reset to defaults' }));

    expect(await screen.findByDisplayValue(formatSeconds(DEFAULT_GUARD_SETTINGS.warningDurationMs))).toBeInTheDocument();
    expect(await screen.findByDisplayValue(formatSeconds(DEFAULT_GUARD_SETTINGS.violationDurationMs))).toBeInTheDocument();
  });

  it('shows validation errors for invalid values', async () => {
    const chromeMock = installChromeMock();
    render(<OptionsApp storageArea={chromeMock.storage.local} />);

    const user = userEvent.setup();
    const warningInput = await screen.findByLabelText('Warning hold duration (seconds)');
    await user.clear(warningInput);
    await user.type(warningInput, '0');
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Warning duration must be greater than 0.');
  });
});

function formatSeconds(ms: number): string {
  return (ms / 1_000).toFixed(1);
}
