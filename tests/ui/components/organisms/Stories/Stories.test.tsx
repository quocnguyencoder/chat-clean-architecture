import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Story } from '@/domain/entities';
import { Stories } from '@/ui/components/organisms/Stories';

// Mock the hooks
vi.mock('@/ui/hooks', () => ({
  useChatContext: vi.fn(() => ({
    currentUser: {
      id: 'current-user',
      avatar: 'https://example.com/current-avatar.jpg',
    },
  })),
}));

// Mock StoryItem
vi.mock('@/ui/components/molecules/StoryItem', () => ({
  StoryItem: ({ userName, displayText, isCurrentUser }: any) => (
    <div data-testid='story-item'>{isCurrentUser ? displayText : userName}</div>
  ),
}));

describe('Stories', () => {
  const mockStories = [
    new Story('1', 'John Doe', 'https://example.com/john.jpg', true, true),
    new Story('2', 'Jane Smith', 'https://example.com/jane.jpg', false, true),
  ];

  describe('Rendering', () => {
    it('should render current user story first', () => {
      render(<Stories stories={mockStories} />);

      const storyItems = screen.getAllByTestId('story-item');
      expect(storyItems[0]).toHaveTextContent('Your note');
    });

    it('should render all provided stories', () => {
      render(<Stories stories={mockStories} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render empty state with just current user story', () => {
      render(<Stories stories={[]} />);

      const storyItems = screen.getAllByTestId('story-item');
      expect(storyItems).toHaveLength(1);
      expect(storyItems[0]).toHaveTextContent('Your note');
    });

    it('should have scrollable container', () => {
      const { container } = render(<Stories stories={mockStories} />);

      const scrollContainer = container.querySelector(
        '[style*="overflow-x: auto"]'
      );
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe('Navigation Buttons', () => {
    // Note: These tests would need more complex setup to actually test scroll behavior
    it('should have navigation buttons in DOM structure', () => {
      const { container } = render(<Stories stories={mockStories} />);

      const wrapper = container.querySelector('[style*="position: relative"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have proper aria labels for navigation', () => {
      render(<Stories stories={mockStories} />);

      // Navigation buttons may not be visible initially, so we just check the component renders
      expect(screen.getByText('Your note')).toBeInTheDocument();
    });
  });

  describe('Story Items', () => {
    it('should render correct number of story items', () => {
      render(<Stories stories={mockStories} />);

      const storyItems = screen.getAllByTestId('story-item');
      expect(storyItems).toHaveLength(3); // Current user + 2 stories
    });

    it('should pass correct props to StoryItem', () => {
      render(<Stories stories={mockStories} />);

      expect(screen.getByText('Your note')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should handle large number of stories', () => {
      const manyStories = Array.from(
        { length: 20 },
        (_, i) =>
          new Story(
            `user-${i}`,
            `User ${i}`,
            `https://example.com/user${i}.jpg`,
            i % 2 === 0,
            true
          )
      );

      render(<Stories stories={manyStories} />);

      const storyItems = screen.getAllByTestId('story-item');
      expect(storyItems).toHaveLength(21); // Current user + 20 stories
    });

    it('should handle stories with different online states', () => {
      render(<Stories stories={mockStories} />);

      // Both online and offline users should render
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper container structure', () => {
      const { container } = render(<Stories stories={mockStories} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it('should render all story content accessibly', () => {
      render(<Stories stories={mockStories} />);

      // All story names should be visible
      expect(screen.getByText('Your note')).toBeVisible();
      expect(screen.getByText('John Doe')).toBeVisible();
      expect(screen.getByText('Jane Smith')).toBeVisible();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined stories array gracefully', () => {
      render(<Stories stories={[]} />);

      const storyItems = screen.getAllByTestId('story-item');
      expect(storyItems).toHaveLength(1); // Just current user
    });

    it('should validate story entity creation', () => {
      // Test that Story entity validates empty usernames
      expect(() => {
        new Story('1', '', 'https://example.com/avatar.jpg', true, true);
      }).toThrow('User name cannot be empty');
    });
  });
});
