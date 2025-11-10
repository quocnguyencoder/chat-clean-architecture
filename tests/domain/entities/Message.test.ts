import { describe, expect, it } from 'vitest';

import { Message } from '@/domain/entities/Message';

describe('Message Entity', () => {
  describe('Constructor and Validation', () => {
    it('should create a message with all properties', () => {
      const message = new Message(
        'msg-1',
        'Hello, world!',
        'user-1',
        'John Doe',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.id).toBe('msg-1');
      expect(message.text).toBe('Hello, world!');
      expect(message.senderId).toBe('user-1');
      expect(message.senderName).toBe('John Doe');
      expect(message.time).toBe('2024-01-01T10:00:00Z');
      expect(message.isFromMe).toBe(true);
    });

    it('should create message with isFromMe false', () => {
      const message = new Message(
        'msg-1',
        'Hello',
        'user-2',
        'Jane',
        '2024-01-01T10:00:00Z',
        false
      );

      expect(message.isFromMe).toBe(false);
    });

    it('should throw error for empty message ID', () => {
      expect(() => {
        new Message(
          '',
          'Hello',
          'user-1',
          'John',
          '2024-01-01T10:00:00Z',
          true
        );
      }).toThrow('Message ID cannot be empty');
    });

    it('should throw error for whitespace-only message ID', () => {
      expect(() => {
        new Message(
          '   ',
          'Hello',
          'user-1',
          'John',
          '2024-01-01T10:00:00Z',
          true
        );
      }).toThrow('Message ID cannot be empty');
    });

    it('should throw error for null message text', () => {
      expect(() => {
        new Message(
          'msg-1',
          null as unknown as string,
          'user-1',
          'John',
          '2024-01-01T10:00:00Z',
          true
        );
      }).toThrow('Message text cannot be null or undefined');
    });

    it('should throw error for undefined message text', () => {
      expect(() => {
        new Message(
          'msg-1',
          undefined as unknown as string,
          'user-1',
          'John',
          '2024-01-01T10:00:00Z',
          true
        );
      }).toThrow('Message text cannot be null or undefined');
    });

    it('should allow empty string as message text', () => {
      const message = new Message(
        'msg-1',
        '',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.text).toBe('');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty text', () => {
      const message = new Message(
        'msg-1',
        '',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.isEmpty()).toBe(true);
    });

    it('should return true for whitespace-only text', () => {
      const message = new Message(
        'msg-1',
        '   ',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.isEmpty()).toBe(true);
    });

    it('should return true for mixed whitespace', () => {
      const message = new Message(
        'msg-1',
        '\t\n  \r',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.isEmpty()).toBe(true);
    });

    it('should return false for non-empty text', () => {
      const message = new Message(
        'msg-1',
        'Hello',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.isEmpty()).toBe(false);
    });

    it('should return false for text with surrounding whitespace', () => {
      const message = new Message(
        'msg-1',
        '  Hello  ',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.isEmpty()).toBe(false);
    });
  });

  describe('getLength', () => {
    it('should return correct length for regular text', () => {
      const message = new Message(
        'msg-1',
        'Hello',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.getLength()).toBe(5);
    });

    it('should return 0 for empty text', () => {
      const message = new Message(
        'msg-1',
        '',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.getLength()).toBe(0);
    });

    it('should include whitespace in length', () => {
      const message = new Message(
        'msg-1',
        '  Hello  ',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.getLength()).toBe(9);
    });

    it('should count special characters', () => {
      const message = new Message(
        'msg-1',
        'Hello! 👋',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      expect(message.getLength()).toBeGreaterThan(6);
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object', () => {
      const message = new Message(
        'msg-1',
        'Hello, world!',
        'user-1',
        'John Doe',
        '2024-01-01T10:00:00Z',
        true
      );

      const plainObject = message.toPlainObject();

      expect(plainObject).toEqual({
        id: 'msg-1',
        text: 'Hello, world!',
        senderId: 'user-1',
        senderName: 'John Doe',
        time: '2024-01-01T10:00:00Z',
        isFromMe: true,
      });
    });

    it('should preserve all properties', () => {
      const message = new Message(
        'msg-2',
        '',
        'user-2',
        'Jane Smith',
        '2024-01-02T15:30:00Z',
        false
      );

      const plainObject = message.toPlainObject();

      expect(plainObject.id).toBe('msg-2');
      expect(plainObject.text).toBe('');
      expect(plainObject.senderId).toBe('user-2');
      expect(plainObject.senderName).toBe('Jane Smith');
      expect(plainObject.time).toBe('2024-01-02T15:30:00Z');
      expect(plainObject.isFromMe).toBe(false);
    });

    it('should not be instance of Message', () => {
      const message = new Message(
        'msg-1',
        'Hello',
        'user-1',
        'John',
        '2024-01-01T10:00:00Z',
        true
      );

      const plainObject = message.toPlainObject();

      expect(plainObject).not.toBeInstanceOf(Message);
    });
  });

  describe('fromPlainObject', () => {
    it('should create Message from plain object', () => {
      const plainObject = {
        id: 'msg-1',
        text: 'Hello, world!',
        senderId: 'user-1',
        senderName: 'John Doe',
        time: '2024-01-01T10:00:00Z',
        isFromMe: true,
      };

      const message = Message.fromPlainObject(plainObject);

      expect(message).toBeInstanceOf(Message);
      expect(message.id).toBe('msg-1');
      expect(message.text).toBe('Hello, world!');
      expect(message.senderId).toBe('user-1');
      expect(message.senderName).toBe('John Doe');
      expect(message.time).toBe('2024-01-01T10:00:00Z');
      expect(message.isFromMe).toBe(true);
    });

    it('should restore entity methods', () => {
      const plainObject = {
        id: 'msg-1',
        text: 'Hello',
        senderId: 'user-1',
        senderName: 'John',
        time: '2024-01-01T10:00:00Z',
        isFromMe: false,
      };

      const message = Message.fromPlainObject(plainObject);

      expect(message.isEmpty()).toBe(false);
      expect(message.getLength()).toBe(5);
      expect(typeof message.toPlainObject).toBe('function');
    });

    it('should handle empty text', () => {
      const plainObject = {
        id: 'msg-1',
        text: '',
        senderId: 'user-1',
        senderName: 'John',
        time: '2024-01-01T10:00:00Z',
        isFromMe: true,
      };

      const message = Message.fromPlainObject(plainObject);

      expect(message.text).toBe('');
      expect(message.isEmpty()).toBe(true);
    });

    it('should throw error for invalid plain object with empty ID', () => {
      const plainObject = {
        id: '',
        text: 'Hello',
        senderId: 'user-1',
        senderName: 'John',
        time: '2024-01-01T10:00:00Z',
        isFromMe: true,
      };

      expect(() => {
        Message.fromPlainObject(plainObject);
      }).toThrow('Message ID cannot be empty');
    });

    it('should throw error for invalid plain object with null text', () => {
      const plainObject = {
        id: 'msg-1',
        text: null as unknown as string,
        senderId: 'user-1',
        senderName: 'John',
        time: '2024-01-01T10:00:00Z',
        isFromMe: true,
      };

      expect(() => {
        Message.fromPlainObject(plainObject);
      }).toThrow('Message text cannot be null or undefined');
    });
  });

  describe('Serialization round-trip', () => {
    it('should maintain data integrity through serialization cycle', () => {
      const original = new Message(
        'msg-1',
        'Test message',
        'user-1',
        'Test User',
        '2024-01-01T10:00:00Z',
        true
      );

      const plainObject = original.toPlainObject();
      const restored = Message.fromPlainObject(plainObject);

      expect(restored.id).toBe(original.id);
      expect(restored.text).toBe(original.text);
      expect(restored.senderId).toBe(original.senderId);
      expect(restored.senderName).toBe(original.senderName);
      expect(restored.time).toBe(original.time);
      expect(restored.isFromMe).toBe(original.isFromMe);
    });

    it('should maintain method functionality after deserialization', () => {
      const original = new Message(
        'msg-1',
        '  Test  ',
        'user-1',
        'Test User',
        '2024-01-01T10:00:00Z',
        false
      );

      const restored = Message.fromPlainObject(original.toPlainObject());

      expect(restored.isEmpty()).toBe(original.isEmpty());
      expect(restored.getLength()).toBe(original.getLength());
    });
  });
});
