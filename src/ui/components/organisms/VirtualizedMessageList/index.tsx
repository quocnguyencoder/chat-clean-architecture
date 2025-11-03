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
import {
  formatTimestampHeader,
  shouldShowTimestamp,
} from '@/utils/messageTimestamp';

interface MessageWithTimestamp {
  type: 'message' | 'timestamp';
  message?: Message;
  timestamp?: string;
  index: number; // Original message index for cache
}

interface VirtualizedMessageListProps {
  messages: Message[];
  scrollToMessageId?: string | null;
  onScrollToComplete?: () => void;
  isGroupChat?: boolean;
  hasMessageIdInUrl?: boolean;
  highlightMessageId?: string | null;
}

export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  scrollToMessageId,
  onScrollToComplete,
  isGroupChat = true,
  hasMessageIdInUrl = false,
  highlightMessageId = null,
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

  // Create array of messages with timestamp headers
  const messagesWithTimestamps = useMemo(() => {
    const result: MessageWithTimestamp[] = [];

    messages.forEach((message, index) => {
      const previousMessage = index > 0 ? messages[index - 1] : null;

      if (shouldShowTimestamp(message, previousMessage)) {
        result.push({
          type: 'timestamp',
          timestamp: formatTimestampHeader(message.time),
          index,
        });
      }

      result.push({
        type: 'message',
        message,
        index,
      });
    });

    return result;
  }, [messages]);

  /**
   * Scroll to a specific message by ID
   */
  useEffect(() => {
    if (scrollToMessageId && messages.length > 0 && listRef.current) {
      // Find the index in the messagesWithTimestamps array
      const rowIndex = messagesWithTimestamps.findIndex(
        item =>
          item.type === 'message' && item.message?.id === scrollToMessageId
      );

      if (rowIndex !== -1) {
        // First scroll to the row to ensure it's visible
        listRef.current.scrollToRow(rowIndex);

        // Then adjust to center it
        setTimeout(() => {
          if (listRef.current && listRef.current.Grid) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const grid = listRef.current.Grid as any;
            const clientHeight = grid.props.height || 600;
            const rowHeight = cache.rowHeight({ index: rowIndex });
            const currentScrollTop = grid.state.scrollTop || 0;

            // Calculate offset to center the message
            const messageHeight =
              typeof rowHeight === 'number' ? rowHeight : 100;
            const centeredScrollTop =
              currentScrollTop - (clientHeight / 2 - messageHeight / 2);

            grid.scrollToPosition({
              scrollTop: Math.max(0, centeredScrollTop),
            });
          }
        }, 100);

        // Notify parent that scroll is complete
        if (onScrollToComplete) {
          setTimeout(() => {
            onScrollToComplete();
          }, 400); // Give time for scroll animation
        }
      }
    }
  }, [
    scrollToMessageId,
    messages,
    onScrollToComplete,
    cache,
    messagesWithTimestamps,
  ]);

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
      !hasMessageIdInUrl &&
      !hasScrolledToBottomRef.current
    ) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToRow(messagesWithTimestamps.length - 1);
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
      !hasMessageIdInUrl &&
      previousMessageCountRef.current > 0 &&
      messages.length > previousMessageCountRef.current
    ) {
      // New message added, scroll to bottom
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToRow(messagesWithTimestamps.length - 1);
        }
      }, 100);
    }

    // Update previous count
    previousMessageCountRef.current = messages.length;
  }, [
    messages.length,
    scrollToMessageId,
    hasMessageIdInUrl,
    messagesWithTimestamps.length,
  ]);

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
   * Row renderer for each message or timestamp
   */
  const rowRenderer = ({ index, key, style, parent }: ListRowProps) => {
    const item = messagesWithTimestamps[index];

    if (item.type === 'timestamp') {
      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          <div style={{ ...style, ...styles.timestampRow }}>
            <div style={styles.timestampText}>{item.timestamp}</div>
          </div>
        </CellMeasurer>
      );
    }

    const message = item.message!;
    const isHighlighted = highlightMessageId === message.id;

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
            rowCount={messagesWithTimestamps.length}
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
