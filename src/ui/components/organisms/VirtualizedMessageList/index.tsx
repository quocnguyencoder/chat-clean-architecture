/**
 * Virtualized Message List Component
 *
 * Efficiently renders large lists of messages (1000+) using react-virtualized
 * for virtual scrolling. This improves performance by only rendering
 * messages that are currently visible in the viewport.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import type { ListRowProps } from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';
import 'react-virtualized/styles.css';

import { MessageBubble } from '../../molecules/MessageBubble';

import { styles } from './styles';

import type { Message } from '@/domain/entities/Message';

interface VirtualizedMessageListProps {
  messages: Message[];
  scrollToMessageId?: string | null;
  onScrollToComplete?: () => void;
  isGroupChat?: boolean;
}

export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  scrollToMessageId,
  onScrollToComplete,
  isGroupChat = true,
}) => {
  const listRef = useRef<List | null>(null);
  const previousMessageCountRef = useRef<number>(0);
  const hasScrolledToBottomRef = useRef<boolean>(false);

  // Create cache instance once and reuse it
  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 80,
      }),
    []
  );

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
        listRef.current.scrollToRow(messageIndex);

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
   * Only scroll if messages were added (not on initial load or message updates)
   */
  useEffect(() => {
    // Initial scroll to bottom on first render
    if (
      messages.length > 0 &&
      listRef.current &&
      !scrollToMessageId &&
      !hasScrolledToBottomRef.current
    ) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToRow(messages.length - 1);
          hasScrolledToBottomRef.current = true;
          previousMessageCountRef.current = messages.length;
        }
      }, 100);
      return;
    }

    // Scroll to bottom when new messages arrive
    if (
      messages.length > 0 &&
      listRef.current &&
      !scrollToMessageId &&
      previousMessageCountRef.current > 0 &&
      messages.length > previousMessageCountRef.current
    ) {
      // New message added, scroll to bottom
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToRow(messages.length - 1);
        }
      }, 100);
    }

    // Update previous count
    previousMessageCountRef.current = messages.length;
  }, [messages.length, scrollToMessageId]);

  /**
   * Clear cache only for new messages (not all messages)
   * This prevents scroll jumping on updates
   */
  useEffect(() => {
    // Only clear cache for the last message when new one is added
    if (
      previousMessageCountRef.current > 0 &&
      messages.length > previousMessageCountRef.current
    ) {
      cache.clear(messages.length - 1, 0);
      if (listRef.current) {
        listRef.current.recomputeRowHeights(messages.length - 1);
      }
    }
  }, [messages.length, cache]);

  /**
   * Row renderer for each message
   */
  const rowRenderer = ({ index, key, style, parent }: ListRowProps) => {
    const message = messages[index];
    const isHighlighted = scrollToMessageId === message.id;

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div
          style={{
            ...style,
            ...(isHighlighted
              ? styles.messageRowHighlighted
              : styles.messageRow),
          }}
        >
          <MessageBubble
            content={message.text}
            sender={message.isFromMe ? 'me' : 'other'}
            senderName={message.senderName}
            showAvatar={!message.isFromMe}
            isGroupChat={isGroupChat}
          />
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div style={styles.fullSize}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={messages.length}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
            scrollToAlignment='start'
          />
        )}
      </AutoSizer>
    </div>
  );
};
