import type { ChatItem, Message } from '@/types/chat';
import { generateGroupAvatar, generateUserAvatar } from '@/utils/avatar';

export const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'John Smith 🚙',
    lastMessage: 'Sarah: That sounds great...',
    time: '12:44 pm',
    avatar: generateUserAvatar('John Smith'),
    isOnline: true,
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Emma Wilson',
    lastMessage: 'Ok',
    time: '12:34 pm',
    avatar: generateUserAvatar('Emma Wilson'),
    isOnline: true,
  },
  {
    id: '3',
    name: 'Michael Brown',
    lastMessage: 'Let me check and get back...',
    time: '11:53 am',
    avatar: generateUserAvatar('Michael Brown'),
    isOnline: false,
    unreadCount: 49,
  },
  {
    id: '4',
    name: 'Project Team Alpha',
    lastMessage: 'Alex: Looking good...',
    time: '11:08 am',
    avatar: generateGroupAvatar('Project Team Alpha'),
    isOnline: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Marketing Team 2024',
    lastMessage: 'Lisa: Today we need to...',
    time: '11:05 am',
    avatar: generateGroupAvatar('Marketing Team 2024'),
    isOnline: true,
    isGroup: true,
  },
  {
    id: '6',
    name: 'Sports Club Members',
    lastMessage: "Great! Let's finalize the...",
    time: '10:59 am',
    avatar: generateGroupAvatar('Sports Club Members'),
    isOnline: false,
    isGroup: true,
  },
  {
    id: '7',
    name: 'Design Studio',
    lastMessage: 'David: The new concepts are...',
    time: '10:54 am',
    avatar: generateGroupAvatar('Design Studio'),
    isOnline: true,
    isGroup: true,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey Sarah, are you coming?',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'James',
  },
  {
    id: '2',
    text: 'The meeting has been moved to tomorrow',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Alice',
  },
  {
    id: '3',
    text: "I won't be able to make it today 😂",
    sender: 'other',
    time: '12:40 PM',
    senderName: 'James',
  },
  {
    id: '4',
    text: "That's awesome!",
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Alice',
  },
  {
    id: '5',
    text: 'Let me know when you have the final decision',
    sender: 'other',
    time: '12:40 PM',
  },
  {
    id: '6',
    text: 'Sounds good to me! 😂',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'James',
  },
  {
    id: '7',
    text: "I haven't heard anything about it",
    sender: 'me',
    time: '12:40 PM',
  },
];

export const mockStoryUsers = ['Ben', 'Tracy', 'Dan'];
