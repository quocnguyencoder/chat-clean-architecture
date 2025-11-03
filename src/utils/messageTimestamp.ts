/**
 * Message Timestamp Utilities
 *
 * Helper functions for formatting and grouping messages by timestamps
 */

import type { Message } from '@/domain/entities/Message';

/**
 * Format timestamp for message group headers
 * Returns different formats based on when the message was sent
 */
export const formatTimestampHeader = (time: string): string => {
  const date = new Date(time);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset hours for date comparison
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return `Yesterday ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
};

/**
 * Check if we need to show a timestamp between messages
 * Shows timestamp if more than 1 hour has passed
 */
export const shouldShowTimestamp = (
  currentMessage: Message,
  previousMessage: Message | null
): boolean => {
  if (!previousMessage) return true;

  const currentTime = new Date(currentMessage.time).getTime();
  const previousTime = new Date(previousMessage.time).getTime();
  const hourInMs = 60 * 60 * 1000;

  return currentTime - previousTime > hourInMs;
};
