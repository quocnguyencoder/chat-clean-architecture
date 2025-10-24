import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { chatHeaderStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: chatHeaderStyles.container,
  userInfo: chatHeaderStyles.userInfo,
  userDetails: chatHeaderStyles.userDetails,
  actions: chatHeaderStyles.actions,
  userName: chatHeaderStyles.userName,
  userStatus: chatHeaderStyles.userStatus,
  avatarContainer: {
    marginRight: 12,
  } as CSSProperties,
  actionButton: {
    primary: {
      color: theme.colors.primary,
      border: 'none',
    } as CSSProperties,
    secondary: {
      color: theme.colors.text.secondary,
      border: 'none',
    } as CSSProperties,
  },
};
