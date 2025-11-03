import type { CSSProperties } from 'react';

import { navigationStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: navigationStyles.container,
  brand: navigationStyles.brand,
  brandContainer: {
    marginBottom: 20,
  } as CSSProperties,
  navigationMenu: {
    width: '100%',
  } as CSSProperties,
  userAvatarContainer: {
    marginTop: 'auto',
    marginBottom: 16,
  } as CSSProperties,
  divider: {
    borderTop: '1px solid #e8e8e8',
    margin: '8px 0',
  } as CSSProperties,
  actionButton: {
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  } as CSSProperties,
  reloadIcon: {
    fontSize: '20px',
    color: '#1976d2',
  } as CSSProperties,
  playIcon: {
    fontSize: '20px',
    color: '#52c41a',
  } as CSSProperties,
  pauseIcon: {
    fontSize: '20px',
    color: '#faad14',
  } as CSSProperties,
};
