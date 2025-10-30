import { Avatar, Typography } from 'antd';
import type { ReactNode } from 'react';

import { styles } from './styles';

import { theme } from '@/constants/theme';
import { generateUserAvatar, getDefaultAvatar } from '@/utils/avatar';

const { Text } = Typography;

interface MessageBubbleProps {
  content: ReactNode;
  sender: 'me' | 'other';
  senderName?: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  isGroupChat?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  senderName,
  showAvatar = true,
  avatarSrc,
  isGroupChat = true,
}) => {
  const isSent = sender === 'me';

  // Generate avatar URL based on sender name if not provided
  const getAvatarSrc = () => {
    if (avatarSrc) return avatarSrc;
    if (senderName) return generateUserAvatar(senderName);
    return getDefaultAvatar();
  };

  return (
    <div style={isSent ? styles.container.sent : styles.container.received}>
      {sender === 'other' && showAvatar && (
        <Avatar
          size={theme.sizes.avatar.small}
          src={getAvatarSrc()}
          style={styles.avatar}
        />
      )}
      <div style={isSent ? styles.bubble.sent : styles.bubble.received}>
        {senderName && sender === 'other' && isGroupChat && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text style={styles.messageText}>{content}</Text>
      </div>
    </div>
  );
};
