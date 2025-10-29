/**
 * Mock Participants Data
 *
 * Centralized mock data for chat participants.
 * Generated from users and groups data.
 */

import { GROUPS } from './groups';
import { CURRENT_USER, OTHER_USERS } from './users';

import type { ChatParticipantPlainObject } from '@/domain/entities/ChatParticipant';

/**
 * Generate participants data from users and groups
 */
export const mockParticipantsData: Record<
  string,
  ChatParticipantPlainObject[]
> = {
  // Individual chats - use user ID as chat ID
  ...Object.fromEntries(
    OTHER_USERS.map(user => [
      user.id,
      [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar || '',
          isOnline: user.isOnline || false,
          role: 'member' as const,
        },
        {
          id: CURRENT_USER.id,
          name: CURRENT_USER.name,
          avatar: CURRENT_USER.avatar || '',
          isOnline: CURRENT_USER.isOnline || true,
          role: 'member' as const,
        },
      ],
    ])
  ),
  // Group chats - all members from groups
  ...Object.fromEntries(
    GROUPS.map(group => [
      group.id,
      group.members.map((member, idx) => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar || '',
        isOnline: member.isOnline || false,
        role: idx === 0 ? ('admin' as const) : ('member' as const),
      })),
    ])
  ),
};
