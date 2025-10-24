import { Typography } from 'antd';

import { MessageBubble } from '../../molecules/MessageBubble';
import { MessageInput } from '../../organisms/MessageInput';

import {
  getMessagesContainerStyles,
  getMessagesContentStyles,
  getUnreadHeaderStyles,
  getUnreadTextStyles,
} from './styles';

import { mockMessages } from '@/data/mockData';
import type { Message } from '@/types/chat';

const { Text } = Typography;

interface MessagesAreaProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({
  messageText,
  onMessageChange,
  onSendMessage,
}) => {
  return (
    <div style={getMessagesContainerStyles()}>
      <div style={getMessagesContentStyles()}>
        <div style={getUnreadHeaderStyles()}>
          <Text style={getUnreadTextStyles()}>Unread messages</Text>
        </div>

        {mockMessages.map((message: Message) => (
          <MessageBubble
            key={message.id}
            content={message.text}
            sender={message.sender}
            senderName={message.senderName}
            showAvatar={message.sender === 'other'}
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
