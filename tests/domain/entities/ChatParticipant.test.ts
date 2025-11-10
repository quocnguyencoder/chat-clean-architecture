import { describe, expect, it } from 'vitest';

import { ChatParticipant } from '@/domain/entities/ChatParticipant';

describe('ChatParticipant Entity', () => {
  describe('Constructor and Validation', () => {
    it('should create a participant with all properties', () => {
      const participant = new ChatParticipant(
        'user-1',
        'John Doe',
        'avatar.jpg',
        true,
        'admin'
      );

      expect(participant.id).toBe('user-1');
      expect(participant.name).toBe('John Doe');
      expect(participant.avatar).toBe('avatar.jpg');
      expect(participant.isOnline).toBe(true);
      expect(participant.role).toBe('admin');
    });

    it('should create a participant with default role as member', () => {
      const participant = new ChatParticipant(
        'user-1',
        'John Doe',
        'avatar.jpg',
        true
      );

      expect(participant.role).toBe('member');
    });

    it('should throw error for empty participant ID', () => {
      expect(() => {
        new ChatParticipant('', 'John Doe', 'avatar.jpg', true);
      }).toThrow('Participant ID cannot be empty');
    });

    it('should throw error for whitespace-only participant ID', () => {
      expect(() => {
        new ChatParticipant('   ', 'John Doe', 'avatar.jpg', true);
      }).toThrow('Participant ID cannot be empty');
    });

    it('should throw error for empty participant name', () => {
      expect(() => {
        new ChatParticipant('user-1', '', 'avatar.jpg', true);
      }).toThrow('Participant name cannot be empty');
    });

    it('should throw error for whitespace-only participant name', () => {
      expect(() => {
        new ChatParticipant('user-1', '   ', 'avatar.jpg', true);
      }).toThrow('Participant name cannot be empty');
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      const participant = new ChatParticipant(
        'user-1',
        'John Doe',
        'avatar.jpg',
        true,
        'admin'
      );

      expect(participant.isAdmin()).toBe(true);
    });

    it('should return false for member role', () => {
      const participant = new ChatParticipant(
        'user-1',
        'John Doe',
        'avatar.jpg',
        true,
        'member'
      );

      expect(participant.isAdmin()).toBe(false);
    });

    it('should return false for default role', () => {
      const participant = new ChatParticipant(
        'user-1',
        'John Doe',
        'avatar.jpg',
        true
      );

      expect(participant.isAdmin()).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object', () => {
      const participant = new ChatParticipant(
        'user-1',
        'John Doe',
        'avatar.jpg',
        true,
        'admin'
      );

      const plainObject = participant.toPlainObject();

      expect(plainObject).toEqual({
        id: 'user-1',
        name: 'John Doe',
        avatar: 'avatar.jpg',
        isOnline: true,
        role: 'admin',
      });
    });

    it('should convert offline member to plain object', () => {
      const participant = new ChatParticipant(
        'user-2',
        'Jane Smith',
        'avatar2.jpg',
        false,
        'member'
      );

      const plainObject = participant.toPlainObject();

      expect(plainObject).toEqual({
        id: 'user-2',
        name: 'Jane Smith',
        avatar: 'avatar2.jpg',
        isOnline: false,
        role: 'member',
      });
    });
  });

  describe('fromPlainObject', () => {
    it('should create ChatParticipant from plain object', () => {
      const plainObject = {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'avatar.jpg',
        isOnline: true,
        role: 'admin' as const,
      };

      const participant = ChatParticipant.fromPlainObject(plainObject);

      expect(participant).toBeInstanceOf(ChatParticipant);
      expect(participant.id).toBe('user-1');
      expect(participant.name).toBe('John Doe');
      expect(participant.avatar).toBe('avatar.jpg');
      expect(participant.isOnline).toBe(true);
      expect(participant.role).toBe('admin');
    });

    it('should create ChatParticipant with methods available', () => {
      const plainObject = {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'avatar.jpg',
        isOnline: true,
        role: 'member' as const,
      };

      const participant = ChatParticipant.fromPlainObject(plainObject);

      expect(participant.isAdmin()).toBe(false);
      expect(participant.toPlainObject()).toEqual(plainObject);
    });

    it('should handle offline participant from plain object', () => {
      const plainObject = {
        id: 'user-3',
        name: 'Bob Wilson',
        avatar: 'avatar3.jpg',
        isOnline: false,
        role: 'admin' as const,
      };

      const participant = ChatParticipant.fromPlainObject(plainObject);

      expect(participant.isOnline).toBe(false);
      expect(participant.isAdmin()).toBe(true);
    });
  });
});
