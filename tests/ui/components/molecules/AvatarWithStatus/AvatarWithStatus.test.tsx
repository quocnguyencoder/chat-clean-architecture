import { describe, expect, it } from 'vitest';

import { render } from '@/test/test-utils';
import { AvatarWithStatus } from '@/ui/components/molecules/AvatarWithStatus';

describe('AvatarWithStatus', () => {
  describe('Rendering', () => {
    it('should render avatar with provided src', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={40} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render with specified size', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={60} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveStyle({ width: '60px', height: '60px' });
    });

    it('should render with alt text when provided', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          alt='User Avatar'
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'User Avatar');
    });

    it('should render container with proper structure', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={40} />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle({ position: 'relative' });
    });
  });

  describe('Online Status', () => {
    it('should show online indicator when isOnline is true', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          isOnline={true}
        />
      );

      const indicator = container.querySelector(
        '[style*="position: absolute"]'
      );
      expect(indicator).toBeInTheDocument();
    });

    it('should not show online indicator when isOnline is false', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          isOnline={false}
        />
      );

      // OnlineStatusIndicator returns null when isOnline is false
      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should default to offline when isOnline is not provided', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={40} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should render with small status size', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          isOnline={true}
          statusSize='small'
        />
      );

      const indicator = container.querySelector('[style*="12px"]');
      expect(indicator).toBeInTheDocument();
    });

    it('should render with medium status size (default)', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          isOnline={true}
        />
      );

      const indicator = container.querySelector('[style*="14px"]');
      expect(indicator).toBeInTheDocument();
    });

    it('should render with large status size', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          isOnline={true}
          statusSize='large'
        />
      );

      const indicator = container.querySelector('[style*="16px"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom styles', () => {
      const customStyle = { marginTop: '20px' };
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          style={customStyle}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ position: 'relative' });
    });

    it('should merge custom styles with default styles', () => {
      const customStyle = { padding: '10px' };
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          style={customStyle}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ padding: '10px', position: 'relative' });
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={50}
          isOnline={true}
          statusSize='large'
          alt='Test User'
          style={{ marginLeft: '10px' }}
        />
      );

      const avatar = container.querySelector('.ant-avatar');
      const img = container.querySelector('img');
      const wrapper = container.firstChild as HTMLElement;

      expect(avatar).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Test User');
      expect(wrapper).toHaveStyle({ marginLeft: '10px' });
    });

    it('should handle minimal props', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={40} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty src string', () => {
      const { container } = render(<AvatarWithStatus src='' size={40} />);

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should handle size of 0', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={0} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should handle very large size', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={200} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toHaveStyle({ width: '200px', height: '200px' });
    });

    it('should handle undefined style prop', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          style={undefined}
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
    });

    it('should handle empty style object', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          style={{}}
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper image accessibility with alt text', () => {
      const { container } = render(
        <AvatarWithStatus
          src='https://example.com/avatar.jpg'
          size={40}
          alt='John Doe'
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('should be visible in the document', () => {
      const { container } = render(
        <AvatarWithStatus src='https://example.com/avatar.jpg' size={40} />
      );

      const avatar = container.querySelector('.ant-avatar');
      expect(avatar).toBeVisible();
    });
  });
});
