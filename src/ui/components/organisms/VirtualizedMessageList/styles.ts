/**
 * Virtualized Message List Styles
 */

import type { CSSProperties } from 'react';

interface VirtualizedMessageListStyles {
  container: CSSProperties;
  fullSize: CSSProperties;
  messageRow: CSSProperties;
  messageRowHighlighted: CSSProperties;
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
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
  },
};
