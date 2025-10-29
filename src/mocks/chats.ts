/**
 * Mock Chat Data
 *
 * Centralized mock data for chats.
 * Generated from users and groups data with empty initial state.
 */

import { GROUPS } from './groups';
import { OTHER_USERS } from './users';

import type { ChatPlainObject } from '@/domain/entities/Chat';

/**
 * Generate initial empty chats from users and groups
 */
export const mockChatsData: ChatPlainObject[] = [
  // Individual chats from OTHER_USERS - use user ID as chat ID
  ...OTHER_USERS.map(user => ({
    id: user.id,
    name: user.name,
    lastMessage: '',
    time: '',
    avatar: user.avatar || '',
    isOnline: user.isOnline || false,
    unreadCount: 0,
    isGroup: false,
    isSentByCurrentUser: false,
  })),
  // Group chats from GROUPS
  ...GROUPS.map(group => ({
    id: group.id,
    name: group.name,
    lastMessage: '',
    time: '',
    avatar: group.avatar || '',
    isOnline: false,
    unreadCount: 0,
    isGroup: true,
    isSentByCurrentUser: false,
  })),
];
