import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MessageBubble } from '@/ui/components/molecules/MessageBubble';

// Mock avatar utilities
vi.mock('@/utils/avatar', () => ({
  generateUserAvatar: vi.fn((name: string) => `https://avatar.com/${name}`),
  getDefaultAvatar: vi.fn(() => 'https://avatar.com/default'),
}));

describe('MessageBubble', () => {
  describe('Rendering', () => {
    it('should render message content', () => {
      render(<MessageBubble content='Hello World' sender='me' />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should render with string content', () => {
      render(<MessageBubble content='Test message' sender='other' />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render with ReactNode content', () => {
      render(
        <MessageBubble
          content={<div data-testid='custom-content'>Custom Content</div>}
          sender='me'
        />
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Sender Types', () => {
    it('should render as sent message when sender is "me"', () => {
      const { container } = render(
        <MessageBubble content='My message' sender='me' />
      );

      const bubble = container.querySelector('[style*="flex-end"]');
      expect(bubble).toBeInTheDocument();
    });

    it('should render as received message when sender is "other"', () => {
      const { container } = render(
        <MessageBubble content='Their message' sender='other' />
      );

      const bubble = container.querySelector('[style*="flex-start"]');
      expect(bubble).toBeInTheDocument();
    });

    it('should not show avatar for sent messages', () => {
      const { container } = render(
        <MessageBubble content='My message' sender='me' showAvatar={true} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).not.toBeInTheDocument();
    });

    it('should show avatar for received messages by default', () => {
      const { container } = render(
        <MessageBubble content='Their message' sender='other' />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Avatar Handling', () => {
    it('should use provided avatarSrc', () => {
      const { container } = render(
        <MessageBubble
          content='Message'
          sender='other'
          avatarSrc='https://example.com/avatar.jpg'
        />
      );

      const avatar = container.querySelector('.ant-avatar img');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should generate avatar from sender name when avatarSrc not provided', () => {
      const { container } = render(
        <MessageBubble content='Message' sender='other' senderName='John Doe' />
      );

      const avatar = container.querySelector('.ant-avatar img');
      expect(avatar).toHaveAttribute('src', 'https://avatar.com/John Doe');
    });

    it('should use default avatar when neither avatarSrc nor senderName provided', () => {
      const { container } = render(
        <MessageBubble content='Message' sender='other' />
      );

      const avatar = container.querySelector('.ant-avatar img');
      expect(avatar).toHaveAttribute('src', 'https://avatar.com/default');
    });

    it('should not show avatar when showAvatar is false', () => {
      const { container } = render(
        <MessageBubble content='Message' sender='other' showAvatar={false} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).not.toBeInTheDocument();
    });
  });

  describe('Sender Name Display', () => {
    it('should show sender name in group chat for received messages', () => {
      render(
        <MessageBubble
          content='Message'
          sender='other'
          senderName='John Doe'
          isGroupChat={true}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should not show sender name for sent messages', () => {
      render(
        <MessageBubble
          content='Message'
          sender='me'
          senderName='My Name'
          isGroupChat={true}
        />
      );

      expect(screen.queryByText('My Name')).not.toBeInTheDocument();
    });

    it('should not show sender name in non-group chat', () => {
      render(
        <MessageBubble
          content='Message'
          sender='other'
          senderName='John Doe'
          isGroupChat={false}
        />
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should not show sender name when not provided', () => {
      const { container } = render(
        <MessageBubble content='Message' sender='other' isGroupChat={true} />
      );

      const senderNameElements = container.querySelectorAll('.ant-typography');
      // Should only have message text, not sender name
      expect(senderNameElements.length).toBeGreaterThan(0);
    });
  });

  describe('Group Chat Behavior', () => {
    it('should default to group chat mode', () => {
      render(
        <MessageBubble content='Message' sender='other' senderName='John Doe' />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle group chat explicitly set to true', () => {
      render(
        <MessageBubble
          content='Message'
          sender='other'
          senderName='Jane Doe'
          isGroupChat={true}
        />
      );

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('should handle one-on-one chat', () => {
      render(
        <MessageBubble
          content='Message'
          sender='other'
          senderName='Jane Doe'
          isGroupChat={false}
        />
      );

      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together for sent message', () => {
      render(
        <MessageBubble
          content='My message'
          sender='me'
          senderName='My Name'
          showAvatar={true}
          avatarSrc='https://example.com/me.jpg'
          isGroupChat={true}
        />
      );

      expect(screen.getByText('My message')).toBeInTheDocument();
      expect(screen.queryByText('My Name')).not.toBeInTheDocument();
    });

    it('should handle all props together for received message', () => {
      render(
        <MessageBubble
          content='Their message'
          sender='other'
          senderName='John Doe'
          showAvatar={true}
          avatarSrc='https://example.com/john.jpg'
          isGroupChat={true}
        />
      );

      expect(screen.getByText('Their message')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle minimal props', () => {
      render(<MessageBubble content='Simple message' sender='me' />);

      expect(screen.getByText('Simple message')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content string', () => {
      const { container } = render(<MessageBubble content='' sender='me' />);

      const messageWrapper = container.querySelector('[style*="flex-end"]');
      expect(messageWrapper).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      render(<MessageBubble content={longContent} sender='me' />);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      const specialChars = '<>&"\'';
      render(<MessageBubble content={specialChars} sender='me' />);

      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });

    it('should handle empty sender name', () => {
      render(
        <MessageBubble
          content='Message'
          sender='other'
          senderName=''
          isGroupChat={true}
        />
      );

      expect(screen.getByText('Message')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply different styles for sent vs received messages', () => {
      const { container: sentContainer } = render(
        <MessageBubble content='Sent' sender='me' />
      );

      const { container: receivedContainer } = render(
        <MessageBubble content='Received' sender='other' />
      );

      const sentWrapper = sentContainer.querySelector('[style*="flex-end"]');
      const receivedWrapper = receivedContainer.querySelector(
        '[style*="flex-start"]'
      );

      expect(sentWrapper).toBeInTheDocument();
      expect(receivedWrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render content as text for screen readers', () => {
      render(<MessageBubble content='Accessible message' sender='me' />);

      const message = screen.getByText('Accessible message');
      expect(message).toBeVisible();
    });

    it('should have avatar for received messages', () => {
      const { container } = render(
        <MessageBubble content='Message' sender='other' />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeVisible();
    });
  });
});
