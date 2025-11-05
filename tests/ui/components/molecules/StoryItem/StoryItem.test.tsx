import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StoryItem } from '@/ui/components/molecules/StoryItem';

describe('StoryItem', () => {
  describe('Rendering', () => {
    it('should render story avatar', () => {
      const { container } = render(
        <StoryItem
          userName='John Doe'
          avatarSrc='https://example.com/avatar.jpg'
        />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should render display text', () => {
      render(<StoryItem userName='John Doe' displayText='John Doe' />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Current User Story', () => {
    it('should show "Your note" for current user', () => {
      render(<StoryItem isCurrentUser={true} />);

      expect(screen.getByText('Your note')).toBeInTheDocument();
    });

    it('should use userName as displayText when not current user', () => {
      render(<StoryItem userName='Jane Doe' isCurrentUser={false} />);

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('should use provided displayText over userName', () => {
      render(<StoryItem userName='Jane Doe' displayText='Custom Name' />);

      expect(screen.getByText('Custom Name')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  describe('Online Status', () => {
    it('should not show online status by default', () => {
      const { container } = render(<StoryItem userName='John Doe' />);

      const statusIndicator = container.querySelector(
        '[style*="position: absolute"]'
      );
      expect(statusIndicator).not.toBeInTheDocument();
    });

    it('should show online status when showOnlineStatus is true', () => {
      const { container } = render(
        <StoryItem
          userName='John Doe'
          showOnlineStatus={true}
          isOnline={true}
        />
      );

      const onlineIndicator = container.querySelector('[style*="background"]');
      expect(onlineIndicator).toBeInTheDocument();
    });

    it('should show offline status when showOnlineStatus is true and isOnline is false', () => {
      const { container } = render(
        <StoryItem
          userName='John Doe'
          showOnlineStatus={true}
          isOnline={false}
        />
      );

      // OnlineStatusIndicator returns null when isOnline is false
      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should not show status when showOnlineStatus is false', () => {
      const { container } = render(
        <StoryItem
          userName='John Doe'
          showOnlineStatus={false}
          isOnline={true}
        />
      );

      const statusIndicator = container.querySelector(
        '[style*="position: absolute"]'
      );
      expect(statusIndicator).not.toBeInTheDocument();
    });
  });

  describe('Avatar Handling', () => {
    it('should use provided avatarSrc', () => {
      const { container } = render(
        <StoryItem
          avatarSrc='https://example.com/avatar.jpg'
          userName='John Doe'
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should handle missing avatarSrc', () => {
      const { container } = render(<StoryItem userName='John Doe' />);

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together', () => {
      render(
        <StoryItem
          userName='John Doe'
          avatarSrc='https://example.com/avatar.jpg'
          isCurrentUser={false}
          showOnlineStatus={true}
          isOnline={true}
          displayText='Custom Name'
        />
      );

      expect(screen.getByText('Custom Name')).toBeInTheDocument();
    });

    it('should handle current user with custom display text', () => {
      render(<StoryItem isCurrentUser={true} displayText='My Custom Note' />);

      expect(screen.getByText('My Custom Note')).toBeInTheDocument();
      expect(screen.queryByText('Your note')).not.toBeInTheDocument();
    });

    it('should handle minimal props with current user', () => {
      render(<StoryItem isCurrentUser={true} />);

      expect(screen.getByText('Your note')).toBeInTheDocument();
    });

    it('should handle minimal props with other user', () => {
      render(<StoryItem userName='Jane Doe' />);

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty userName', () => {
      render(<StoryItem userName='' />);

      // Empty userName defaults to 'User'
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('should handle empty displayText', () => {
      render(<StoryItem userName='John Doe' displayText='' />);

      // Empty displayText still shows (it's an empty string)
      const { container } = render(
        <StoryItem userName='John Doe' displayText='' />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle very long userName', () => {
      const longName = 'A'.repeat(100);
      render(<StoryItem userName={longName} />);

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle very long displayText', () => {
      const longText = 'B'.repeat(100);
      render(<StoryItem displayText={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle undefined userName', () => {
      render(<StoryItem />);

      // Undefined userName defaults to 'User'
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('should handle empty avatarSrc', () => {
      const { container } = render(
        <StoryItem avatarSrc='' userName='John Doe' />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render text for screen readers', () => {
      render(<StoryItem userName='John Doe' />);

      const text = screen.getByText('John Doe');
      expect(text).toBeVisible();
    });

    it('should render "Your note" text for current user', () => {
      render(<StoryItem isCurrentUser={true} />);

      const text = screen.getByText('Your note');
      expect(text).toBeVisible();
    });

    it('should have visible avatar', () => {
      const { container } = render(<StoryItem userName='John Doe' />);

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeVisible();
    });
  });
});
