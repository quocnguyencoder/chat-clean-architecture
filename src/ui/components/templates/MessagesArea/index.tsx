import { Spin, Typography } from 'antd';

import { MessageInput } from '../../organisms/MessageInput';
import { VirtualizedMessageList } from '../../organisms/VirtualizedMessageList';

import { styles } from './styles';

import type { ChatDetail } from '@/domain/entities/ChatDetail';

const { Text } = Typography;

interface MessagesAreaProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  chatDetail?: ChatDetail | null;
  detailLoading?: boolean;
  scrollToMessageId?: string | null;
  onScrollToComplete?: () => void;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({
  messageText,
  onMessageChange,
  onSendMessage,
  chatDetail,
  detailLoading = false,
  scrollToMessageId,
  onScrollToComplete,
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

  const isGroupChat = chatDetail.isGroupChat();

  return (
    <div style={styles.container}>
      <div style={styles.virtualizedContainer}>
        <div style={styles.virtualizedHeader}>
          <Text style={styles.unreadText}>Unread messages</Text>
        </div>
        <div style={styles.virtualizedListWrapper}>
          <VirtualizedMessageList
            messages={chatDetail.messages}
            scrollToMessageId={scrollToMessageId || null}
            onScrollToComplete={onScrollToComplete}
            isGroupChat={isGroupChat}
          />
        </div>
      </div>

      {/* Message Input */}
      <div style={styles.inputContainer}>
        <MessageInput
          value={messageText}
          onChange={onMessageChange}
          onSend={onSendMessage}
        />
      </div>
    </div>
  );
};
