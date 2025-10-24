import { Avatar, Typography } from 'antd';
import type { ReactNode } from 'react';

import { styles } from './styles';

import { theme } from '@/constants/theme';

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
  const isSent = sender === 'me';

  return (
    <div style={isSent ? styles.container.sent : styles.container.received}>
      {sender === 'other' && showAvatar && (
        <Avatar
          size={theme.sizes.avatar.small}
          src={avatarSrc}
          style={styles.avatar}
        />
      )}
      <div style={isSent ? styles.bubble.sent : styles.bubble.received}>
        {senderName && sender === 'other' && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text style={styles.messageText}>{content}</Text>
      </div>
    </div>
  );
};
