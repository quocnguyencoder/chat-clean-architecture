import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Message } from '@/domain/entities/Message';
import { SearchConversationModal } from '@/ui/components/organisms/SearchConversationModal';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock timeFormatter
vi.mock('@/utils/timeFormatter', () => ({
  formatRelativeTime: vi.fn((time: string) => `formatted-${time}`),
}));

// Wrapper component for react-router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('SearchConversationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnMessageClick = vi.fn();

  const mockMessages = [
    new Message(
      '1',
      'Hello world, this is a test message',
      'user1',
      'John Doe',
      '2023-01-01T00:00:00Z',
      false
    ),
    new Message(
      '2',
      'Another message with different content',
      'user2',
      'Jane Smith',
      '2023-01-01T01:00:00Z',
      true
    ),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderModal = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: mockOnClose,
      messages: mockMessages,
      chatId: 'chat-123',
      onMessageClick: mockOnMessageClick,
      ...props,
    };

    return render(
      <RouterWrapper>
        <SearchConversationModal {...defaultProps} />
      </RouterWrapper>
    );
  };

  describe('Rendering', () => {
    it('should render modal when open', () => {
      renderModal();

      expect(screen.getByText('Search in conversation')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search messages...')
      ).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      renderModal({ open: false });

      expect(
        screen.queryByText('Search in conversation')
      ).not.toBeInTheDocument();
    });

    it('should render search input with placeholder', () => {
      renderModal();

      const searchInput = screen.getByPlaceholderText('Search messages...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Search Input', () => {
    it('should update search input value', () => {
      renderModal();

      const searchInput = screen.getByPlaceholderText('Search messages...');
      fireEvent.change(searchInput, { target: { value: 'hello' } });

      expect(searchInput).toHaveValue('hello');
    });

    it('should not show results for empty search initially', () => {
      renderModal();

      expect(screen.queryByText(/results? found/)).not.toBeInTheDocument();
      expect(screen.queryByText('No messages found')).not.toBeInTheDocument();
    });
  });

  describe('Modal Controls', () => {
    it('should close modal when close button is clicked', () => {
      renderModal();

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Props Handling', () => {
    it('should handle different chatId values', () => {
      renderModal({ chatId: 'different-chat' });

      expect(screen.getByText('Search in conversation')).toBeInTheDocument();
    });

    it('should handle empty messages array', () => {
      renderModal({ messages: [] });

      const searchInput = screen.getByPlaceholderText('Search messages...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should work without onMessageClick prop', () => {
      renderModal({ onMessageClick: undefined });

      expect(screen.getByText('Search in conversation')).toBeInTheDocument();
    });
  });

  describe('Chat ID Changes', () => {
    it('should clear search when chatId changes', () => {
      const { rerender } = renderModal();

      const searchInput = screen.getByPlaceholderText('Search messages...');
      fireEvent.change(searchInput, { target: { value: 'hello' } });

      // Change chatId
      rerender(
        <RouterWrapper>
          <SearchConversationModal
            open={true}
            onClose={mockOnClose}
            messages={mockMessages}
            chatId='different-chat'
            onMessageClick={mockOnMessageClick}
          />
        </RouterWrapper>
      );

      const newSearchInput = screen.getByPlaceholderText('Search messages...');
      expect(newSearchInput).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      renderModal();

      expect(screen.getByText('Search in conversation')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search messages...')
      ).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      renderModal();

      const searchInput = screen.getByPlaceholderText('Search messages...');

      // Should be focusable
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });
  });
});
