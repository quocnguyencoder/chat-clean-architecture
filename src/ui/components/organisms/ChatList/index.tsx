import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Input, Typography } from 'antd';

import { OnlineStatusIndicator } from '../../atoms/OnlineStatusIndicator';
import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';

import {
  getAddButtonStyles,
  getAvatarContainerStyles,
  getChatBadgeStyles,
  getChatContentStyles,
  getChatInfoRowStyles,
  getChatItemContainerStyles,
  getChatListContainerStyles,
  getChatListHeaderStyles,
  getChatListScrollStyles,
  getChatListSearchInputStyles,
  getChatListStoriesContainerStyles,
  getChatListStoryAvatarStyles,
  getChatListStoryItemStyles,
  getChatListTitleStyles,
  getChatMessageStyles,
  getChatNameStyles,
  getChatTimeStyles,
  getDividerStyles,
  getSearchIconStyles,
  getStoriesSectionStyles,
  getStoryAvatarContainerStyles,
  getStoryAvatarStyles,
  getStoryTextStyles,
} from './styles';

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
    <div style={getChatListContainerStyles()}>
      {/* Header */}
      <div style={getChatListHeaderStyles()}>
        <Title level={3} style={getChatListTitleStyles()}>
          Chats
        </Title>
        <Button
          type='text'
          icon={<PlusOutlined />}
          style={getAddButtonStyles()}
        />
      </div>

      {/* Search */}
      <Input
        placeholder='Search'
        prefix={<SearchOutlined style={getSearchIconStyles()} />}
        style={getChatListSearchInputStyles()}
      />

      {/* Status Stories */}
      <div style={getStoriesSectionStyles()}>
        <div style={getChatListStoriesContainerStyles()}>
          <div style={getChatListStoryItemStyles()}>
            <div style={getChatListStoryAvatarStyles()}>
              <Avatar
                size={52}
                src='/api/placeholder/52/52'
                style={getStoryAvatarStyles()}
              />
            </div>
            <Text style={getStoryTextStyles()}>Your note</Text>
          </div>
          {mockStoryUsers.map(name => (
            <div key={name} style={getChatListStoryItemStyles()}>
              <div style={getStoryAvatarContainerStyles()}>
                <Avatar
                  size={52}
                  src='/api/placeholder/52/52'
                  style={getStoryAvatarStyles()}
                />
                <OnlineStatusIndicator isOnline={true} size='large' />
              </div>
              <Text style={getStoryTextStyles()}>{name}</Text>
            </div>
          ))}
        </div>
      </div>

      <Divider style={getDividerStyles()} />

      {/* Chat List */}
      <div style={getChatListScrollStyles()}>
        {mockChats.map((chat: ChatItem) => (
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
            style={getChatItemContainerStyles(selectedChatId === chat.id)}
          >
            <AvatarWithStatus
              size={48}
              src={chat.avatar}
              isOnline={chat.isOnline}
              statusSize='large'
              style={getAvatarContainerStyles()}
            />
            <div style={getChatContentStyles()}>
              <div style={getChatInfoRowStyles()}>
                <Text strong style={getChatNameStyles()}>
                  {chat.name}
                </Text>
                <Text style={getChatTimeStyles()}>{chat.time}</Text>
              </div>
              <div style={getChatInfoRowStyles()}>
                <Text style={getChatMessageStyles(!!chat.unreadCount)}>
                  {chat.lastMessage}
                </Text>
                {chat.unreadCount && (
                  <Badge
                    count={chat.unreadCount}
                    style={getChatBadgeStyles()}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
