import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { navigationStyles } from '@/ui/styles/chatStyles';

export const getNavigationItemStyles = () => navigationStyles.navItem;

export const getNavigationButtonStyles = (isActive: boolean): CSSProperties => {
  return isActive
    ? navigationStyles.activeNavButton
    : navigationStyles.inactiveNavButton;
};

export const getNavigationLabelStyles = (isActive: boolean): CSSProperties => {
  return {
    ...navigationStyles.navLabel,
    color: isActive ? theme.colors.primary : theme.colors.text.secondary,
  };
};
