import { describe, expect, it } from 'vitest';

import { ChatDetail } from '@/domain/entities/ChatDetail';
import { ChatParticipant } from '@/domain/entities/ChatParticipant';
import { Message } from '@/domain/entities/Message';

describe('ChatDetail Entity', () => {
  const mockParticipants = [
    new ChatParticipant('user-1', 'John Doe', 'avatar1.jpg', true, 'admin'),
    new ChatParticipant('user-2', 'Jane Smith', 'avatar2.jpg', true, 'member'),
    new ChatParticipant('user-3', 'Bob Wilson', 'avatar3.jpg', false, 'member'),
  ];

  const mockMessages = [
    new Message(
      'msg-1',
      'Hello!',
      'user-1',
      'John Doe',
      '2024-01-01T10:00:00Z',
      false
    ),
    new Message(
      'msg-2',
      'Hi there!',
      'user-2',
      'Jane Smith',
      '2024-01-01T10:01:00Z',
      false
    ),
    new Message(
      'msg-3',
      'How are you?',
      'user-1',
      'John Doe',
      '2024-01-01T10:02:00Z',
      false
    ),
  ];

  describe('Constructor and Validation', () => {
    it('should create a chat detail with all properties', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );

      expect(chatDetail.chatId).toBe('chat-1');
      expect(chatDetail.participants).toEqual(mockParticipants);
      expect(chatDetail.messages).toEqual(mockMessages);
    });

    it('should create a chat detail with empty participants and messages', () => {
      const chatDetail = new ChatDetail('chat-1', [], []);

      expect(chatDetail.chatId).toBe('chat-1');
      expect(chatDetail.participants).toEqual([]);
      expect(chatDetail.messages).toEqual([]);
    });

    it('should throw error for empty chat ID', () => {
      expect(() => {
        new ChatDetail('', mockParticipants, mockMessages);
      }).toThrow('Chat ID cannot be empty');
    });

    it('should throw error for whitespace-only chat ID', () => {
      expect(() => {
        new ChatDetail('   ', mockParticipants, mockMessages);
      }).toThrow('Chat ID cannot be empty');
    });
  });

  describe('getParticipantCount', () => {
    it('should return correct participant count', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );

      expect(chatDetail.getParticipantCount()).toBe(3);
    });

    it('should return 0 for empty participants', () => {
      const chatDetail = new ChatDetail('chat-1', [], mockMessages);

      expect(chatDetail.getParticipantCount()).toBe(0);
    });
  });

  describe('getMessageCount', () => {
    it('should return correct message count', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );

      expect(chatDetail.getMessageCount()).toBe(3);
    });

    it('should return 0 for empty messages', () => {
      const chatDetail = new ChatDetail('chat-1', mockParticipants, []);

      expect(chatDetail.getMessageCount()).toBe(0);
    });
  });

  describe('isGroupChat', () => {
    it('should return true when more than 2 participants', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );

      expect(chatDetail.isGroupChat()).toBe(true);
    });

    it('should return false when exactly 2 participants', () => {
      const twoParticipants = [mockParticipants[0], mockParticipants[1]];
      const chatDetail = new ChatDetail(
        'chat-1',
        twoParticipants,
        mockMessages
      );

      expect(chatDetail.isGroupChat()).toBe(false);
    });

    it('should return false when less than 2 participants', () => {
      const oneParticipant = [mockParticipants[0]];
      const chatDetail = new ChatDetail('chat-1', oneParticipant, mockMessages);

      expect(chatDetail.isGroupChat()).toBe(false);
    });

    it('should return false for empty participants', () => {
      const chatDetail = new ChatDetail('chat-1', [], mockMessages);

      expect(chatDetail.isGroupChat()).toBe(false);
    });
  });

  describe('getAdmins', () => {
    it('should return only admin participants', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );
      const admins = chatDetail.getAdmins();

      expect(admins).toHaveLength(1);
      expect(admins[0].id).toBe('user-1');
      expect(admins[0].role).toBe('admin');
    });

    it('should return empty array when no admins', () => {
      const nonAdminParticipants = [
        new ChatParticipant(
          'user-2',
          'Jane Smith',
          'avatar2.jpg',
          true,
          'member'
        ),
        new ChatParticipant(
          'user-3',
          'Bob Wilson',
          'avatar3.jpg',
          false,
          'member'
        ),
      ];
      const chatDetail = new ChatDetail(
        'chat-1',
        nonAdminParticipants,
        mockMessages
      );

      expect(chatDetail.getAdmins()).toEqual([]);
    });

    it('should return multiple admins when present', () => {
      const multiAdminParticipants = [
        new ChatParticipant('user-1', 'John Doe', 'avatar1.jpg', true, 'admin'),
        new ChatParticipant(
          'user-2',
          'Jane Smith',
          'avatar2.jpg',
          true,
          'admin'
        ),
        new ChatParticipant(
          'user-3',
          'Bob Wilson',
          'avatar3.jpg',
          false,
          'member'
        ),
      ];
      const chatDetail = new ChatDetail(
        'chat-1',
        multiAdminParticipants,
        mockMessages
      );
      const admins = chatDetail.getAdmins();

      expect(admins).toHaveLength(2);
      expect(admins[0].role).toBe('admin');
      expect(admins[1].role).toBe('admin');
    });
  });

  describe('getOnlineParticipants', () => {
    it('should return only online participants', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );
      const onlineParticipants = chatDetail.getOnlineParticipants();

      expect(onlineParticipants).toHaveLength(2);
      expect(onlineParticipants[0].isOnline).toBe(true);
      expect(onlineParticipants[1].isOnline).toBe(true);
    });

    it('should return empty array when all participants are offline', () => {
      const offlineParticipants = [
        new ChatParticipant(
          'user-1',
          'John Doe',
          'avatar1.jpg',
          false,
          'member'
        ),
        new ChatParticipant(
          'user-2',
          'Jane Smith',
          'avatar2.jpg',
          false,
          'member'
        ),
      ];
      const chatDetail = new ChatDetail(
        'chat-1',
        offlineParticipants,
        mockMessages
      );

      expect(chatDetail.getOnlineParticipants()).toEqual([]);
    });

    it('should return all participants when all are online', () => {
      const onlineParticipants = [
        new ChatParticipant(
          'user-1',
          'John Doe',
          'avatar1.jpg',
          true,
          'member'
        ),
        new ChatParticipant(
          'user-2',
          'Jane Smith',
          'avatar2.jpg',
          true,
          'member'
        ),
      ];
      const chatDetail = new ChatDetail(
        'chat-1',
        onlineParticipants,
        mockMessages
      );

      expect(chatDetail.getOnlineParticipants()).toHaveLength(2);
    });
  });

  describe('getMessagesSortedByTime', () => {
    it('should return messages sorted by time (oldest first)', () => {
      const unsortedMessages = [
        new Message(
          'msg-3',
          'Third',
          'user-1',
          'John',
          '2024-01-01T12:00:00Z',
          false
        ),
        new Message(
          'msg-1',
          'First',
          'user-1',
          'John',
          '2024-01-01T10:00:00Z',
          false
        ),
        new Message(
          'msg-2',
          'Second',
          'user-2',
          'Jane',
          '2024-01-01T11:00:00Z',
          false
        ),
      ];
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        unsortedMessages
      );

      const sorted = chatDetail.getMessagesSortedByTime();

      expect(sorted).toHaveLength(3);
      expect(sorted[0].id).toBe('msg-1');
      expect(sorted[1].id).toBe('msg-2');
      expect(sorted[2].id).toBe('msg-3');
    });

    it('should not mutate original messages array', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );
      const originalOrder = [...mockMessages];

      chatDetail.getMessagesSortedByTime();

      expect(chatDetail.messages).toEqual(originalOrder);
    });

    it('should return empty array for no messages', () => {
      const chatDetail = new ChatDetail('chat-1', mockParticipants, []);

      expect(chatDetail.getMessagesSortedByTime()).toEqual([]);
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );
      const plainObject = chatDetail.toPlainObject();

      expect(plainObject.chatId).toBe('chat-1');
      expect(plainObject.participants).toHaveLength(3);
      expect(plainObject.messages).toHaveLength(3);
      expect(plainObject.participants[0]).toHaveProperty('id');
      expect(plainObject.messages[0]).toHaveProperty('id');
    });

    it('should convert entities to plain objects', () => {
      const chatDetail = new ChatDetail(
        'chat-1',
        mockParticipants,
        mockMessages
      );
      const plainObject = chatDetail.toPlainObject();

      // Verify participants are plain objects, not entity instances
      expect(plainObject.participants[0]).not.toBeInstanceOf(ChatParticipant);
      expect(plainObject.messages[0]).not.toBeInstanceOf(Message);
    });
  });

  describe('fromPlainObject', () => {
    it('should create ChatDetail from plain object', () => {
      const plainObject = {
        chatId: 'chat-1',
        participants: mockParticipants.map(p => p.toPlainObject()),
        messages: mockMessages.map(m => m.toPlainObject()),
      };

      const chatDetail = ChatDetail.fromPlainObject(plainObject);

      expect(chatDetail).toBeInstanceOf(ChatDetail);
      expect(chatDetail.chatId).toBe('chat-1');
      expect(chatDetail.participants).toHaveLength(3);
      expect(chatDetail.messages).toHaveLength(3);
    });

    it('should restore entity instances with methods', () => {
      const plainObject = {
        chatId: 'chat-1',
        participants: mockParticipants.map(p => p.toPlainObject()),
        messages: mockMessages.map(m => m.toPlainObject()),
      };

      const chatDetail = ChatDetail.fromPlainObject(plainObject);

      expect(chatDetail.participants[0]).toBeInstanceOf(ChatParticipant);
      expect(chatDetail.messages[0]).toBeInstanceOf(Message);
      expect(chatDetail.isGroupChat()).toBe(true);
      expect(chatDetail.getMessageCount()).toBe(3);
    });

    it('should handle empty participants and messages', () => {
      const plainObject = {
        chatId: 'chat-1',
        participants: [],
        messages: [],
      };

      const chatDetail = ChatDetail.fromPlainObject(plainObject);

      expect(chatDetail.participants).toEqual([]);
      expect(chatDetail.messages).toEqual([]);
      expect(chatDetail.isGroupChat()).toBe(false);
    });
  });
});
