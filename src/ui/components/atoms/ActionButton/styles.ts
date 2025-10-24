import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

const baseButtonStyles: CSSProperties = {
  border: 'none',
  minWidth: 'auto',
  padding: 4,
};

export const getActionButtonStyles = (
  variant: 'primary' | 'secondary'
): CSSProperties => {
  return {
    ...baseButtonStyles,
    color:
      variant === 'primary'
        ? theme.colors.primary
        : theme.colors.text.secondary,
  };
};
