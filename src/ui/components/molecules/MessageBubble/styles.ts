import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { messagesStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: {
    base: messagesStyles.messageContainer,
    sent: {
      ...messagesStyles.messageContainer,
      justifyContent: 'flex-end',
    } as CSSProperties,
    received: {
      ...messagesStyles.messageContainer,
      justifyContent: 'flex-start',
    } as CSSProperties,
  },
  avatar: {
    marginRight: 8,
  } as CSSProperties,
  bubble: {
    base: messagesStyles.messageBubble,
    sent: {
      ...messagesStyles.messageBubble,
      ...messagesStyles.myMessage,
    } as CSSProperties,
    received: {
      ...messagesStyles.messageBubble,
      ...messagesStyles.otherMessage,
    } as CSSProperties,
  },
  senderName: {
    color: theme.colors.text.secondary,
    fontSize: 11,
    display: 'block',
    marginBottom: 2,
  } as CSSProperties,
  messageText: {
    color: theme.colors.text.primary,
  } as CSSProperties,
};
