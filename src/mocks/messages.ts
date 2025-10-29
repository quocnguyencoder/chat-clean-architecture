/**
 * Mock Messages Data
 *
 * Centralized mock data for chat messages.
 * Initially empty - messages will be created when users send them.
 */

import { GROUPS } from './groups';
import { OTHER_USERS } from './users';

import type { MessagePlainObject } from '@/domain/entities/Message';

/**
 * Initial empty messages for all chats
 * Messages will be populated as users interact with the app
 * Keys are user IDs for individual chats and group IDs for group chats
 */
export const mockMessagesData: Record<string, MessagePlainObject[]> =
  Object.fromEntries([
    // Individual chats - use user IDs
    ...OTHER_USERS.map(user => [user.id, []]),
    // Group chats - use group IDs
    ...GROUPS.map(group => [group.id, []]),
  ]);
