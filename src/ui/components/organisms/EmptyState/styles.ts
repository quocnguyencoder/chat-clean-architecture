import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

export const getEmptyStateContainerStyles = (): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.colors.background.secondary,
  width: '100%',
  height: '100vh',
});

export const getEmptyStateContentStyles = (): CSSProperties => ({
  textAlign: 'center',
});

export const getEmptyStateIconStyles = (): CSSProperties => ({
  fontSize: 64,
  color: theme.colors.text.secondary,
  marginBottom: 16,
});

export const getEmptyStateTitleStyles = (): CSSProperties => ({
  color: theme.colors.text.secondary,
});
