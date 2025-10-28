import { Spin, Typography } from 'antd';

import { MessageBubble } from '../../molecules/MessageBubble';
import { MessageInput } from '../../organisms/MessageInput';

import { styles } from './styles';

import type { ChatDetail } from '@/domain/entities/ChatDetail';

const { Text } = Typography;

interface MessagesAreaProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  chatDetail?: ChatDetail | null;
  detailLoading?: boolean;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({
  messageText,
  onMessageChange,
  onSendMessage,
  chatDetail,
  detailLoading = false,
}) => {
  if (detailLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <Spin size='large' />
        </div>
      </div>
    );
  }

  if (!chatDetail) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <Text style={styles.unreadText}>Select a chat to view messages</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.unreadHeader}>
          <Text style={styles.unreadText}>Unread messages</Text>
        </div>

        {chatDetail.messages.map(message => (
          <MessageBubble
            key={message.id}
            content={message.text}
            sender={message.isFromMe ? 'me' : 'other'}
            senderName={message.senderName}
            showAvatar={!message.isFromMe}
          />
        ))}
      </div>

      {/* Message Input */}
      <MessageInput
        value={messageText}
        onChange={onMessageChange}
        onSend={onSendMessage}
      />
    </div>
  );
};
