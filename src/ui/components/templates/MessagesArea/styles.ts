import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { messagesStyles } from '@/ui/styles/chatStyles';

export const getMessagesContainerStyles = () => messagesStyles.container;

export const getMessagesContentStyles = (): CSSProperties => ({
  flex: 1,
});

export const getUnreadHeaderStyles = (): CSSProperties => ({
  textAlign: 'center',
  marginBottom: 16,
});

export const getUnreadTextStyles = (): CSSProperties => ({
  color: theme.colors.text.secondary,
  fontSize: 12,
});
