import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Chat } from '@/domain/entities/Chat';
import { ChatParticipant } from '@/domain/entities/ChatParticipant';
import { Message } from '@/domain/entities/Message';
import { UserStatus } from '@/domain/entities/UserStatus';
import { ChatHeader } from '@/ui/components/organisms/ChatHeader';

// Mock the hooks
vi.mock('@/ui/hooks', () => ({
  useChatContext: vi.fn(() => ({
    onlineUsers: [
      new UserStatus('user-1', 'online', new Date().toISOString()),
      new UserStatus('user-2', 'offline', new Date().toISOString()),
    ],
  })),
}));

// Mock the components
vi.mock('@/ui/components/molecules/AvatarWithStatus', () => ({
  AvatarWithStatus: ({ size, src, isOnline }: any) => (
    <div data-testid='avatar-with-status'>
      Avatar: {src}, Online: {isOnline.toString()}, Size: {size}
    </div>
  ),
}));

vi.mock('@/ui/components/organisms/PeopleInChatModal', () => ({
  PeopleInChatModal: ({ open, onClose, chatName }: any) => (
    <div
      data-testid='people-modal'
      style={{ display: open ? 'block' : 'none' }}
    >
      People Modal - {chatName}
      <button data-testid='close-people-modal' onClick={onClose}>
        Close People
      </button>
    </div>
  ),
}));

vi.mock('@/ui/components/organisms/SearchConversationModal', () => ({
  SearchConversationModal: ({ open, onClose, chatId }: any) => (
    <div
      data-testid='search-modal'
      style={{ display: open ? 'block' : 'none' }}
    >
      Search Modal - {chatId}
      <button data-testid='close-search-modal' onClick={onClose}>
        Close Search
      </button>
    </div>
  ),
}));

// Mock constants
vi.mock('@/constants/chatStatus', () => ({
  getStatusText: vi.fn((isGroup: boolean, isOnline: boolean) => {
    if (isGroup) return 'Group Chat';
    return isOnline ? 'Online' : 'Offline';
  }),
  getStatusColor: vi.fn((isGroup: boolean, isOnline: boolean) => {
    if (isGroup) return '#666';
    return isOnline ? '#52c41a' : '#bfbfbf';
  }),
}));

