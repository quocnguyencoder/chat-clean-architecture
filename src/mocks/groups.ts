/**
 * Group Data
 *
 * Contains group/chat information for the application.
 * This data is used for group chats, team conversations, and mock data.
 */

import { CURRENT_USER, OTHER_USERS, type User } from './users';

import { generateGroupAvatar } from '@/utils/avatar';

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: User[];
  createdAt?: string;
}

// Helper to get user by name from OTHER_USERS
const getUserByName = (name: string): User => {
  const user = OTHER_USERS.find(u => u.name === name);
  if (!user) {
    throw new Error(`User not found: ${name}`);
  }
  return user;
};

/**
 * All groups in the application
 */
export const GROUPS: Group[] = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', // Project Team Alpha
    name: 'Project Team Alpha',
    description: 'Main project team for Alpha initiative',
    avatar: generateGroupAvatar('Project Team Alpha'),
    members: [
      CURRENT_USER,
      getUserByName('Alex Johnson'),
      getUserByName('Lisa Chen'),
      getUserByName('David Kim'),
    ],
    createdAt: '2024-01-15',
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', // Marketing Team 2024
    name: 'Marketing Team 2024',
    description: 'Marketing team discussions',
    avatar: generateGroupAvatar('Marketing Team 2024'),
    members: [
      CURRENT_USER,
      getUserByName('Sarah Parker'),
      getUserByName('Michael Brown'),
      getUserByName('Emma Wilson'),
    ],
    createdAt: '2024-02-01',
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', // Sports Club Members
    name: 'Sports Club Members',
    description: 'Sports club activities and events',
    avatar: generateGroupAvatar('Sports Club Members'),
    members: [
      CURRENT_USER,
      getUserByName('Alex Johnson'),
      getUserByName('David Kim'),
      getUserByName('Emma Wilson'),
    ],
    createdAt: '2024-03-10',
  },
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', // Design Studio
    name: 'Design Studio',
    description: 'Design team collaboration',
    avatar: generateGroupAvatar('Design Studio'),
    members: [
      CURRENT_USER,
      getUserByName('Lisa Chen'),
      getUserByName('Sarah Parker'),
      getUserByName('Michael Brown'),
    ],
    createdAt: '2024-03-20',
  },
];

/**
 * Get group by ID
 */
export function getGroupById(groupId: string): Group | undefined {
  return GROUPS.find(group => group.id === groupId);
}

/**
 * Get group by name
 */
export function getGroupByName(groupName: string): Group | undefined {
  return GROUPS.find(
    group => group.name.toLowerCase() === groupName.toLowerCase()
  );
}

/**
 * Get groups that a user is member of
 */
export function getGroupsByMemberId(userId: string): Group[] {
  return GROUPS.filter(group =>
    group.members.some(member => member.id === userId)
  );
}

/**
 * Get random group
 */
export function getRandomGroup(): Group {
  return GROUPS[Math.floor(Math.random() * GROUPS.length)];
}

/**
 * Check if user is member of a group
 */
export function isGroupMember(groupId: string, userId: string): boolean {
  const group = getGroupById(groupId);
  return group ? group.members.some(member => member.id === userId) : false;
}

/**
 * Get group member IDs excluding current user
 */
export function getGroupMemberIds(
  groupId: string,
  excludeUserId?: string
): string[] {
  const group = getGroupById(groupId);
  if (!group) return [];

  const memberIds = group.members.map(member => member.id);

  return excludeUserId
    ? memberIds.filter(id => id !== excludeUserId)
    : memberIds;
}

/**
 * Get group members (User objects)
 */
export function getGroupMembers(
  groupId: string,
  excludeUserId?: string
): User[] {
  const group = getGroupById(groupId);
  if (!group) return [];

  return excludeUserId
    ? group.members.filter(member => member.id !== excludeUserId)
    : group.members;
}
