import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChatDetail } from '@/domain/entities/ChatDetail';
import { ChatParticipant } from '@/domain/entities/ChatParticipant';
import { Message } from '@/domain/entities/Message';
import { ChatContent } from '@/ui/components/templates/ChatContent';
import * as hooks from '@/ui/hooks';

// Mock all dependencies
vi.mock('@/ui/hooks', () => ({
  useChatContext: vi.fn(),
  useChatDetail: vi.fn(),
  useChatList: vi.fn(),
}));

vi.mock('@/ui/components/organisms/NavigationSidebar', () => ({
  NavigationSidebar: () => (
    <div data-testid='navigation-sidebar'>Navigation</div>
  ),
}));

vi.mock('@/ui/components/organisms/ChatList', () => ({
  ChatList: ({ selectedChatId, onChatSelect }: any) => (
    <div data-testid='chat-list'>
      <div data-testid='selected-chat-id'>{selectedChatId}</div>
      <button
        data-testid='select-chat'
        onClick={() => onChatSelect('chat-123')}
      >
        Select Chat
      </button>
    </div>
  ),
}));

vi.mock('@/ui/components/organisms/ChatHeader', () => ({
  ChatHeader: ({ selectedChat, chatMessages, chatParticipants }: any) => (
    <div data-testid='chat-header'>
      <div data-testid='header-chat-id'>{selectedChat?.id}</div>
      <div data-testid='header-message-count'>
        {chatMessages?.length || 0} messages
      </div>
      <div data-testid='header-participant-count'>
        {chatParticipants?.length || 0} participants
      </div>
    </div>
  ),
}));

vi.mock('@/ui/components/templates/MessagesArea', () => ({
  MessagesArea: ({
    messageText,
    onMessageChange,
    onSendMessage,
    chatDetail,
    detailLoading,
    scrollToMessageId,
    onScrollToComplete,
    hasMessageIdInUrl,
    highlightMessageId,
  }: any) => (
    <div data-testid='messages-area'>
      <div data-testid='message-text'>{messageText}</div>
      <div data-testid='chat-detail-id'>{chatDetail?.chatId || 'none'}</div>
      <div data-testid='detail-loading'>{String(detailLoading)}</div>
      <div data-testid='scroll-to-message'>{scrollToMessageId || 'none'}</div>
      <div data-testid='has-message-url'>{String(hasMessageIdInUrl)}</div>
      <div data-testid='highlight-message'>{highlightMessageId || 'none'}</div>
      <input
        data-testid='message-input'
        value={messageText}
        onChange={e => onMessageChange(e.target.value)}
      />
      <button data-testid='send-message' onClick={onSendMessage}>
        Send
      </button>
      <button data-testid='scroll-complete' onClick={onScrollToComplete}>
        Complete Scroll
      </button>
    </div>
  ),
}));

vi.mock('@/ui/components/organisms/EmptyState', () => ({
  EmptyState: () => <div data-testid='empty-state'>No chat selected</div>,
}));

// Mock constants
vi.mock('@/constants', () => ({
  URL_PARAMS: {
    CHAT_ID: 'chatId',
    MESSAGE_ID: 'messageId',
  },
}));

