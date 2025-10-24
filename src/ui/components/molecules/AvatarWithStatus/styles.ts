import type { CSSProperties } from 'react';

const baseContainerStyles: CSSProperties = {
  position: 'relative',
};

export const getAvatarWithStatusStyles = (
  customStyle?: CSSProperties
): CSSProperties => {
  return {
    ...baseContainerStyles,
    ...customStyle,
  };
};
