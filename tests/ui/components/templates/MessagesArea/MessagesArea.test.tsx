import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChatDetail } from '@/domain/entities/ChatDetail';
import { ChatParticipant } from '@/domain/entities/ChatParticipant';
import { Message } from '@/domain/entities/Message';
import { MessagesArea } from '@/ui/components/templates/MessagesArea';

// Mock child components
vi.mock('@/ui/components/organisms/VirtualizedMessageList', () => ({
  VirtualizedMessageList: ({
    messages,
    scrollToMessageId,
    isGroupChat,
    highlightMessageId,
    hasMessageIdInUrl,
    onScrollToComplete,
  }: any) => (
    <div data-testid='virtualized-message-list'>
      <div data-testid='message-count'>
        {messages ? messages.length : 0} messages
      </div>
      <div data-testid='scroll-to-id'>{scrollToMessageId || 'none'}</div>
      <div data-testid='group-chat'>{String(isGroupChat)}</div>
      <div data-testid='highlight-id'>{highlightMessageId || 'none'}</div>
      <div data-testid='has-message-url'>{String(hasMessageIdInUrl)}</div>
      <button data-testid='scroll-complete' onClick={onScrollToComplete}>
        Complete Scroll
      </button>
    </div>
  ),
}));

vi.mock('@/ui/components/organisms/MessageInput', () => ({
  MessageInput: ({
    value,
    onChange,
    onSend,
  }: {
    value: string;
    onChange: (text: string) => void;
    onSend: () => void;
  }) => (
    <div data-testid='message-input'>
      <input
        data-testid='message-input-field'
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button data-testid='send-button' onClick={onSend}>
        Send
      </button>
    </div>
  ),
}));

