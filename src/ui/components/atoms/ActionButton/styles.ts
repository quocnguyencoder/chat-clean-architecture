import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

export const styles = {
  base: {
    border: 'none',
    minWidth: 'auto',
    padding: 4,
  } as CSSProperties,

  primary: {
    color: theme.colors.primary,
  } as CSSProperties,

  secondary: {
    color: theme.colors.text.secondary,
  } as CSSProperties,
};
