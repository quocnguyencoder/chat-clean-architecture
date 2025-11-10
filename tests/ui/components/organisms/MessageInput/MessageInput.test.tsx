import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MessageInput } from '@/ui/components/organisms/MessageInput';

describe('MessageInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSend: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render input field with default placeholder', () => {
      render(<MessageInput {...defaultProps} />);

      expect(screen.getByPlaceholderText('Aa')).toBeInTheDocument();
    });

    it('should render input field with custom placeholder', () => {
      render(
        <MessageInput {...defaultProps} placeholder='Type a message...' />
      );

      expect(
        screen.getByPlaceholderText('Type a message...')
      ).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      const { container } = render(<MessageInput {...defaultProps} />);

      const plusIcon = container.querySelector('.anticon-plus');
      const pictureIcon = container.querySelector('.anticon-picture');
      const audioIcon = container.querySelector('.anticon-audio');
      const smileIcon = container.querySelector('.anticon-smile');

      expect(plusIcon).toBeInTheDocument();
      expect(pictureIcon).toBeInTheDocument();
      expect(audioIcon).toBeInTheDocument();
      expect(smileIcon).toBeInTheDocument();
    });

    it('should display current value in input', () => {
      render(<MessageInput {...defaultProps} value='Hello world' />);

      const input = screen.getByDisplayValue('Hello world');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Input Interaction', () => {
    it('should call onChange when typing', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();
      render(<MessageInput {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');

      // user.type triggers onChange for each character typed
      expect(mockOnChange).toHaveBeenCalledTimes(5);
      expect(mockOnChange).toHaveBeenCalledWith('H');
      expect(mockOnChange).toHaveBeenCalledWith('e');
      expect(mockOnChange).toHaveBeenCalledWith('l');
      expect(mockOnChange).toHaveBeenCalledWith('o');
    });

    it('should call onSend when Enter is pressed', async () => {
      const user = userEvent.setup();
      const mockOnSend = vi.fn();
      render(<MessageInput {...defaultProps} onSend={mockOnSend} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello{enter}');

      expect(mockOnSend).toHaveBeenCalled();
    });
  });

  describe('Send Button Logic', () => {
    it('should show send button when there is text', () => {
      const { container } = render(
        <MessageInput {...defaultProps} value='Hello' />
      );

      const sendIcon = container.querySelector('.anticon-send');
      expect(sendIcon).toBeInTheDocument();
    });

    it('should show audio button when there is no text', () => {
      const { container } = render(<MessageInput {...defaultProps} value='' />);

      const audioIcons = container.querySelectorAll('.anticon-audio');
      expect(audioIcons.length).toBeGreaterThan(1); // One in main buttons, one as send replacement
    });

    it('should call onSend when send button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnSend = vi.fn();
      const { container } = render(
        <MessageInput {...defaultProps} value='Hello' onSend={mockOnSend} />
      );

      const sendButton = container
        .querySelector('.anticon-send')
        ?.closest('button');
      if (sendButton) {
        await user.click(sendButton);
        expect(mockOnSend).toHaveBeenCalled();
      }
    });
  });

  describe('Props Combinations', () => {
    it('should handle all props together', () => {
      const mockOnChange = vi.fn();
      const mockOnSend = vi.fn();

      render(
        <MessageInput
          value='Test message'
          onChange={mockOnChange}
          onSend={mockOnSend}
          placeholder='Custom placeholder'
        />
      );

      expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
    });

    it('should handle minimal props', () => {
      render(<MessageInput value='' onChange={vi.fn()} onSend={vi.fn()} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<MessageInput {...defaultProps} value='' />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<MessageInput {...defaultProps} value={longText} />);

      expect(screen.getByDisplayValue(longText)).toBeInTheDocument();
    });

    it('should handle special characters', () => {
      const specialText = '<>&"\'';
      render(<MessageInput {...defaultProps} value={specialText} />);

      expect(screen.getByDisplayValue(specialText)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible input field', () => {
      render(<MessageInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeVisible();
    });

    it('should have actionable buttons', () => {
      const { container } = render(<MessageInput {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
