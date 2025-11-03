import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  } as CSSProperties,
  searchInput: {
    marginTop: 8,
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.border,
    color: theme.colors.text.primary,
  } as CSSProperties,
  searchInputPlaceholder: {
    color: theme.colors.text.primary,
  } as CSSProperties,
  resultsContainer: {
    maxHeight: 400,
    overflowY: 'auto',
  } as CSSProperties,
  resultsCount: {
    display: 'block',
    marginBottom: 12,
    fontSize: 14,
    color: theme.colors.text.secondary,
  } as CSSProperties,
  messageItem: {
    cursor: 'pointer',
    padding: 12,
    borderRadius: 8,
    transition: 'background-color 0.2s',
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background.card,
    marginBottom: 8,
  } as CSSProperties,
  messageItemHover: {
    backgroundColor: theme.colors.background.hover,
  } as CSSProperties,
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  } as CSSProperties,
  messageText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  } as CSSProperties,
  highlightText: {
    backgroundColor: theme.colors.warning,
    color: theme.colors.text.inverse,
    padding: '2px 0',
    fontWeight: 600,
  } as CSSProperties,
  messageTime: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  } as CSSProperties,
  noResults: {
    textAlign: 'center',
    padding: 40,
  } as CSSProperties,
  noResultsText: {
    color: theme.colors.text.secondary,
  } as CSSProperties,
  modalTitle: {
    color: theme.colors.text.primary,
  } as CSSProperties,
  closeIcon: {
    color: theme.colors.text.primary,
  } as CSSProperties,
  senderName: {
    color: theme.colors.text.primary,
  } as CSSProperties,
};
