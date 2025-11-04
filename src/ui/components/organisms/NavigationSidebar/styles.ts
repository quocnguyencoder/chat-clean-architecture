import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
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
    borderTop: `1px solid ${theme.colors.divider}`,
    margin: '8px 0',
  } as CSSProperties,
  actionButton: {
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  } as CSSProperties,
  uploadWrapper: {
    display: 'block',
    width: '100%',
  } as CSSProperties,
  uploadButton: {
    width: '100%',
  } as CSSProperties,
  reloadIcon: {
    fontSize: '20px',
    color: theme.colors.error,
  } as CSSProperties,
  exportIcon: {
    fontSize: '20px',
    color: theme.colors.info,
  } as CSSProperties,
  importIcon: {
    fontSize: '20px',
    color: theme.colors.successLight,
  } as CSSProperties,
  playIcon: {
    fontSize: '20px',
    color: theme.colors.successLight,
  } as CSSProperties,
  pauseIcon: {
    fontSize: '20px',
    color: theme.colors.warningDark,
  } as CSSProperties,
  modalWarningIcon: {
    color: theme.colors.warningDark,
    marginRight: 8,
    fontSize: '16px',
  } as CSSProperties,
  modalContent: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 16,
    color: theme.colors.text.white,
  } as CSSProperties,
};
