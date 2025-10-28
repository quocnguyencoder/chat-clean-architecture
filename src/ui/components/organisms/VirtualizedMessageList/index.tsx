/**
 * Virtualized Message List Component
 *
 * Efficiently renders large lists of messages (1000+) using react-window
 * for virtual scrolling. This improves performance by only rendering
 * messages that are currently visible in the viewport.
 */

import React, { useEffect, useRef } from 'react';
import { List, type ListImperativeAPI } from 'react-window';

import { MessageBubble } from '../../molecules/MessageBubble';

import type { Message } from '@/domain/entities/Message';

interface VirtualizedMessageListProps {
  messages: Message[];
  width: number;
  height: number;
  scrollToMessageId?: string | null;
  onScrollToComplete?: () => void;
}

interface RowComponentProps {
  index: number;
  message: Message;
  isHighlighted: boolean;
}

// Fixed height for messages
const MESSAGE_HEIGHT = 80;

export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  height,
  scrollToMessageId,
  onScrollToComplete,
}) => {
  const listRef = useRef<ListImperativeAPI | null>(null);

  /**
   * Scroll to a specific message by ID
   */
  useEffect(() => {
    if (scrollToMessageId && messages.length > 0 && listRef.current) {
      const messageIndex = messages.findIndex(
        msg => msg.id === scrollToMessageId
      );

      if (messageIndex !== -1) {
        // Scroll to the message
        listRef.current.scrollToRow({
          index: messageIndex,
          align: 'center',
          behavior: 'smooth',
        });

        // Notify parent that scroll is complete
        if (onScrollToComplete) {
          setTimeout(() => {
            onScrollToComplete();
          }, 300); // Give time for scroll animation
        }
      }
    }
  }, [scrollToMessageId, messages, onScrollToComplete]);

  /**
   * Scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (messages.length > 0 && listRef.current && !scrollToMessageId) {
      // Scroll to last message
      listRef.current.scrollToRow({
        index: messages.length - 1,
        align: 'end',
        behavior: 'auto',
      });
    }
  }, [messages.length, scrollToMessageId]);

  /**
   * Row renderer for each message
   */
  const RowComponent = ({
    index: _index,
    message,
    isHighlighted,
  }: RowComponentProps): React.ReactElement => {
    return (
      <div
        style={{
          padding: '8px 16px',
          transition: isHighlighted ? 'background-color 0.3s ease' : 'none',
          backgroundColor: isHighlighted
            ? 'rgba(24, 144, 255, 0.1)'
            : 'transparent',
        }}
      >
        <MessageBubble
          content={message.text}
          sender={message.isFromMe ? 'me' : 'other'}
          senderName={message.senderName}
          showAvatar={!message.isFromMe}
        />
      </div>
    );
  };

  return (
    <List
      listRef={listRef}
      defaultHeight={height}
      rowCount={messages.length}
      rowHeight={MESSAGE_HEIGHT}
      overscanCount={5}
      rowComponent={({ index }) => {
        const message = messages[index];
        const isHighlighted = scrollToMessageId === message.id;
        return (
          <RowComponent
            index={index}
            message={message}
            isHighlighted={isHighlighted}
          />
        );
      }}
      rowProps={{}}
    />
  );
};
