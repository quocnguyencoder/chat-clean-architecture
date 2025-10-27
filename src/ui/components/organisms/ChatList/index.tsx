import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Input, Typography } from 'antd';

import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';
import { Stories } from '../Stories';

import { styles } from './styles';

import { mockChats, mockStoryUsers } from '@/data/mockData';
import type { ChatItem } from '@/types/chat';

const { Text, Title } = Typography;

interface ChatListProps {
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  selectedChatId,
  onChatSelect,
}) => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Title level={3} style={styles.title}>
          Chats
        </Title>
        <Button type='text' icon={<PlusOutlined />} style={styles.addButton} />
      </div>

      {/* Search */}
      <Input
        placeholder='Search'
        prefix={<SearchOutlined style={styles.searchIcon} />}
        style={styles.searchInput}
      />

      {/* Status Stories */}
      <Stories storyUsers={mockStoryUsers} />

      <Divider style={styles.divider} />

      {/* Chat List */}
      <div style={styles.chatListScroll}>
        {mockChats.map((chat: ChatItem) => {
          const isActive = selectedChatId === chat.id;
          return (
            <div
              key={chat.id}
              role='button'
              tabIndex={0}
              onClick={() => onChatSelect(chat.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChatSelect(chat.id);
                }
              }}
              style={
                isActive ? styles.chatItem.active : styles.chatItem.inactive
              }
            >
              <AvatarWithStatus
                size={48}
                src={chat.avatar}
                isOnline={chat.isOnline}
                statusSize='large'
                style={styles.avatarContainer}
              />
              <div style={styles.chatContent}>
                <div style={styles.chatInfoRow}>
                  <Text strong style={styles.chatName}>
                    {chat.name}
                  </Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </div>
                <div style={styles.chatInfoRow}>
                  <Text
                    style={{
                      ...styles.chatMessage.base,
                      ...(chat.unreadCount
                        ? styles.chatMessage.unread
                        : styles.chatMessage.read),
                    }}
                  >
                    {chat.lastMessage}
                  </Text>
                  {chat.unreadCount && (
                    <Badge count={chat.unreadCount} style={styles.chatBadge} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
