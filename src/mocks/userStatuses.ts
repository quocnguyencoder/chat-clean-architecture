/**
 * Mock User Status Data
 *
 * Contains initial user status information for the application.
 * This data is used to initialize the UserStatusRepository.
 */

import { ALL_USERS } from './users';

import type { UserStatusPlainObject } from '@/domain/entities/UserStatus';

/**
 * Generate initial user statuses based on users
 */
export function generateInitialUserStatuses(): UserStatusPlainObject[] {
  return ALL_USERS.map(user => ({
    userId: user.id,
    status: user.isOnline ? ('online' as const) : ('offline' as const),
    lastOnlineTime: new Date().toISOString(),
  }));
}

/**
 * Mock user statuses with specific states
 */
export const mockUserStatuses: UserStatusPlainObject[] = [
  {
    userId: '550e8400-e29b-41d4-a716-446655440000', // CURRENT_USER
    status: 'online',
    lastOnlineTime: new Date().toISOString(),
  },
  {
    userId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Alex Johnson
    status: 'online',
    lastOnlineTime: new Date().toISOString(),
  },
  {
    userId: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', // Lisa Chen
    status: 'online',
    lastOnlineTime: new Date().toISOString(),
  },
  {
    userId: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', // David Kim
    status: 'offline',
    lastOnlineTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    userId: '6ba7b813-9dad-11d1-80b4-00c04fd430c8', // Sarah Parker
    status: 'online',
    lastOnlineTime: new Date().toISOString(),
  },
  {
    userId: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', // Michael Brown
    status: 'offline',
    lastOnlineTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    userId: '6ba7b815-9dad-11d1-80b4-00c04fd430c8', // Emma Wilson
    status: 'online',
    lastOnlineTime: new Date().toISOString(),
  },
];
