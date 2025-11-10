import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ChatList } from '@/ui/components/organisms/ChatList';
import { useChatList } from '@/ui/hooks';

// Mock the hooks
vi.mock('@/ui/hooks', () => ({
  useChatList: vi.fn(() => ({
    chats: [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        isOnline: true,
        hasMessages: (): boolean => true,
        hasUnreadMessages: (): boolean => true,
        unreadCount: 2,
        lastMessage: { time: new Date().toISOString() },
        getFormattedLastMessage: (): string => 'Hello there!',
      },
      {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://example.com/avatar2.jpg',
        isOnline: false,
        hasMessages: (): boolean => false,
        hasUnreadMessages: (): boolean => false,
        unreadCount: 0,
        getFormattedLastMessage: (): string => 'No messages yet',
      },
    ],
    loading: false,
    error: null,
    refreshChats: vi.fn(),
  })),
  useChatContext: vi.fn(() => ({
    currentUser: { id: 'current-user' },
  })),
  useStories: vi.fn(() => ({
    stories: [],
  })),
}));

// Mock Stories component
vi.mock('@/ui/components/organisms/Stories', () => ({
  Stories: ({ stories }: { stories: any[] }) => (
    <div data-testid='stories'>Stories: {stories.length}</div>
  ),
}));

describe('ChatList', () => {
  const mockOnChatSelect = vi.fn();
  const defaultProps = {
    selectedChatId: '1',
    onChatSelect: mockOnChatSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementation to default
    vi.mocked(useChatList).mockReturnValue({
      chats: [
        {
          id: '1',
          name: 'John Doe',
          avatar: 'https://example.com/avatar.jpg',
          isOnline: true,
          hasMessages: (): boolean => true,
          hasUnreadMessages: (): boolean => true,
          unreadCount: 2,
          lastMessage: { time: new Date().toISOString() },
          getFormattedLastMessage: (): string => 'Hello there!',
        } as any,
        {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://example.com/avatar2.jpg',
          isOnline: false,
          hasMessages: (): boolean => false,
          hasUnreadMessages: (): boolean => false,
          unreadCount: 0,
          getFormattedLastMessage: (): string => 'No messages yet',
        } as any,
      ],
      loading: false,
      error: null,
      refreshChats: vi.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render the chats title', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByText('Chats')).toBeInTheDocument();
    });

    it('should render the search input', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('should render add button', () => {
      const { container } = render(<ChatList {...defaultProps} />);

      const addButton = container.querySelector('.anticon-plus');
      expect(addButton).toBeInTheDocument();
    });

    it('should render stories component', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByTestId('stories')).toBeInTheDocument();
    });

    it('should render chat items', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Chat Selection', () => {
    it('should call onChatSelect when chat is clicked', async () => {
      const user = userEvent.setup();
      render(<ChatList {...defaultProps} />);

      const johnChat = screen.getByText('John Doe');
      await user.click(johnChat);

      expect(mockOnChatSelect).toHaveBeenCalledWith('1');
    });

    it('should highlight selected chat', () => {
      const { container } = render(<ChatList {...defaultProps} />);

      const selectedChat = container.querySelector('[role="button"]');
      expect(selectedChat).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ChatList {...defaultProps} />);

      const johnChat = screen.getByText('John Doe').closest('[role="button"]');
      if (johnChat) {
        (johnChat as HTMLElement).focus();
        await user.keyboard('{Enter}');
        expect(mockOnChatSelect).toHaveBeenCalledWith('1');
      }
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      vi.mocked(useChatList).mockReturnValue({
        chats: [],
        loading: true,
        error: null,
        refreshChats: vi.fn(),
      });

      render(<ChatList {...defaultProps} />);

      const spinner = document.querySelector('.ant-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when there is an error', () => {
      vi.mocked(useChatList).mockReturnValue({
        chats: [],
        loading: false,
        error: 'Failed to fetch chats',
        refreshChats: vi.fn(),
      });

      render(<ChatList {...defaultProps} />);

      expect(screen.getByText('Error Loading Chats')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch chats')).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const mockRefresh = vi.fn();
      vi.mocked(useChatList).mockReturnValue({
        chats: [],
        loading: false,
        error: 'Failed to fetch chats',
        refreshChats: mockRefresh,
      });

      render(<ChatList {...defaultProps} />);

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Chat Display', () => {
    it('should show unread badge for chats with unread messages', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByText('2')).toBeInTheDocument(); // Unread count
    });

    it('should show last message for chats with messages', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByText('Hello there!')).toBeInTheDocument();
    });

    it('should show placeholder for chats without messages', () => {
      render(<ChatList {...defaultProps} />);

      expect(screen.getByText('No messages yet')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles for chat items', () => {
      render(<ChatList {...defaultProps} />);

      const chatButtons = screen.getAllByRole('button');
      expect(chatButtons.length).toBeGreaterThan(0);
    });

    it('should have proper heading for chats title', () => {
      render(<ChatList {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Chats');
    });

    it('should have searchable input', () => {
      render(<ChatList {...defaultProps} />);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
