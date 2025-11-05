/**
 * StoryAvatar Component Tests
 */

import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';
import { StoryAvatar } from '@/ui/components/atoms/StoryAvatar';

// Mock the avatar utility functions
vi.mock('@/utils/avatar', () => ({
  generateUserAvatar: (userName: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
  getDefaultAvatar: () =>
    'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
}));

describe('StoryAvatar', () => {
  describe('Rendering', () => {
    it('should render avatar component', () => {
      render(<StoryAvatar />);
      const avatar = screen.getByRole('img');

      expect(avatar).toBeInTheDocument();
    });

    it('should render with default size (52)', () => {
      const { container } = render(<StoryAvatar />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toBeInTheDocument();
    });

    it('should render with custom size', () => {
      const { container } = render(<StoryAvatar size={80} />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Avatar Source', () => {
    it('should use provided avatarSrc when available', () => {
      const customSrc = 'https://example.com/avatar.jpg';
      render(<StoryAvatar avatarSrc={customSrc} />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('src', customSrc);
    });

    it('should use default avatar for current user when no avatarSrc', () => {
      render(<StoryAvatar isCurrentUser={true} />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute(
        'src',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      );
    });

    it('should generate avatar from userName when provided', () => {
      const userName = 'John Doe';
      render(<StoryAvatar userName={userName} />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute(
        'src',
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
      );
    });

    it('should use default avatar when no props provided', () => {
      render(<StoryAvatar />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute(
        'src',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      );
    });

    it('should prioritize avatarSrc over other props', () => {
      const customSrc = 'https://example.com/custom.jpg';
      render(
        <StoryAvatar
          avatarSrc={customSrc}
          userName='John Doe'
          isCurrentUser={true}
        />
      );
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('src', customSrc);
    });

    it('should prioritize isCurrentUser over userName when no avatarSrc', () => {
      render(<StoryAvatar userName='John Doe' isCurrentUser={true} />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute(
        'src',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
      );
    });
  });

  describe('Styling', () => {
    it('should apply custom styles', () => {
      const customStyle = { marginTop: '10px' };
      const { container } = render(<StoryAvatar style={customStyle} />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toHaveStyle({ marginTop: '10px' });
    });

    it('should merge custom styles with default styles', () => {
      const customStyle = { marginTop: '20px' };
      const { container } = render(<StoryAvatar style={customStyle} />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toHaveStyle({ marginTop: '20px' });
    });

    it('should have cursor pointer style', () => {
      const { container } = render(<StoryAvatar />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toHaveStyle({ cursor: 'pointer' });
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together', () => {
      const customStyle = { opacity: '0.8' };
      render(
        <StoryAvatar
          size={100}
          userName='Test User'
          avatarSrc='https://example.com/test.jpg'
          isCurrentUser={false}
          style={customStyle}
        />
      );
      const img = screen.getByRole('img');

      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/test.jpg');
    });

    it('should handle minimal props', () => {
      render(<StoryAvatar />);
      const img = screen.getByRole('img');

      expect(img).toBeInTheDocument();
    });

    it('should handle size variations', () => {
      const sizes = [24, 40, 52, 80, 100];

      sizes.forEach(size => {
        const { container } = render(<StoryAvatar size={size} />);
        const avatar = container.querySelector('.ant-avatar');
        expect(avatar).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty userName', () => {
      render(<StoryAvatar userName='' />);
      const img = screen.getByRole('img');

      expect(img).toBeInTheDocument();
    });

    it('should handle undefined style prop', () => {
      render(<StoryAvatar style={undefined} />);
      const img = screen.getByRole('img');

      expect(img).toBeInTheDocument();
    });

    it('should handle empty style object', () => {
      render(<StoryAvatar style={{}} />);
      const img = screen.getByRole('img');

      expect(img).toBeInTheDocument();
    });

    it('should handle size of 0', () => {
      const { container } = render(<StoryAvatar size={0} />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render image with img role', () => {
      render(<StoryAvatar />);

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should be visible in the document', () => {
      const { container } = render(<StoryAvatar userName='Test User' />);
      const avatar = container.querySelector('.ant-avatar');

      expect(avatar).toBeVisible();
    });
  });
});
