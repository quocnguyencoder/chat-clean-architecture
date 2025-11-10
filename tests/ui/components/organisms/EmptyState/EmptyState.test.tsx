import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from '@/ui/components/organisms/EmptyState';

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('should render the empty state message', () => {
      render(<EmptyState />);

      expect(
        screen.getByText('Select a chat to start messaging')
      ).toBeInTheDocument();
    });

    it('should render the message icon', () => {
      const { container } = render(<EmptyState />);

      const icon = container.querySelector('.anticon-message');
      expect(icon).toBeInTheDocument();
    });

    it('should render with proper structure', () => {
      const { container } = render(<EmptyState />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have centered layout', () => {
      const { container } = render(<EmptyState />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveStyle({ display: 'flex' });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible text content', () => {
      render(<EmptyState />);

      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('Select a chat to start messaging');
    });

    it('should have visible message icon', () => {
      const { container } = render(<EmptyState />);

      const icon = container.querySelector('.anticon-message');
      expect(icon).toBeVisible();
    });
  });
});
