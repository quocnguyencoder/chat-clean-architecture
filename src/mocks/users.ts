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
  id: 'current-user',
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
    id: 'user-alex-johnson',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: generateUserAvatar('Alex Johnson'),
    isOnline: true,
  },
  {
    id: 'user-lisa-chen',
    name: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    avatar: generateUserAvatar('Lisa Chen'),
    isOnline: true,
  },
  {
    id: 'user-david-kim',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: generateUserAvatar('David Kim'),
    isOnline: false,
  },
  {
    id: 'user-sarah-parker',
    name: 'Sarah Parker',
    email: 'sarah.parker@example.com',
    avatar: generateUserAvatar('Sarah Parker'),
    isOnline: true,
  },
  {
    id: 'user-michael-brown',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: generateUserAvatar('Michael Brown'),
    isOnline: false,
  },
  {
    id: 'user-emma-wilson',
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

/**
 * Generate user ID from name
 */
export function generateUserId(name: string): string {
  return `user-${name.toLowerCase().replace(/\s+/g, '-')}`;
}
