/**
 * Virtualized Message List Styles
 */

import type { CSSProperties } from 'react';

interface VirtualizedMessageListStyles {
  container: CSSProperties;
  unreadHeader: CSSProperties;
  unreadText: CSSProperties;
}

export const styles: VirtualizedMessageListStyles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  unreadHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  unreadText: {
    fontSize: '12px',
    color: '#8c8c8c',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
};
