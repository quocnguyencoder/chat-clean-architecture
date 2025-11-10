import { describe, expect, it } from 'vitest';

import { Chat, type LastMessage } from '@/domain/entities/Chat';

describe('Chat Entity', () => {
  const mockLastMessage: LastMessage = {
    message: 'Hello there!',
    senderId: 'user-1',
    senderName: 'John Doe',
    time: new Date().toISOString(),
  };

  describe('Constructor and Validation', () => {
    it('should create a chat with all properties', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true,
        5,
        false
      );

      expect(chat.id).toBe('chat-1');
      expect(chat.name).toBe('John Doe');
      expect(chat.lastMessage).toEqual(mockLastMessage);
      expect(chat.avatar).toBe('avatar.jpg');
      expect(chat.isOnline).toBe(true);
      expect(chat.unreadCount).toBe(5);
      expect(chat.isGroup).toBe(false);
    });

    it('should create a chat with default unreadCount', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true
      );

      expect(chat.unreadCount).toBe(0);
      expect(chat.isGroup).toBe(false);
    });

    it('should throw error for empty chat ID', () => {
      expect(() => {
        new Chat('', 'John Doe', mockLastMessage, 'avatar.jpg', true);
      }).toThrow('Chat ID cannot be empty');
    });

    it('should throw error for whitespace-only chat ID', () => {
      expect(() => {
        new Chat('   ', 'John Doe', mockLastMessage, 'avatar.jpg', true);
      }).toThrow('Chat ID cannot be empty');
    });

    it('should throw error for empty chat name', () => {
      expect(() => {
        new Chat('chat-1', '', mockLastMessage, 'avatar.jpg', true);
      }).toThrow('Chat name cannot be empty');
    });

    it('should throw error for whitespace-only chat name', () => {
      expect(() => {
        new Chat('chat-1', '   ', mockLastMessage, 'avatar.jpg', true);
      }).toThrow('Chat name cannot be empty');
    });
  });

  describe('hasUnreadMessages', () => {
    it('should return true when unreadCount is greater than 0', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true,
        3
      );

      expect(chat.hasUnreadMessages()).toBe(true);
    });

    it('should return false when unreadCount is 0', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true,
        0
      );

      expect(chat.hasUnreadMessages()).toBe(false);
    });
  });

  describe('getDisplayName', () => {
    it('should return name with (Group) suffix for group chats', () => {
      const chat = new Chat(
        'chat-1',
        'Team Chat',
        mockLastMessage,
        'avatar.jpg',
        true,
        0,
        true
      );

      expect(chat.getDisplayName()).toBe('Team Chat (Group)');
    });

    it('should return plain name for individual chats', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true,
        0,
        false
      );

      expect(chat.getDisplayName()).toBe('John Doe');
    });
  });

  describe('getFormattedLastMessage', () => {
    it('should show "Start a conversation..." for empty message', () => {
      const emptyMessage: LastMessage = {
        message: '',
        senderId: '',
        time: new Date().toISOString(),
      };

      const chat = new Chat(
        'chat-1',
        'John Doe',
        emptyMessage,
        'avatar.jpg',
        true
      );

      expect(chat.getFormattedLastMessage('current-user')).toBe(
        'Start a conversation...'
      );
    });

    it('should show "Start a conversation..." for whitespace-only message', () => {
      const emptyMessage: LastMessage = {
        message: '   ',
        senderId: 'user-1',
        time: new Date().toISOString(),
      };

      const chat = new Chat(
        'chat-1',
        'John Doe',
        emptyMessage,
        'avatar.jpg',
        true
      );

      expect(chat.getFormattedLastMessage('current-user')).toBe(
        'Start a conversation...'
      );
    });

    it('should prefix with "You: " for messages sent by current user', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true
      );

      expect(chat.getFormattedLastMessage('user-1')).toBe('You: Hello there!');
    });

    it('should show sender name for group chat messages from others', () => {
      const chat = new Chat(
        'chat-1',
        'Team Chat',
        mockLastMessage,
        'avatar.jpg',
        true,
        0,
        true
      );

      expect(chat.getFormattedLastMessage('current-user')).toBe(
        'John Doe: Hello there!'
      );
    });

    it('should show plain message for individual chat from other user', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true,
        0,
        false
      );

      expect(chat.getFormattedLastMessage('current-user')).toBe('Hello there!');
    });

    it('should show plain message for group chat when senderName is not provided', () => {
      const messageWithoutSender: LastMessage = {
        message: 'Hello there!',
        senderId: 'user-1',
        time: new Date().toISOString(),
      };

      const chat = new Chat(
        'chat-1',
        'Team Chat',
        messageWithoutSender,
        'avatar.jpg',
        true,
        0,
        true
      );

      expect(chat.getFormattedLastMessage('current-user')).toBe('Hello there!');
    });
  });

  describe('hasMessages', () => {
    it('should return true when chat has messages', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true
      );

      expect(chat.hasMessages()).toBe(true);
    });

    it('should return false when message is empty', () => {
      const emptyMessage: LastMessage = {
        message: '',
        senderId: '',
        time: new Date().toISOString(),
      };

      const chat = new Chat(
        'chat-1',
        'John Doe',
        emptyMessage,
        'avatar.jpg',
        true
      );

      expect(chat.hasMessages()).toBe(false);
    });

    it('should return false when senderId is empty', () => {
      const messageWithoutSender: LastMessage = {
        message: 'Hello',
        senderId: '',
        time: new Date().toISOString(),
      };

      const chat = new Chat(
        'chat-1',
        'John Doe',
        messageWithoutSender,
        'avatar.jpg',
        true
      );

      expect(chat.hasMessages()).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object', () => {
      const chat = new Chat(
        'chat-1',
        'John Doe',
        mockLastMessage,
        'avatar.jpg',
        true,
        5,
        false
      );

      const plainObject = chat.toPlainObject();

      expect(plainObject).toEqual({
        id: 'chat-1',
        name: 'John Doe',
        lastMessage: mockLastMessage,
        avatar: 'avatar.jpg',
        isOnline: true,
        unreadCount: 5,
        isGroup: false,
      });
    });
  });

  describe('fromPlainObject', () => {
    it('should create Chat entity from plain object', () => {
      const plainObject = {
        id: 'chat-1',
        name: 'John Doe',
        lastMessage: mockLastMessage,
        avatar: 'avatar.jpg',
        isOnline: true,
        unreadCount: 5,
        isGroup: false,
      };

      const chat = Chat.fromPlainObject(plainObject);

      expect(chat).toBeInstanceOf(Chat);
      expect(chat.id).toBe('chat-1');
      expect(chat.name).toBe('John Doe');
      expect(chat.lastMessage).toEqual(mockLastMessage);
      expect(chat.avatar).toBe('avatar.jpg');
      expect(chat.isOnline).toBe(true);
      expect(chat.unreadCount).toBe(5);
      expect(chat.isGroup).toBe(false);
    });

    it('should create Chat entity with methods available', () => {
      const plainObject = {
        id: 'chat-1',
        name: 'John Doe',
        lastMessage: mockLastMessage,
        avatar: 'avatar.jpg',
        isOnline: true,
        unreadCount: 3,
        isGroup: false,
      };

      const chat = Chat.fromPlainObject(plainObject);

      expect(chat.hasUnreadMessages()).toBe(true);
      expect(chat.hasMessages()).toBe(true);
      expect(chat.getDisplayName()).toBe('John Doe');
    });
  });
});
