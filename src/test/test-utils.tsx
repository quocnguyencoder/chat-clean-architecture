/**
 * Test Utilities
 *
 * Custom render functions and utilities for testing React components
 */

import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

/**
 * Custom render function that wraps components with providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add providers here if needed (e.g., ThemeProvider, Router, etc.)
  return {
    user: userEvent.setup(),
    ...render(ui, { ...options }),
  };
}

// Re-export everything from React Testing Library
export { fireEvent, screen, waitFor, within } from '@testing-library/react';
export { renderWithProviders as render };
