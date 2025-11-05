/**
 * ActionButton Component Tests
 */

import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';
import { ActionButton } from '@/ui/components/atoms/ActionButton';

describe('ActionButton', () => {
  describe('Rendering', () => {
    it('should render button with icon', () => {
      const icon = <span data-testid='test-icon'>Icon</span>;
      render(<ActionButton icon={icon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render with default variant (secondary)', () => {
      const icon = <span>Icon</span>;
      const { container } = render(<ActionButton icon={icon} />);
      const button = container.querySelector('button');

      expect(button).toBeInTheDocument();
    });

    it('should render with primary variant', () => {
      const icon = <span>Icon</span>;
      const { container } = render(
        <ActionButton icon={icon} variant='primary' />
      );
      const button = container.querySelector('button');

      expect(button).toBeInTheDocument();
    });

    it('should render with secondary variant explicitly', () => {
      const icon = <span>Icon</span>;
      const { container } = render(
        <ActionButton icon={icon} variant='secondary' />
      );
      const button = container.querySelector('button');

      expect(button).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const icon = <span>Icon</span>;
      const { user } = render(
        <ActionButton icon={icon} onClick={handleClick} />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const icon = <span>Icon</span>;
      const { user } = render(
        <ActionButton icon={icon} onClick={handleClick} disabled />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should be disabled when disabled prop is true', () => {
      const icon = <span>Icon</span>;
      render(<ActionButton icon={icon} disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be enabled by default', () => {
      const icon = <span>Icon</span>;
      render(<ActionButton icon={icon} />);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Props', () => {
    it('should accept custom icon element', () => {
      const CustomIcon = () => <div data-testid='custom-icon'>Custom</div>;
      render(<ActionButton icon={<CustomIcon />} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should handle missing onClick gracefully', () => {
      const icon = <span>Icon</span>;
      const { container } = render(<ActionButton icon={icon} />);
      const button = container.querySelector('button');

      expect(button).toBeInTheDocument();
      expect(() => button?.click()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should render as a button element', () => {
      const icon = <span>Icon</span>;
      render(<ActionButton icon={icon} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const handleClick = vi.fn();
      const icon = <span>Icon</span>;
      const { user } = render(
        <ActionButton icon={icon} onClick={handleClick} />
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('should not be keyboard accessible when disabled', async () => {
      const handleClick = vi.fn();
      const icon = <span>Icon</span>;
      const { user } = render(
        <ActionButton icon={icon} onClick={handleClick} disabled />
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
