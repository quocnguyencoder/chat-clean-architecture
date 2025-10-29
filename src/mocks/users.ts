/**
 * User Data
 *
 * Contains user information for the application including current user and other users.
 * This data is used for authentication, chat participants, and mock responses.
 */

import { generateUserAvatar } from '@/utils/avatar';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isOnline?: boolean;
}

/**
 * Current logged-in user
 */
export const CURRENT_USER: User = {
  id: '550e8400-e29b-41d4-a716-446655440000', // UUID for current user
  name: 'Me',
  email: 'me@example.com',
  avatar: generateUserAvatar('Me'),
  isOnline: true,
};

/**
 * Other users in the application
 */
export const OTHER_USERS: User[] = [
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Alex Johnson
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: generateUserAvatar('Alex Johnson'),
    isOnline: true,
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', // Lisa Chen
    name: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    avatar: generateUserAvatar('Lisa Chen'),
    isOnline: true,
  },
  {
    id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', // David Kim
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: generateUserAvatar('David Kim'),
    isOnline: false,
  },
  {
    id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8', // Sarah Parker
    name: 'Sarah Parker',
    email: 'sarah.parker@example.com',
    avatar: generateUserAvatar('Sarah Parker'),
    isOnline: true,
  },
  {
    id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', // Michael Brown
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: generateUserAvatar('Michael Brown'),
    isOnline: false,
  },
  {
    id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8', // Emma Wilson
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: generateUserAvatar('Emma Wilson'),
    isOnline: true,
  },
];

/**
 * All users (current + others)
 */
export const ALL_USERS: User[] = [CURRENT_USER, ...OTHER_USERS];

/**
 * Get user by ID
 */
export function getUserById(userId: string): User | undefined {
  return ALL_USERS.find(user => user.id === userId);
}

/**
 * Get user by name
 */
export function getUserByName(userName: string): User | undefined {
  return ALL_USERS.find(
    user => user.name.toLowerCase() === userName.toLowerCase()
  );
}

/**
 * Get online users
 */
export function getOnlineUsers(): User[] {
  return ALL_USERS.filter(user => user.isOnline);
}

/**
 * Get random user (excluding current user)
 */
export function getRandomOtherUser(): User {
  return OTHER_USERS[Math.floor(Math.random() * OTHER_USERS.length)];
}
