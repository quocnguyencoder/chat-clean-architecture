/**
 * Chat Status Constants
 *
 * Constants and utility functions for chat status display
 */

import { theme } from './theme';

export const CHAT_STATUS_TEXT = {
  GROUP: 'Group',
  ACTIVE: 'Active now',
  OFFLINE: 'Offline',
} as const;

export const CHAT_STATUS_COLORS = {
  GROUP: theme.colors.text.secondary,
  ACTIVE: theme.colors.success,
  OFFLINE: theme.colors.text.secondary,
} as const;

/**
 * Get status text based on chat type and online status
 */
export function getStatusText(isGroup: boolean, isOnline: boolean): string {
  if (isGroup) {
    return CHAT_STATUS_TEXT.GROUP;
  }
  return isOnline ? CHAT_STATUS_TEXT.ACTIVE : CHAT_STATUS_TEXT.OFFLINE;
}

/**
 * Get status color based on chat type and online status
 */
export function getStatusColor(isGroup: boolean, isOnline: boolean): string {
  if (isGroup) {
    return CHAT_STATUS_COLORS.GROUP;
  }
  return isOnline ? CHAT_STATUS_COLORS.ACTIVE : CHAT_STATUS_COLORS.OFFLINE;
}