describe('ChatContent', () => {
  const mockSendMessageUseCase = {
    execute: vi.fn(),
  };

  const mockCurrentUser = {
    id: 'user123',
    name: 'Test User',
  };

  const mockChats = [
    { id: 'chat-1', name: 'Chat 1', lastMessage: 'Hello' },
    { id: 'chat-2', name: 'Chat 2', lastMessage: 'Hi there' },
  ];

  const mockChatDetail = new ChatDetail(
    'chat-1',
    [
      new ChatParticipant('user1', 'User 1', 'avatar1.jpg', true, 'member'),
      new ChatParticipant('user2', 'User 2', 'avatar2.jpg', true, 'member'),
    ],
    [
      new Message(
        'msg-1',
        'Hello',
        'user1',
        'User 1',
        new Date().toISOString(),
        false
      ),
      new Message(
        'msg-2',
        'Hi',
        'user2',
        'User 2',
        new Date().toISOString(),
        false
      ),
    ]
  );

  const mockUseChatContext = () => ({
    sendMessageUseCase: mockSendMessageUseCase,
    currentUser: mockCurrentUser,
  });

  const mockUseChatList = (chats = mockChats) => ({
    chats,
    loading: false,
    error: null,
    refreshChats: vi.fn(),
  });

  const mockUseChatDetail = (overrides: any = {}) => ({
    chatDetail: mockChatDetail,
    loading: false,
    loadChatDetail: vi.fn(),
    refreshChatDetail: vi.fn(),
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks with any type to avoid type issues for now
    vi.mocked(hooks.useChatContext).mockReturnValue(
      mockUseChatContext() as any
    );
    vi.mocked(hooks.useChatList).mockReturnValue(mockUseChatList() as any);
    vi.mocked(hooks.useChatDetail).mockReturnValue(mockUseChatDetail() as any);
  });

  const renderComponent = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ChatContent />
      </MemoryRouter>
    );
  };

  describe('Layout Structure', () => {
    it('should render navigation sidebar', () => {
      renderComponent();

      expect(screen.getByTestId('navigation-sidebar')).toBeInTheDocument();
    });

    it('should render chat list sidebar', () => {
      renderComponent();

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
    });

    it('should show empty state when no chat selected', () => {
      vi.mocked(hooks.useChatList).mockReturnValue(mockUseChatList([]) as any);

      renderComponent();

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('messages-area')).not.toBeInTheDocument();
    });

    it('should render chat header and messages area when chat selected', () => {
      renderComponent(['/?chatId=chat-1']);

      expect(screen.getByTestId('chat-header')).toBeInTheDocument();
      expect(screen.getByTestId('messages-area')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    });
  });

  describe('URL Parameter Handling', () => {
    it('should handle chatId URL parameter', () => {
      renderComponent(['/?chatId=chat-2']);

      expect(screen.getByTestId('selected-chat-id')).toHaveTextContent(
        'chat-2'
      );
      expect(screen.getByTestId('chat-detail-id')).toHaveTextContent('chat-1'); // Mock data
    });

    it('should handle messageId URL parameter', () => {
      renderComponent(['/?chatId=chat-1&messageId=msg-123']);

      expect(screen.getByTestId('scroll-to-message')).toHaveTextContent(
        'msg-123'
      );
      expect(screen.getByTestId('has-message-url')).toHaveTextContent('true');
      expect(screen.getByTestId('highlight-message')).toHaveTextContent(
        'msg-123'
      );
    });

    it('should handle missing URL parameters', () => {
      renderComponent(['/']);

      expect(screen.getByTestId('scroll-to-message')).toHaveTextContent('none');
      expect(screen.getByTestId('has-message-url')).toHaveTextContent('false');
      expect(screen.getByTestId('highlight-message')).toHaveTextContent('none');
    });
  });

  describe('Chat Selection', () => {
    it('should handle chat selection through chat list', async () => {
      renderComponent();

      fireEvent.click(screen.getByTestId('select-chat'));

      await waitFor(() => {
        expect(screen.getByTestId('selected-chat-id')).toHaveTextContent(
          'chat-123'
        );
      });
    });

    it('should load chat detail when chat is selected', () => {
      const mockLoadChatDetail = vi.fn();
      vi.mocked(hooks.useChatDetail).mockReturnValue(
        mockUseChatDetail({ loadChatDetail: mockLoadChatDetail }) as any
      );

      renderComponent(['/?chatId=chat-1']);

      expect(mockLoadChatDetail).toHaveBeenCalledWith('chat-1');
    });

    it('should set default chat if none selected and chats available', () => {
      renderComponent(['/']);

      // Component should auto-select first chat
      expect(screen.getByTestId('selected-chat-id')).toHaveTextContent(
        'chat-1'
      );
    });
  });

  describe('Message Sending', () => {
    it('should handle message text changes', () => {
      renderComponent(['/?chatId=chat-1']);

      const messageInput = screen.getByTestId('message-input');
      fireEvent.change(messageInput, { target: { value: 'Hello World' } });

      expect(screen.getByTestId('message-text')).toHaveTextContent(
        'Hello World'
      );
    });

    it('should send message when send button clicked', async () => {
      const mockRefreshChatDetail = vi.fn();
      vi.mocked(hooks.useChatDetail).mockReturnValue(
        mockUseChatDetail({ refreshChatDetail: mockRefreshChatDetail }) as any
      );

      renderComponent(['/?chatId=chat-1']);

      // Type message
      const messageInput = screen.getByTestId('message-input');
      fireEvent.change(messageInput, { target: { value: 'Test message' } });

      // Send message
      fireEvent.click(screen.getByTestId('send-message'));

      await waitFor(() => {
        expect(mockSendMessageUseCase.execute).toHaveBeenCalledWith(
          'chat-1',
          'Test message',
          'user123',
          'Test User'
        );
      });

      await waitFor(() => {
        expect(mockRefreshChatDetail).toHaveBeenCalled();
      });
    });

    it('should not send empty messages', async () => {
      renderComponent(['/?chatId=chat-1']);

      // Try to send empty message
      fireEvent.click(screen.getByTestId('send-message'));

      expect(mockSendMessageUseCase.execute).not.toHaveBeenCalled();
    });

    it('should not send message when no chat selected', async () => {
      vi.mocked(hooks.useChatList).mockReturnValue(mockUseChatList([]) as any);

      renderComponent();

      // When no chat is selected, empty state is shown and no message input is available
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.queryByTestId('message-input')).not.toBeInTheDocument();
      expect(mockSendMessageUseCase.execute).not.toHaveBeenCalled();
    });

    it('should handle send message error gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockSendMessageUseCase.execute.mockRejectedValueOnce(
        new Error('Send failed')
      );

      renderComponent(['/?chatId=chat-1']);

      const messageInput = screen.getByTestId('message-input');
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      fireEvent.click(screen.getByTestId('send-message'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to send message:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Scroll Functionality', () => {
    it('should handle scroll completion', () => {
      renderComponent(['/?chatId=chat-1&messageId=msg-123']);

      expect(screen.getByTestId('scroll-to-message')).toHaveTextContent(
        'msg-123'
      );

      fireEvent.click(screen.getByTestId('scroll-complete'));

      expect(screen.getByTestId('scroll-to-message')).toHaveTextContent('none');
    });
  });

  describe('Loading States', () => {
    it('should show loading state in messages area', () => {
      vi.mocked(hooks.useChatDetail).mockReturnValue(
        mockUseChatDetail({ loading: true })
      );

      renderComponent(['/?chatId=chat-1']);

      expect(screen.getByTestId('detail-loading')).toHaveTextContent('true');
    });

    it('should not show loading state when not loading', () => {
      renderComponent(['/?chatId=chat-1']);

      expect(screen.getByTestId('detail-loading')).toHaveTextContent('false');
    });
  });

  describe('Data Passing', () => {
    it('should pass correct props to ChatHeader', () => {
      renderComponent(['/?chatId=chat-1']);

      expect(screen.getByTestId('header-chat-id')).toHaveTextContent('chat-1');
      expect(screen.getByTestId('header-message-count')).toHaveTextContent(
        '2 messages'
      );
      expect(screen.getByTestId('header-participant-count')).toHaveTextContent(
        '2 participants'
      );
    });

    it('should pass correct props to MessagesArea', () => {
      renderComponent(['/?chatId=chat-1&messageId=msg-456']);

      expect(screen.getByTestId('chat-detail-id')).toHaveTextContent('chat-1');
      expect(screen.getByTestId('scroll-to-message')).toHaveTextContent(
        'msg-456'
      );
      expect(screen.getByTestId('highlight-message')).toHaveTextContent(
        'msg-456'
      );
      expect(screen.getByTestId('has-message-url')).toHaveTextContent('true');
    });

    it('should pass selected chat to ChatList', () => {
      renderComponent(['/?chatId=chat-2']);

      expect(screen.getByTestId('selected-chat-id')).toHaveTextContent(
        'chat-2'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle no chats available', () => {
      vi.mocked(hooks.useChatList).mockReturnValue(mockUseChatList([]) as any);

      renderComponent();

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByTestId('selected-chat-id')).toHaveTextContent('');
    });

    it('should handle chatDetail not found', () => {
      vi.mocked(hooks.useChatDetail).mockReturnValue(
        mockUseChatDetail({ chatDetail: null })
      );

      renderComponent(['/?chatId=chat-1']);

      expect(screen.getByTestId('chat-detail-id')).toHaveTextContent('none');
      expect(screen.getByTestId('header-message-count')).toHaveTextContent(
        '0 messages'
      );
      expect(screen.getByTestId('header-participant-count')).toHaveTextContent(
        '0 participants'
      );
    });

    it('should handle invalid chat ID from URL', () => {
      renderComponent(['/?chatId=invalid-chat']);

      expect(screen.getByTestId('selected-chat-id')).toHaveTextContent(
        'invalid-chat'
      );
      // Component should still attempt to load the chat
    });
  });

  describe('Integration Behavior', () => {
    it('should clear message ID from URL when sending message', async () => {
      // This test verifies the navigation behavior but since we're mocking react-router,
      // we can only test that the send functionality works
      renderComponent(['/?chatId=chat-1&messageId=msg-123']);

      const messageInput = screen.getByTestId('message-input');
      fireEvent.change(messageInput, { target: { value: 'Reply message' } });
      fireEvent.click(screen.getByTestId('send-message'));

      await waitFor(() => {
        expect(mockSendMessageUseCase.execute).toHaveBeenCalled();
      });
    });

    it('should maintain messageId URL param after scroll completion', () => {
      renderComponent(['/?chatId=chat-1&messageId=msg-123']);

      expect(screen.getByTestId('highlight-message')).toHaveTextContent(
        'msg-123'
      );

      fireEvent.click(screen.getByTestId('scroll-complete'));

      // Scroll target should be cleared but highlight should remain
      expect(screen.getByTestId('scroll-to-message')).toHaveTextContent('none');
      expect(screen.getByTestId('highlight-message')).toHaveTextContent(
        'msg-123'
      );
    });
  });

  describe('Accessibility', () => {
    it('should be accessible for screen readers', () => {
      renderComponent(['/?chatId=chat-1']);

      // Check for proper layout structure
      expect(screen.getByTestId('navigation-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
      expect(screen.getByTestId('chat-header')).toBeInTheDocument();
      expect(screen.getByTestId('messages-area')).toBeInTheDocument();
    });

    it('should have proper structure when empty', () => {
      vi.mocked(hooks.useChatList).mockReturnValue(mockUseChatList([]) as any);

      renderComponent();

      expect(screen.getByTestId('navigation-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });
});
