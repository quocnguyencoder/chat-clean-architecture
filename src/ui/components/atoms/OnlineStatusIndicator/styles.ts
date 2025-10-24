import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

const sizeConfig = {
  small: { width: 12, height: 12, borderWidth: 1 },
  medium: { width: 14, height: 14, borderWidth: 2 },
  large: { width: 16, height: 16, borderWidth: 2 },
};

const baseStyles: CSSProperties = {
  position: 'absolute',
  bottom: 2,
  right: 2,
  borderRadius: theme.borderRadius.circle,
  background: theme.colors.success,
};

export const getStyles = (
  size: 'small' | 'medium' | 'large',
  customStyle?: CSSProperties
): CSSProperties => {
  const config = sizeConfig[size];

  return {
    ...baseStyles,
    width: config.width,
    height: config.height,
    border: `${config.borderWidth}px solid ${theme.colors.background.secondary}`,
    ...customStyle,
  };
};