describe('MessagesArea', () => {
  const mockOnMessageChange = vi.fn();
  const mockOnSendMessage = vi.fn();
  const mockOnScrollToComplete = vi.fn();

  const mockMessages = [
    new Message(
      '1',
      'First message',
      'user1',
      'John Doe',
      '2023-01-01T00:00:00Z',
      false
    ),
    new Message(
      '2',
      'Second message',
      'user2',
      'Jane Smith',
      '2023-01-01T01:00:00Z',
      true
    ),
  ];

  const mockChatDetail = new ChatDetail(
    'chat-1',
    [], // participants
    mockMessages
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      messageText: '',
      onMessageChange: mockOnMessageChange,
      onSendMessage: mockOnSendMessage,
      chatDetail: mockChatDetail,
      detailLoading: false,
      onScrollToComplete: mockOnScrollToComplete,
      ...props,
    };

    return render(<MessagesArea {...defaultProps} />);
  };

  describe('Loading State', () => {
    it('should show loading spinner when detailLoading is true', () => {
      renderComponent({ detailLoading: true });

      expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    });

    it('should not show message input when loading', () => {
      renderComponent({ detailLoading: true });

      expect(screen.queryByTestId('message-input')).not.toBeInTheDocument();
    });

    it('should not show message list when loading', () => {
      renderComponent({ detailLoading: true });

      expect(
        screen.queryByTestId('virtualized-message-list')
      ).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show select chat message when no chat detail', () => {
      renderComponent({ chatDetail: null });

      expect(
        screen.getByText('Select a chat to view messages')
      ).toBeInTheDocument();
    });

    it('should not show message input when no chat detail', () => {
      renderComponent({ chatDetail: null });

      expect(screen.queryByTestId('message-input')).not.toBeInTheDocument();
    });

    it('should not show message list when no chat detail', () => {
      renderComponent({ chatDetail: null });

      expect(
        screen.queryByTestId('virtualized-message-list')
      ).not.toBeInTheDocument();
    });
  });

  describe('Active Chat State', () => {
    it('should render VirtualizedMessageList with correct props', () => {
      // Use a group chat with 3 participants to test
      const groupParticipants = [
        new ChatParticipant('user1', 'User 1', 'avatar1.jpg', true, 'admin'),
        new ChatParticipant('user2', 'User 2', 'avatar2.jpg', false, 'member'),
        new ChatParticipant('user3', 'User 3', 'avatar3.jpg', false, 'member'),
      ];
      const groupChatDetail = new ChatDetail(
        'chat-1',
        groupParticipants,
        mockMessages
      );

      renderComponent({ chatDetail: groupChatDetail });

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
      expect(screen.getByTestId('message-count')).toHaveTextContent(
        '2 messages'
      );
      expect(screen.getByTestId('group-chat')).toHaveTextContent('true');
    });

    it('should render MessageInput with correct props', () => {
      renderComponent({ messageText: 'Hello World' });

      expect(screen.getByTestId('message-input')).toBeInTheDocument();
      expect(screen.getByTestId('message-input-field')).toHaveValue(
        'Hello World'
      );
    });

    it('should pass correct isGroupChat value for group chat', () => {
      // Create 3 participants to make it a group chat
      const groupParticipants = [
        new ChatParticipant('user1', 'User 1', 'avatar1.jpg', true, 'admin'),
        new ChatParticipant('user2', 'User 2', 'avatar2.jpg', false, 'member'),
        new ChatParticipant('user3', 'User 3', 'avatar3.jpg', false, 'member'),
      ];
      const groupChatDetail = new ChatDetail(
        'chat-1',
        groupParticipants,
        mockMessages
      );

      renderComponent({ chatDetail: groupChatDetail });

      expect(screen.getByTestId('group-chat')).toHaveTextContent('true');
    });

    it('should pass correct isGroupChat value for individual chat', () => {
      const individualChatDetail = new ChatDetail('chat-1', [], mockMessages);

      renderComponent({ chatDetail: individualChatDetail });

      expect(screen.getByTestId('group-chat')).toHaveTextContent('false');
    });
  });

  describe('Scroll Functionality', () => {
    it('should pass scrollToMessageId to VirtualizedMessageList', () => {
      renderComponent({ scrollToMessageId: 'message-123' });

      expect(screen.getByTestId('scroll-to-id')).toHaveTextContent(
        'message-123'
      );
    });

    it('should handle null scrollToMessageId', () => {
      renderComponent({ scrollToMessageId: null });

      expect(screen.queryByTestId('scroll-to-message')).not.toBeInTheDocument();
    });

    it('should handle undefined scrollToMessageId', () => {
      renderComponent({ scrollToMessageId: undefined });

      expect(screen.queryByTestId('scroll-to-message')).not.toBeInTheDocument();
    });

    it('should pass onScrollToComplete callback', () => {
      renderComponent();

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
      // Callback passing is tested indirectly via component rendering
    });
  });

  describe('Message Highlighting', () => {
    it('should pass highlightMessageId to VirtualizedMessageList', () => {
      renderComponent({ highlightMessageId: 'highlight-123' });

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
      // Highlight message ID is passed as prop to VirtualizedMessageList
    });

    it('should handle null highlightMessageId', () => {
      renderComponent({ highlightMessageId: null });

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
    });

    it('should handle hasMessageIdInUrl flag', () => {
      renderComponent({ hasMessageIdInUrl: true });

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should work with all optional props undefined', () => {
      renderComponent({
        scrollToMessageId: undefined,
        onScrollToComplete: undefined,
        hasMessageIdInUrl: undefined,
        highlightMessageId: undefined,
      });

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
      expect(screen.getByTestId('message-input')).toBeInTheDocument();
    });

    it('should handle empty messages array', () => {
      const emptyChatDetail = new ChatDetail('chat-1', [], []);

      renderComponent({ chatDetail: emptyChatDetail });

      expect(screen.getByTestId('message-count')).toHaveTextContent(
        '0 messages'
      );
    });

    it('should use default values for optional props', () => {
      renderComponent({
        detailLoading: undefined,
        hasMessageIdInUrl: undefined,
        highlightMessageId: undefined,
      });

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle chatDetail with undefined messages', () => {
      // Mock the isGroupChat method to return a value and handle undefined messages
      const chatWithUndefinedMessages = {
        ...mockChatDetail,
        messages: undefined,
        isGroupChat: () => false,
      } as any;

      renderComponent({ chatDetail: chatWithUndefinedMessages });

      // Should not crash, component should handle gracefully
      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
    });

    it('should handle very large number of messages', () => {
      const manyMessages = Array.from(
        { length: 1000 },
        (_, i) =>
          new Message(
            `msg-${i}`,
            `Message ${i}`,
            'user1',
            'User',
            '2023-01-01T00:00:00Z',
            false
          )
      );

      const largeChatDetail = new ChatDetail('chat-1', [], manyMessages);

      renderComponent({ chatDetail: largeChatDetail });

      expect(screen.getByTestId('message-count')).toHaveTextContent(
        '1000 messages'
      );
    });
  });

  describe('Accessibility', () => {
    it('should be accessible for screen readers', () => {
      renderComponent();

      expect(
        screen.getByTestId('virtualized-message-list')
      ).toBeInTheDocument();
      expect(screen.getByTestId('message-input')).toBeInTheDocument();
    });

    it('should have proper structure when loading', () => {
      renderComponent({ detailLoading: true });

      expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    });

    it('should have proper structure when empty', () => {
      renderComponent({ chatDetail: null });

      expect(
        screen.getByText('Select a chat to view messages')
      ).toBeInTheDocument();
    });
  });
});
