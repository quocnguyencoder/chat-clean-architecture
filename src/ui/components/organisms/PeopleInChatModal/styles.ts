import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  } as CSSProperties,
  participantCount: {
    display: 'block',
    marginBottom: 8,
    fontSize: 14,
    color: theme.colors.text.secondary,
  } as CSSProperties,
  section: {
    marginBottom: 16,
    backgroundColor: theme.colors.background.card,
    padding: 12,
    borderRadius: 8,
  } as CSSProperties,
  sectionTitle: {
    display: 'block',
    marginBottom: 12,
    fontSize: 14,
    color: theme.colors.text.secondary,
  } as CSSProperties,
  list: {
    border: 'none',
  } as CSSProperties,
  participantItem: {
    padding: '12px 0',
    cursor: 'default',
    borderColor: theme.colors.border,
  } as CSSProperties,
  participantTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as CSSProperties,
  participantName: {
    color: theme.colors.text.primary,
  } as CSSProperties,
  adminTag: {
    marginLeft: 8,
  } as CSSProperties,
  statusText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  } as CSSProperties,
  statusOnline: {
    fontSize: 13,
    color: theme.colors.success,
  } as CSSProperties,
  modalTitle: {
    color: theme.colors.text.primary,
  } as CSSProperties,
  closeIcon: {
    color: theme.colors.text.primary,
  } as CSSProperties,
};
