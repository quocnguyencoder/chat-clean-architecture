/**
 * Virtualized Message List Styles
 */

import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

interface VirtualizedMessageListStyles {
  container: CSSProperties;
  fullSize: CSSProperties;
  messageRow: CSSProperties;
  messageRowHighlighted: CSSProperties;
  timestampRow: CSSProperties;
  timestampText: CSSProperties;
}

export const styles: VirtualizedMessageListStyles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  messageRow: {
    padding: '8px 16px',
    transition: 'none',
    backgroundColor: 'transparent',
  },
  messageRowHighlighted: {
    padding: '8px 16px',
    transition: 'background-color 0.3s ease',
    backgroundColor: theme.colors.background.card,
    borderLeft: `3px solid ${theme.colors.primary}`,
  },
  timestampRow: {
    padding: '16px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: '12px',
    color: theme.colors.text.secondary,
    backgroundColor: theme.colors.background.card,
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: 500,
  },
};
