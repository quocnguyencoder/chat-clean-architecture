import {
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { useMemo } from 'react';

import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';

import { styles } from './styles';

import { getStatusColor, getStatusText } from '@/constants/chatStatus';
import type { Chat } from '@/domain/entities/Chat';
import { useChatContext } from '@/ui/hooks';

const { Text } = Typography;

interface ChatHeaderProps {
  selectedChat: Chat;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChat }) => {
  const { onlineUsers } = useChatContext();

  // Determine if the chat user is online based on onlineUsers from context
  const isUserOnline = useMemo(() => {
    if (selectedChat.isGroup) {
      // For group chats, we don't show individual online status
      return false;
    }
    // For individual chats, check if the user is in the online users list
    const userStatus = onlineUsers.find(
      user => user.userId === selectedChat.id
    );
    return userStatus?.isOnline() ?? false;
  }, [selectedChat, onlineUsers]);

  // Get status text based on online status
  const statusText = useMemo(
    () => getStatusText(selectedChat.isGroup, isUserOnline),
    [selectedChat.isGroup, isUserOnline]
  );

  // Get status color based on online status
  const statusColor = useMemo(
    () => getStatusColor(selectedChat.isGroup, isUserOnline),
    [selectedChat.isGroup, isUserOnline]
  );

  return (
    <div style={styles.container}>
      <div style={styles.userInfo}>
        <AvatarWithStatus
          size={48}
          src={selectedChat.avatar}
          isOnline={isUserOnline}
          statusSize='large'
          style={styles.avatarContainer}
        />
        <div style={styles.userDetails}>
          <Text strong style={styles.userName}>
            {selectedChat.name}
          </Text>
          <Text style={{ ...styles.userStatus, color: statusColor }}>
            {statusText}
          </Text>
        </div>
      </div>
      <Space style={styles.actions}>
        <Button
          type='text'
          icon={<PhoneOutlined />}
          style={styles.actionButton.primary}
        />
        <Button
          type='text'
          icon={<VideoCameraOutlined />}
          style={styles.actionButton.primary}
        />
        <Button
          type='text'
          icon={<MoreOutlined />}
          style={styles.actionButton.secondary}
        />
      </Space>
    </div>
  );
};
