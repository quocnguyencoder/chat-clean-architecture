import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { messagesStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: messagesStyles.container,
  content: {
    flex: 1,
  } as CSSProperties,
  unreadHeader: {
    textAlign: 'center',
    marginBottom: 16,
  } as CSSProperties,
  unreadText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
  } as CSSProperties,
};
