import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

export const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.colors.background.secondary,
    width: '100%',
    height: '100vh',
  } as CSSProperties,
  content: {
    textAlign: 'center',
  } as CSSProperties,
  icon: {
    fontSize: 64,
    color: theme.colors.text.secondary,
    marginBottom: 16,
  } as CSSProperties,
  title: {
    color: theme.colors.text.secondary,
  } as CSSProperties,
};
