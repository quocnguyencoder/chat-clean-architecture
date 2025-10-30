import { Spin, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { MessageBubble } from '../../molecules/MessageBubble';
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

// Threshold for using virtualized list (number of messages)
const VIRTUALIZATION_THRESHOLD = 100;

export const MessagesArea: React.FC<MessagesAreaProps> = ({
  messageText,
  onMessageChange,
  onSendMessage,
  chatDetail,
  detailLoading = false,
  scrollToMessageId,
  onScrollToComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Measure container size for virtualized list
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

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

  const useVirtualization =
    chatDetail.messages.length >= VIRTUALIZATION_THRESHOLD;

  const isGroupChat = chatDetail.isGroupChat();

  return (
    <div style={styles.container}>
      <div ref={containerRef} style={styles.content}>
        <div style={styles.unreadHeader}>
          <Text style={styles.unreadText}>Unread messages</Text>
        </div>

        {useVirtualization && containerSize.height > 0 ? (
          <VirtualizedMessageList
            messages={chatDetail.messages}
            width={containerSize.width}
            height={containerSize.height - 50} // Subtract header height
            scrollToMessageId={scrollToMessageId || null}
            onScrollToComplete={onScrollToComplete}
            isGroupChat={isGroupChat}
          />
        ) : (
          <>
            {chatDetail.messages.map(message => (
              <MessageBubble
                key={message.id}
                content={message.text}
                sender={message.isFromMe ? 'me' : 'other'}
                senderName={message.senderName}
                showAvatar={!message.isFromMe}
                isGroupChat={isGroupChat}
              />
            ))}
          </>
        )}
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
