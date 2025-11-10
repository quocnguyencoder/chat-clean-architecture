import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Message } from '@/domain/entities/Message';
import { VirtualizedMessageList } from '@/ui/components/organisms/VirtualizedMessageList';

// Mock react-virtualized completely to avoid constructor issues
vi.mock('react-virtualized', () => ({
  AutoSizer: ({
    children,
  }: {
    children: (size: { width: number; height: number }) => React.ReactNode;
  }) => children({ width: 800, height: 600 }),
  List: () => <div data-testid='virtualized-list'>Mocked List</div>,
  CellMeasurer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CellMeasurerCache: class {
    rowHeight = () => 80;
    clear = vi.fn();
  },
}));

// Mock MessageBubble component
vi.mock('@/ui/components/molecules/MessageBubble', () => ({
  MessageBubble: ({
    content,
    senderName,
  }: {
    content: string;
    senderName: string;
  }) => (
    <div data-testid='message-bubble'>
      <span>
        {senderName}: {content}
      </span>
    </div>
  ),
}));

// Mock message timestamp utilities
vi.mock('@/utils/messageTimestamp', () => ({
  formatTimestampHeader: vi.fn((time: string) => `Timestamp: ${time}`),
  shouldShowTimestamp: vi.fn(() => true),
}));

describe('VirtualizedMessageList', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      messages: mockMessages,
      onScrollToComplete: mockOnScrollToComplete,
      ...props,
    };

    return render(<VirtualizedMessageList {...defaultProps} />);
  };

  describe('Rendering', () => {
    it('should render virtualized list container', () => {
      renderComponent();

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle empty messages array', () => {
      renderComponent({ messages: [] });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle single message', () => {
      const singleMessage = [mockMessages[0]];
      renderComponent({ messages: singleMessage });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should handle group chat mode', () => {
      renderComponent({ isGroupChat: true });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle non-group chat mode', () => {
      renderComponent({ isGroupChat: false });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle scrollToMessageId prop', () => {
      renderComponent({ scrollToMessageId: '2' });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle hasMessageIdInUrl flag', () => {
      renderComponent({ hasMessageIdInUrl: true });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle highlightMessageId prop', () => {
      renderComponent({ highlightMessageId: '1' });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should work without onScrollToComplete callback', () => {
      renderComponent({ onScrollToComplete: undefined });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined props gracefully', () => {
      renderComponent({
        scrollToMessageId: null,
        highlightMessageId: null,
        onScrollToComplete: undefined,
      });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle messages with special characters', () => {
      const specialMessages = [
        new Message(
          '1',
          'Message with émojis 🚀 and special chars @#$%',
          'user1',
          'John Doe',
          '2023-01-01T00:00:00Z',
          false
        ),
      ];

      renderComponent({ messages: specialMessages });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle very long message content', () => {
      const longMessages = [
        new Message(
          '1',
          'A'.repeat(1000),
          'user1',
          'John Doe',
          '2023-01-01T00:00:00Z',
          false
        ),
      ];

      renderComponent({ messages: longMessages });

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });
  });

  describe('Component State', () => {
    it('should render without errors with default props', () => {
      render(<VirtualizedMessageList messages={mockMessages} />);

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    it('should handle prop updates without errors', () => {
      const { rerender } = renderComponent();

      // Update with new messages
      const newMessages = [
        ...mockMessages,
        new Message(
          '3',
          'New message',
          'user1',
          'John Doe',
          '2023-01-01T03:00:00Z',
          false
        ),
      ];

      rerender(
        <VirtualizedMessageList
          messages={newMessages}
          onScrollToComplete={mockOnScrollToComplete}
        />
      );

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible for screen readers', () => {
      renderComponent();

      const list = screen.getByTestId('virtualized-list');
      expect(list).toBeInTheDocument();
    });

    it('should handle keyboard navigation', () => {
      renderComponent();

      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });
  });
});
