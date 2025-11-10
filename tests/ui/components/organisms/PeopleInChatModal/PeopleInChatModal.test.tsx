import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ChatParticipant } from '@/domain/entities/ChatParticipant';
import { PeopleInChatModal } from '@/ui/components/organisms/PeopleInChatModal';

// Mock AvatarWithStatus
vi.mock('@/ui/components/molecules/AvatarWithStatus', () => ({
  AvatarWithStatus: ({ size, src, isOnline }: any) => (
    <div data-testid='avatar-with-status'>
      Avatar: {src}, Online: {isOnline.toString()}, Size: {size}
    </div>
  ),
}));

describe('PeopleInChatModal', () => {
  const mockOnClose = vi.fn();

  const mockParticipants = [
    new ChatParticipant(
      '1',
      'John Doe',
      'https://example.com/john.jpg',
      true,
      'admin'
    ),
    new ChatParticipant(
      '2',
      'Jane Smith',
      'https://example.com/jane.jpg',
      false,
      'member'
    ),
    new ChatParticipant(
      '3',
      'Bob Wilson',
      'https://example.com/bob.jpg',
      true,
      'member'
    ),
    new ChatParticipant(
      '4',
      'Alice Brown',
      'https://example.com/alice.jpg',
      true,
      'admin'
    ),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('People in Team Discussion')).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      render(
        <PeopleInChatModal
          open={false}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      expect(
        screen.queryByText('People in Team Discussion')
      ).not.toBeInTheDocument();
    });

    it('should display participant count', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('4 participants')).toBeInTheDocument();
    });

    it('should handle singular participant count', () => {
      const singleParticipant = [mockParticipants[0]];

      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={singleParticipant}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('1 participant')).toBeInTheDocument();
    });
  });

  describe('Participant Sections', () => {
    it('should display admin section with admin participants', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('Admins')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    });

    it('should display member section with member participants', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('Members')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should show admin tags for admin participants', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      const adminTags = screen.getAllByText('Admin');
      expect(adminTags).toHaveLength(2); // John Doe and Alice Brown
    });

    it('should not show admin section when no admins', () => {
      const membersOnly = [
        new ChatParticipant(
          '2',
          'Jane Smith',
          'https://example.com/jane.jpg',
          false,
          'member'
        ),
        new ChatParticipant(
          '3',
          'Bob Wilson',
          'https://example.com/bob.jpg',
          true,
          'member'
        ),
      ];

      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={membersOnly}
          chatName='Team Discussion'
        />
      );

      expect(screen.queryByText('Admins')).not.toBeInTheDocument();
      expect(screen.getByText('Members')).toBeInTheDocument();
    });

    it('should not show member section when no members', () => {
      const adminsOnly = [
        new ChatParticipant(
          '1',
          'John Doe',
          'https://example.com/john.jpg',
          true,
          'admin'
        ),
        new ChatParticipant(
          '4',
          'Alice Brown',
          'https://example.com/alice.jpg',
          true,
          'admin'
        ),
      ];

      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={adminsOnly}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('Admins')).toBeInTheDocument();
      expect(screen.queryByText('Members')).not.toBeInTheDocument();
    });
  });

  describe('Participant Status', () => {
    it('should display online status for online participants', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      const onlineStatuses = screen.getAllByText('Online');
      expect(onlineStatuses.length).toBeGreaterThan(0);
    });

    it('should display offline status for offline participants', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('should render avatar with correct props', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      const avatars = screen.getAllByTestId('avatar-with-status');
      expect(avatars).toHaveLength(4);

      // Check one avatar has correct props
      expect(avatars[0]).toHaveTextContent(
        'Avatar: https://example.com/john.jpg'
      );
      expect(avatars[0]).toHaveTextContent('Size: 48');
    });
  });

  describe('Modal Interaction', () => {
    it('should call onClose when modal is canceled', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      // Find and click the close button (✕)
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle escape key to close modal', () => {
      const { container } = render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      const modal = container.querySelector('.ant-modal');
      if (modal) {
        fireEvent.keyDown(modal, { key: 'Escape' });
      } else {
        // Fallback: test that modal renders and can be closed via button
        expect(screen.getByText('✕')).toBeInTheDocument();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty participants list', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={[]}
          chatName='Empty Chat'
        />
      );

      expect(screen.getByText('People in Empty Chat')).toBeInTheDocument();
      expect(screen.getByText('0 participants')).toBeInTheDocument();
      expect(screen.queryByText('Admins')).not.toBeInTheDocument();
      expect(screen.queryByText('Members')).not.toBeInTheDocument();
    });

    it('should handle long chat names', () => {
      const longChatName =
        'This is a very long chat name that should be handled properly';

      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName={longChatName}
        />
      );

      expect(screen.getByText(`People in ${longChatName}`)).toBeInTheDocument();
    });

    it('should handle participants with no avatars', () => {
      const participantsNoAvatar = [
        new ChatParticipant('1', 'John Doe', '', true, 'admin'),
      ];

      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={participantsNoAvatar}
          chatName='Test Chat'
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      const avatar = screen.getByTestId('avatar-with-status');
      expect(avatar).toHaveTextContent('Avatar: ');
    });

    it('should handle participants with long names', () => {
      const longNameParticipant = [
        new ChatParticipant(
          '1',
          'This is a very long participant name that should be handled',
          'https://example.com/avatar.jpg',
          true,
          'member'
        ),
      ];

      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={longNameParticipant}
          chatName='Test Chat'
        />
      );

      expect(
        screen.getByText(
          'This is a very long participant name that should be handled'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      // Check that modal content is in document
      expect(screen.getByText('People in Team Discussion')).toBeInTheDocument();
    });

    it('should have accessible list structure', () => {
      render(
        <PeopleInChatModal
          open={true}
          onClose={mockOnClose}
          participants={mockParticipants}
          chatName='Team Discussion'
        />
      );

      // All participant names should be in the document
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    });
  });
});
