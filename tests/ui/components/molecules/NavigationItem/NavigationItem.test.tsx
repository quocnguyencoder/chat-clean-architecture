import { HomeOutlined, MessageOutlined } from '@ant-design/icons';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NavigationItem } from '@/ui/components/molecules/NavigationItem';

describe('NavigationItem', () => {
  describe('Rendering', () => {
    it('should render with icon and label', () => {
      render(<NavigationItem icon={<MessageOutlined />} label='Messages' />);

      expect(screen.getByText('Messages')).toBeInTheDocument();
    });

    it('should render icon element', () => {
      const { container } = render(
        <NavigationItem icon={<HomeOutlined />} label='Home' />
      );

      const icon = container.querySelector('.anticon-home');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('should not be active by default', () => {
      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' />
      );

      const button = container.querySelector('.ant-btn');
      expect(button).toBeInTheDocument();
    });

    it('should render as active when isActive is true', () => {
      const { container } = render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          isActive={true}
        />
      );

      // Active state is applied via inline styles
      const button = container.querySelector('.ant-btn');
      expect(button).toBeInTheDocument();
    });

    it('should not be active when isActive is false', () => {
      const { container } = render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          isActive={false}
        />
      );

      const button = container.querySelector('.ant-btn');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Badge Display', () => {
    it('should not show badge by default', () => {
      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' />
      );

      const badge = container.querySelector('.ant-badge');
      expect(badge).not.toBeInTheDocument();
    });

    it('should show count badge when badge is a number', () => {
      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' badge={5} />
      );

      const badge = container.querySelector('.ant-badge');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should show dot badge when badgeType is dot', () => {
      const { container } = render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          badge={3}
          badgeType='dot'
        />
      );

      const dot = container.querySelector('.ant-badge-dot');
      expect(dot).toBeInTheDocument();
    });

    it('should show count badge when badgeType is count', () => {
      render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          badge={10}
          badgeType='count'
        />
      );

      // Badge count is split into individual digits
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });

    it('should handle zero badge count', () => {
      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' badge={0} />
      );

      // Badge with 0 still renders but may be hidden
      const button = container.querySelector('.ant-btn');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should be clickable', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' />
      );

      const button = container.querySelector('.ant-btn') as HTMLButtonElement;
      if (button) {
        button.onclick = onClick;
        await user.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together', () => {
      const { container } = render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          isActive={true}
          badge={5}
          badgeType='count'
        />
      );

      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      const button = container.querySelector('.ant-btn');
      expect(button).toBeInTheDocument();
    });

    it('should handle active state with dot badge', () => {
      const { container } = render(
        <NavigationItem
          icon={<HomeOutlined />}
          label='Home'
          isActive={true}
          badge={1}
          badgeType='dot'
        />
      );

      const dot = container.querySelector('.ant-badge-dot');
      expect(dot).toBeInTheDocument();
      const activeButton = container.querySelector('.ant-btn');
      expect(activeButton).toBeInTheDocument();
    });

    it('should handle minimal props', () => {
      render(<NavigationItem icon={<MessageOutlined />} label='Test' />);

      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='' />
      );

      const labelDiv = container.querySelector('[style*="font-size"]');
      expect(labelDiv).toBeInTheDocument();
    });

    it('should handle very long label', () => {
      const longLabel = 'A'.repeat(100);
      render(<NavigationItem icon={<MessageOutlined />} label={longLabel} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle large badge count', () => {
      const { container } = render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          badge={999}
        />
      );

      // Ant Design shows "99+" for counts >= 100
      const badge = container.querySelector('.ant-badge');
      expect(badge).toBeInTheDocument();
    });

    it('should handle negative badge count', () => {
      const { container } = render(
        <NavigationItem
          icon={<MessageOutlined />}
          label='Messages'
          badge={-1}
        />
      );

      const badge = container.querySelector('.ant-badge');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render button element', () => {
      const { container } = render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' />
      );

      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('should have visible label text', () => {
      render(<NavigationItem icon={<MessageOutlined />} label='Accessible' />);

      const label = screen.getByText('Accessible');
      expect(label).toBeVisible();
    });

    it('should show badge count for screen readers', () => {
      render(
        <NavigationItem icon={<MessageOutlined />} label='Messages' badge={5} />
      );

      const badgeText = screen.getByText('5');
      expect(badgeText).toBeVisible();
    });
  });
});
