import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { navigationStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: navigationStyles.navItem,
  button: {
    active: navigationStyles.activeNavButton,
    inactive: navigationStyles.inactiveNavButton,
  },
  label: {
    base: navigationStyles.navLabel,
    active: {
      ...navigationStyles.navLabel,
      color: theme.colors.primary,
    } as CSSProperties,
    inactive: {
      ...navigationStyles.navLabel,
      color: theme.colors.text.secondary,
    } as CSSProperties,
  },
};
