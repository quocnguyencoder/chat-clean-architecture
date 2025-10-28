/**
 * Mock Chat Data
 *
 * Centralized mock data for chats.
 * This data is linked with participants and messages.
 */

import type { ChatPlainObject } from '@/domain/entities/Chat';
import { generateGroupAvatar, generateUserAvatar } from '@/utils/avatar';

export const mockChatsData: ChatPlainObject[] = [
  {
    id: '1',
    name: 'John Smith 🚙',
    lastMessage: 'Sarah: That sounds great...',
    time: '12:44 pm',
    avatar: generateUserAvatar('John Smith'),
    isOnline: true,
    unreadCount: 3,
    isGroup: false,
  },
  {
    id: '2',
    name: 'Emma Wilson',
    lastMessage: 'Ok',
    time: '12:34 pm',
    avatar: generateUserAvatar('Emma Wilson'),
    isOnline: true,
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: '3',
    name: 'Michael Brown',
    lastMessage: 'Let me check and get back...',
    time: '11:53 am',
    avatar: generateUserAvatar('Michael Brown'),
    isOnline: false,
    unreadCount: 49,
    isGroup: false,
  },
  {
    id: '4',
    name: 'Project Team Alpha',
    lastMessage: 'Alex: Looking good...',
    time: '11:08 am',
    avatar: generateGroupAvatar('Project Team Alpha'),
    isOnline: false,
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Marketing Team 2024',
    lastMessage: 'Lisa: Today we need to...',
    time: '11:05 am',
    avatar: generateGroupAvatar('Marketing Team 2024'),
    isOnline: true,
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: '6',
    name: 'Sports Club Members',
    lastMessage: "Great! Let's finalize the...",
    time: '10:59 am',
    avatar: generateGroupAvatar('Sports Club Members'),
    isOnline: false,
    unreadCount: 0,
    isGroup: true,
  },
  {
    id: '7',
    name: 'Design Studio',
    lastMessage: 'David: The new concepts are...',
    time: '10:54 am',
    avatar: generateGroupAvatar('Design Studio'),
    isOnline: true,
    unreadCount: 0,
    isGroup: true,
  },
];
