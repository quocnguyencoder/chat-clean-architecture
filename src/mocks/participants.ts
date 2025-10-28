/**
 * Mock Participants Data
 *
 * Centralized mock data for chat participants.
 * This data is linked with chats and messages.
 */

import type { ChatParticipantPlainObject } from '@/domain/entities/ChatParticipant';
import { generateUserAvatar } from '@/utils/avatar';

export const mockParticipantsData: Record<
  string,
  ChatParticipantPlainObject[]
> = {
  '1': [
    {
      id: 'user-1',
      name: 'John Smith',
      avatar: generateUserAvatar('John Smith'),
      isOnline: true,
      role: 'admin',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
  '2': [
    {
      id: 'user-3',
      name: 'Emma Wilson',
      avatar: generateUserAvatar('Emma Wilson'),
      isOnline: true,
      role: 'admin',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
  '3': [
    {
      id: 'user-4',
      name: 'Michael Brown',
      avatar: generateUserAvatar('Michael Brown'),
      isOnline: false,
      role: 'admin',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
  '4': [
    {
      id: 'user-5',
      name: 'Alex Johnson',
      avatar: generateUserAvatar('Alex Johnson'),
      isOnline: false,
      role: 'admin',
    },
    {
      id: 'user-6',
      name: 'Lisa Chen',
      avatar: generateUserAvatar('Lisa Chen'),
      isOnline: true,
      role: 'member',
    },
    {
      id: 'user-7',
      name: 'David Kim',
      avatar: generateUserAvatar('David Kim'),
      isOnline: true,
      role: 'member',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
  '5': [
    {
      id: 'user-8',
      name: 'Sarah Johnson',
      avatar: generateUserAvatar('Sarah Johnson'),
      isOnline: true,
      role: 'admin',
    },
    {
      id: 'user-9',
      name: 'Mike Davis',
      avatar: generateUserAvatar('Mike Davis'),
      isOnline: false,
      role: 'member',
    },
    {
      id: 'user-10',
      name: 'Anna Lee',
      avatar: generateUserAvatar('Anna Lee'),
      isOnline: true,
      role: 'member',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
  '6': [
    {
      id: 'user-11',
      name: 'Tom Wilson',
      avatar: generateUserAvatar('Tom Wilson'),
      isOnline: false,
      role: 'admin',
    },
    {
      id: 'user-12',
      name: 'Chris Brown',
      avatar: generateUserAvatar('Chris Brown'),
      isOnline: true,
      role: 'member',
    },
    {
      id: 'user-13',
      name: 'Jessica Taylor',
      avatar: generateUserAvatar('Jessica Taylor'),
      isOnline: false,
      role: 'member',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
  '7': [
    {
      id: 'user-14',
      name: 'Rachel Green',
      avatar: generateUserAvatar('Rachel Green'),
      isOnline: true,
      role: 'admin',
    },
    {
      id: 'user-15',
      name: 'Ross Geller',
      avatar: generateUserAvatar('Ross Geller'),
      isOnline: true,
      role: 'member',
    },
    {
      id: 'user-16',
      name: 'Monica Bing',
      avatar: generateUserAvatar('Monica Bing'),
      isOnline: false,
      role: 'member',
    },
    {
      id: 'user-2',
      name: 'You',
      avatar: generateUserAvatar('You'),
      isOnline: true,
      role: 'member',
    },
  ],
};
