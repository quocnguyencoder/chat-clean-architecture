export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
  isGroup?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  senderName?: string;
}

export interface MainLayoutProps {
  children?: React.ReactNode;
}
