import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';
import { PeopleInChatModal } from '../PeopleInChatModal';
import { SearchConversationModal } from '../SearchConversationModal';

import { styles } from './styles';

import { getStatusColor, getStatusText } from '@/constants/chatStatus';
import type { Chat } from '@/domain/entities/Chat';
import type { ChatParticipant } from '@/domain/entities/ChatParticipant';
import type { Message } from '@/domain/entities/Message';
import { useChatContext } from '@/ui/hooks';

const { Text } = Typography;

interface ChatHeaderProps {
  selectedChat: Chat;
  chatMessages?: Message[];
  chatParticipants?: ChatParticipant[];
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedChat,
  chatMessages = [],
  chatParticipants = [],
}) => {
  const { onlineUsers } = useChatContext();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);

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
    <>
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
          {/* <Button
          type='text'
          icon={<PhoneOutlined />}
          style={styles.actionButton.primary}
        />
        <Button
          type='text'
          icon={<VideoCameraOutlined />}
          style={styles.actionButton.primary}
        /> */}
          <Button
            type='text'
            icon={<SearchOutlined />}
            style={styles.actionButton.secondary}
            onClick={() => setIsSearchModalOpen(true)}
          />
          {selectedChat.isGroup && (
            <Button
              type='text'
              icon={<InfoCircleOutlined />}
              style={styles.actionButton.secondary}
              onClick={() => setIsPeopleModalOpen(true)}
            />
          )}
        </Space>
      </div>

      <SearchConversationModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        messages={chatMessages}
        chatId={selectedChat.id}
      />

      <PeopleInChatModal
        open={isPeopleModalOpen}
        onClose={() => setIsPeopleModalOpen(false)}
        participants={chatParticipants}
        chatName={selectedChat.name}
      />
    </>
  );
};
