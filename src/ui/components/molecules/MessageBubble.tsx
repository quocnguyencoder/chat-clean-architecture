import { Avatar, Typography } from 'antd';
import type { ReactNode } from 'react';

import { theme } from '@/constants/theme';
import { messagesStyles } from '@/ui/styles/chatStyles';

const { Text } = Typography;

interface MessageBubbleProps {
  content: ReactNode;
  sender: 'me' | 'other';
  senderName?: string;
  showAvatar?: boolean;
  avatarSrc?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  senderName,
  showAvatar = true,
  avatarSrc = '/api/placeholder/28/28',
}) => {
  return (
    <div
      style={{
        ...messagesStyles.messageContainer,
        justifyContent: sender === 'me' ? 'flex-end' : 'flex-start',
      }}
    >
      {sender === 'other' && showAvatar && (
        <Avatar
          size={theme.sizes.avatar.small}
          src={avatarSrc}
          style={{ marginRight: 8 }}
        />
      )}
      <div
        style={{
          ...messagesStyles.messageBubble,
          ...(sender === 'me'
            ? messagesStyles.myMessage
            : messagesStyles.otherMessage),
        }}
      >
        {senderName && sender === 'other' && (
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontSize: 11,
              display: 'block',
              marginBottom: 2,
            }}
          >
            {senderName}
          </Text>
        )}
        <Text style={{ color: theme.colors.text.primary }}>{content}</Text>
      </div>
    </div>
  );
};
