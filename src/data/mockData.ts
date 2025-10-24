import type { ChatItem, Message } from '@/types/chat';

export const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Đã Lạt 🚙',
    lastMessage: 'Tuyển: kh tốt cho e...',
    time: '12:44 pm',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Thuy Trang',
    lastMessage: 'Ok',
    time: '12:34 pm',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Phước Yên',
    lastMessage: 'Em qúi con buq vo tr...',
    time: '11:53 am',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    unreadCount: 49,
  },
  {
    id: '4',
    name: 'Make Frontline Great...',
    lastMessage: 'Seizam: Ngon k...',
    time: '11:08 am',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Ninh Thuận 4/10/2025 Kh...',
    lastMessage: 'Phương: S nay đêo...',
    time: '11:05 am',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    isGroup: true,
  },
  {
    id: '6',
    name: 'Tỗ Hợp Thể Thao Speedy...',
    lastMessage: 'Ok c chốt 1 sẵn câu...',
    time: '10:59 am',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    isGroup: true,
  },
  {
    id: '7',
    name: 'Văn phòng thám tử',
    lastMessage: 'Nam: những cuộc kì k...',
    time: '10:54 am',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    isGroup: true,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'a Sang nữa',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Tuyển',
  },
  {
    id: '2',
    text: 'đồn hết cty rồi',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Linh',
  },
  {
    id: '3',
    text: 'đi làm k con bth nữa rồi 😂',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Tuyển',
  },
  {
    id: '4',
    text: 'quá đã',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Linh',
  },
  {
    id: '5',
    text: 'làm thiệt luôn cho ngta khỏi đồn đoán e',
    sender: 'other',
    time: '12:40 PM',
  },
  {
    id: '6',
    text: 'kh tốt cho em anh a 😂',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Tuyển',
  },
  {
    id: '7',
    text: 'ko hể hỏi gì luôn ấy',
    sender: 'me',
    time: '12:40 PM',
  },
];

export const mockStoryUsers = ['Bình', 'Trang', 'Đ'];
