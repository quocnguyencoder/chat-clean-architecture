/**
 * OnlineStatusIndicator Component Tests
 */

import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';

import { OnlineStatusIndicator } from './index';

import { render } from '@/test/test-utils';

describe('OnlineStatusIndicator', () => {
  describe('Rendering', () => {
    it('should render when isOnline is true', () => {
      const { container } = render(<OnlineStatusIndicator isOnline={true} />);
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
    });

    it('should not render when isOnline is false', () => {
      const { container } = render(<OnlineStatusIndicator isOnline={false} />);
      const indicator = container.querySelector('div');

      expect(indicator).not.toBeInTheDocument();
    });

    it('should render with default size (medium)', () => {
      const { container } = render(<OnlineStatusIndicator isOnline={true} />);
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render with small size', () => {
      const { container } = render(
        <OnlineStatusIndicator isOnline={true} size='small' />
      );
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveStyle({ width: '12px', height: '12px' });
    });

    it('should render with medium size', () => {
      const { container } = render(
        <OnlineStatusIndicator isOnline={true} size='medium' />
      );
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveStyle({ width: '14px', height: '14px' });
    });

    it('should render with large size', () => {
      const { container } = render(
        <OnlineStatusIndicator isOnline={true} size='large' />
      );
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveStyle({ width: '16px', height: '16px' });
    });
  });

  describe('Styling', () => {
    it('should apply custom styles', () => {
      const customStyle = { marginLeft: '10px' };
      const { container } = render(
        <OnlineStatusIndicator isOnline={true} style={customStyle} />
      );
      const indicator = container.querySelector('div');

      expect(indicator).toHaveStyle({ marginLeft: '10px' });
    });

    it('should have circular shape', () => {
      const { container } = render(<OnlineStatusIndicator isOnline={true} />);
      const indicator = container.querySelector('div');

      expect(indicator).toHaveStyle({ borderRadius: '50%' });
    });

    it('should have green background color', () => {
      const { container } = render(<OnlineStatusIndicator isOnline={true} />);

      const indicator = container.firstChild as HTMLElement;

      // Check for green background (theme.colors.success)
      expect(indicator).toHaveStyle({ background: '#44b700' });
    });

    it('should merge custom styles with default styles', () => {
      const customStyles: CSSProperties = { opacity: 0.8 };
      const { container } = render(
        <OnlineStatusIndicator
          isOnline={true}
          size='small'
          style={customStyles}
        />
      );

      const indicator = container.firstChild as HTMLElement;

      // Should have both default and custom styles
      expect(indicator).toHaveStyle({ opacity: '0.8' });
      expect(indicator).toHaveStyle({ borderRadius: '50%' });
      expect(indicator).toHaveStyle({ width: '12px', height: '12px' });
      // Should still have default background
      expect(indicator).toHaveStyle({ background: '#44b700' });
    });
  });

  describe('Props', () => {
    it('should handle all size options', () => {
      const sizes: Array<'small' | 'medium' | 'large'> = [
        'small',
        'medium',
        'large',
      ];

      sizes.forEach(size => {
        const { container } = render(
          <OnlineStatusIndicator isOnline={true} size={size} />
        );
        const indicator = container.querySelector('div');
        expect(indicator).toBeInTheDocument();
      });
    });

    it('should return null when offline', () => {
      const { container } = render(
        <OnlineStatusIndicator isOnline={false} size='large' />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined style prop', () => {
      const { container } = render(
        <OnlineStatusIndicator isOnline={true} style={undefined} />
      );
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
    });

    it('should handle empty style object', () => {
      const { container } = render(
        <OnlineStatusIndicator isOnline={true} style={{}} />
      );
      const indicator = container.querySelector('div');

      expect(indicator).toBeInTheDocument();
    });
  });
});
