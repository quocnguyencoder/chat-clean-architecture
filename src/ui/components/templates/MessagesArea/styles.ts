import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { messagesStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: {
    ...messagesStyles.container,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0,
  } as CSSProperties,
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: `${theme.spacing.lg}px`,
  } as CSSProperties,
  virtualizedContainer: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,
  virtualizedHeader: {
    textAlign: 'center',
    marginBottom: 16,
    padding: `${theme.spacing.lg}px ${theme.spacing.lg}px 0`,
  } as CSSProperties,
  virtualizedListWrapper: {
    flex: 1,
    overflow: 'hidden',
  } as CSSProperties,
  unreadHeader: {
    textAlign: 'center',
    marginBottom: 16,
  } as CSSProperties,
  unreadText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
  } as CSSProperties,
  inputContainer: {
    padding: `0 ${theme.spacing.lg}px ${theme.spacing.lg}px`,
    flexShrink: 0,
  } as CSSProperties,
};
