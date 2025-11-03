import { SearchOutlined } from '@ant-design/icons';
import { Input, List, Modal, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styles } from './styles';

import { URL_PARAMS } from '@/constants';
import { theme } from '@/constants/theme';
import type { Message } from '@/domain/entities/Message';
import { formatRelativeTime } from '@/utils/timeFormatter';

const { Text } = Typography;

interface SearchConversationModalProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  chatId: string;
  onMessageClick?: (message: Message) => void;
}

export const SearchConversationModal: React.FC<
  SearchConversationModalProps
> = ({ open, onClose, messages, chatId, onMessageClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clear search states when chatId changes (switching to another chat)
  useEffect(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, [chatId]);

  // Filter messages based on debounced search query
  const filteredMessages = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return [];
    }

    const query = debouncedSearchQuery.toLowerCase();
    return messages.filter(message =>
      message.text.toLowerCase().includes(query)
    );
  }, [messages, debouncedSearchQuery]);

  // Helper function to highlight matched text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={styles.highlightText}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleMessageClick = (message: Message) => {
    // Update URL with chat ID and message ID to trigger scroll
    navigate(
      `?${URL_PARAMS.CHAT_ID}=${chatId}&${URL_PARAMS.MESSAGE_ID}=${message.id}`
    );

    if (onMessageClick) {
      onMessageClick(message);
    }
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    onClose();
  };

  return (
    <Modal
      title={<span style={styles.modalTitle}>Search in conversation</span>}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      closeIcon={<span style={styles.closeIcon}>✕</span>}
      styles={{
        content: {
          backgroundColor: theme.colors.background.secondary,
          color: theme.colors.text.primary,
        },
        header: {
          backgroundColor: theme.colors.background.secondary,
          color: theme.colors.text.primary,
          borderBottom: `1px solid ${theme.colors.border}`,
        },
      }}
    >
      <div style={styles.container}>
        <Input
          placeholder='Search messages...'
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={styles.searchInput}
          styles={{
            input: {
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.background.card,
            },
          }}
          classNames={{
            input: 'search-input-placeholder',
          }}
        />

        {searchQuery.trim() && (
          <div style={styles.resultsContainer}>
            {filteredMessages.length > 0 ? (
              <>
                <Text style={styles.resultsCount}>
                  {filteredMessages.length} result
                  {filteredMessages.length !== 1 ? 's' : ''} found
                </Text>
                <List
                  dataSource={filteredMessages}
                  split={false}
                  renderItem={message => (
                    <List.Item
                      style={{
                        ...styles.messageItem,
                        ...(hoveredItemId === message.id
                          ? styles.messageItemHover
                          : {}),
                      }}
                      onClick={() => handleMessageClick(message)}
                      onMouseEnter={() => setHoveredItemId(message.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                    >
                      <div style={styles.messageContent}>
                        <Text strong style={styles.senderName}>
                          {message.senderName}
                        </Text>
                        <Text style={styles.messageText}>
                          {highlightText(message.text, debouncedSearchQuery)}
                        </Text>
                        <Text style={styles.messageTime}>
                          {formatRelativeTime(message.time)}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <div style={styles.noResults}>
                <Text style={styles.noResultsText}>No messages found</Text>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