describe('ChatHeader', () => {
  const mockLastMessage = {
    message: 'Hello there!',
    senderId: 'user-1',
    senderName: 'John Doe',
    time: new Date().toISOString(),
  };

  const mockIndividualChat = new Chat(
    'user-1',
    'John Doe',
    mockLastMessage,
    'https://example.com/avatar.jpg',
    true,
    0,
    false
  );

  const mockGroupChat = new Chat(
    'group-1',
    'Team Discussion',
    mockLastMessage,
    'https://example.com/group-avatar.jpg',
    false,
    0,
    true
  );

  const mockMessages = [
    new Message(
      'msg-1',
      'Hello there!',
      'user-1',
      'John Doe',
      new Date().toISOString(),
      false
    ),
    new Message(
      'msg-2',
      'Hi back!',
      'user-2',
      'Jane Smith',
      new Date().toISOString(),
      true
    ),
  ];

  const mockParticipants = [
    new ChatParticipant(
      'user-1',
      'John Doe',
      'https://example.com/john.jpg',
      true
    ),
    new ChatParticipant(
      'user-2',
      'Jane Smith',
      'https://example.com/jane.jpg',
      false
    ),
  ];

  describe('Rendering', () => {
    it('should render chat name and avatar for individual chat', () => {
      render(<ChatHeader selectedChat={mockIndividualChat} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-with-status')).toBeInTheDocument();
    });

    it('should render chat name and avatar for group chat', () => {
      render(<ChatHeader selectedChat={mockGroupChat} />);

      expect(screen.getByText('Team Discussion')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-with-status')).toBeInTheDocument();
    });

    it('should display online status for individual chat', () => {
      render(<ChatHeader selectedChat={mockIndividualChat} />);

      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should display group status for group chat', () => {
      render(<ChatHeader selectedChat={mockGroupChat} />);

      expect(screen.getByText('Group Chat')).toBeInTheDocument();
    });

    it('should show search button for all chats', () => {
      render(<ChatHeader selectedChat={mockIndividualChat} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeInTheDocument();
    });

    it('should show info button only for group chats', () => {
      const { rerender } = render(
        <ChatHeader selectedChat={mockIndividualChat} />
      );

      expect(
        screen.queryByRole('button', { name: /info/i })
      ).not.toBeInTheDocument();

      rerender(<ChatHeader selectedChat={mockGroupChat} />);

      expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
    });
  });

  describe('Online Status Logic', () => {
    it('should show user as online when they are in online users list', () => {
      render(<ChatHeader selectedChat={mockIndividualChat} />);

      expect(screen.getByTestId('avatar-with-status')).toHaveTextContent(
        'Online: true'
      );
    });

    it('should show user as offline when they are not in online users list', () => {
      const offlineChat = new Chat(
        'user-3',
        'Offline User',
        mockLastMessage,
        'https://example.com/offline.jpg',
        false,
        0,
        false
      );

      render(<ChatHeader selectedChat={offlineChat} />);

      expect(screen.getByTestId('avatar-with-status')).toHaveTextContent(
        'Online: false'
      );
    });

    it('should always show group chats as offline', () => {
      render(<ChatHeader selectedChat={mockGroupChat} />);

      expect(screen.getByTestId('avatar-with-status')).toHaveTextContent(
        'Online: false'
      );
    });
  });

  describe('Search Modal', () => {
    it('should open search modal when search button is clicked', () => {
      render(
        <ChatHeader
          selectedChat={mockIndividualChat}
          chatMessages={mockMessages}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      const searchModal = screen.getByTestId('search-modal');
      expect(searchModal).toBeVisible();
      expect(searchModal).toHaveTextContent('Search Modal - user-1');
    });

    it('should close search modal when close button is clicked', () => {
      render(
        <ChatHeader
          selectedChat={mockIndividualChat}
          chatMessages={mockMessages}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      const closeButton = screen.getByTestId('close-search-modal');
      fireEvent.click(closeButton);

      const searchModal = screen.getByTestId('search-modal');
      expect(searchModal).not.toBeVisible();
    });

    it('should pass correct props to search modal', () => {
      render(
        <ChatHeader
          selectedChat={mockIndividualChat}
          chatMessages={mockMessages}
        />
      );

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(screen.getByTestId('search-modal')).toHaveTextContent('user-1');
    });
  });

  describe('People Modal', () => {
    it('should open people modal when info button is clicked on group chat', () => {
      render(
        <ChatHeader
          selectedChat={mockGroupChat}
          chatParticipants={mockParticipants}
        />
      );

      const infoButton = screen.getByRole('button', { name: /info/i });
      fireEvent.click(infoButton);

      const peopleModal = screen.getByTestId('people-modal');
      expect(peopleModal).toBeVisible();
      expect(peopleModal).toHaveTextContent('People Modal - Team Discussion');
    });

    it('should close people modal when close button is clicked', () => {
      render(
        <ChatHeader
          selectedChat={mockGroupChat}
          chatParticipants={mockParticipants}
        />
      );

      const infoButton = screen.getByRole('button', { name: /info/i });
      fireEvent.click(infoButton);

      const closeButton = screen.getByTestId('close-people-modal');
      fireEvent.click(closeButton);

      const peopleModal = screen.getByTestId('people-modal');
      expect(peopleModal).not.toBeVisible();
    });
  });

  describe('Props Handling', () => {
    it('should handle missing chatMessages prop', () => {
      render(<ChatHeader selectedChat={mockIndividualChat} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle missing chatParticipants prop', () => {
      render(<ChatHeader selectedChat={mockGroupChat} />);

      expect(screen.getByText('Team Discussion')).toBeInTheDocument();
    });

    it('should handle empty chatMessages array', () => {
      render(
        <ChatHeader selectedChat={mockIndividualChat} chatMessages={[]} />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle empty chatParticipants array', () => {
      render(<ChatHeader selectedChat={mockGroupChat} chatParticipants={[]} />);

      expect(screen.getByText('Team Discussion')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(<ChatHeader selectedChat={mockGroupChat} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // Search and Info buttons
    });

    it('should have proper text hierarchy', () => {
      render(<ChatHeader selectedChat={mockIndividualChat} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle chat with no avatar', () => {
      const chatWithoutAvatar = new Chat(
        'user-4',
        'No Avatar User',
        mockLastMessage,
        '',
        false,
        0,
        false
      );

      render(<ChatHeader selectedChat={chatWithoutAvatar} />);

      expect(screen.getByText('No Avatar User')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-with-status')).toHaveTextContent(
        'Avatar: '
      );
    });

    it('should handle very long chat names', () => {
      const longNameChat = new Chat(
        'user-5',
        'This is a very long chat name that should be handled properly',
        mockLastMessage,
        'https://example.com/avatar.jpg',
        false,
        0,
        false
      );

      render(<ChatHeader selectedChat={longNameChat} />);

      expect(
        screen.getByText(
          'This is a very long chat name that should be handled properly'
        )
      ).toBeInTheDocument();
    });
  });
});
