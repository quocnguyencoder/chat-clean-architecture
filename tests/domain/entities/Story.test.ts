import { describe, expect, it } from 'vitest';

import { Story } from '@/domain/entities/Story';

describe('Story Entity', () => {
  describe('Constructor and Validation', () => {
    it('should create a story with all properties', () => {
      const story = new Story(
        'user-1',
        'John Doe',
        'avatar1.jpg',
        true,
        true,
        '2024-01-01T10:00:00Z'
      );

      expect(story.userId).toBe('user-1');
      expect(story.userName).toBe('John Doe');
      expect(story.userAvatar).toBe('avatar1.jpg');
      expect(story.isOnline).toBe(true);
      expect(story.hasStory).toBe(true);
      expect(story.lastUpdated).toBe('2024-01-01T10:00:00Z');
    });

    it('should create a story with default hasStory value', () => {
      const story = new Story('user-1', 'John Doe', 'avatar1.jpg', true);

      expect(story.hasStory).toBe(true);
      expect(story.lastUpdated).toBeUndefined();
    });

    it('should create a story with hasStory false', () => {
      const story = new Story('user-1', 'John Doe', 'avatar1.jpg', true, false);

      expect(story.hasStory).toBe(false);
    });

    it('should create a story with isOnline false', () => {
      const story = new Story('user-1', 'John Doe', 'avatar1.jpg', false, true);

      expect(story.isOnline).toBe(false);
    });

    it('should create a story without lastUpdated', () => {
      const story = new Story('user-1', 'John Doe', 'avatar1.jpg', true, true);

      expect(story.lastUpdated).toBeUndefined();
    });

    it('should throw error for empty user ID', () => {
      expect(() => {
        new Story('', 'John Doe', 'avatar1.jpg', true);
      }).toThrow('User ID cannot be empty');
    });

    it('should throw error for whitespace-only user ID', () => {
      expect(() => {
        new Story('   ', 'John Doe', 'avatar1.jpg', true);
      }).toThrow('User ID cannot be empty');
    });

    it('should throw error for empty user name', () => {
      expect(() => {
        new Story('user-1', '', 'avatar1.jpg', true);
      }).toThrow('User name cannot be empty');
    });

    it('should throw error for whitespace-only user name', () => {
      expect(() => {
        new Story('user-1', '   ', 'avatar1.jpg', true);
      }).toThrow('User name cannot be empty');
    });

    it('should allow empty avatar', () => {
      const story = new Story('user-1', 'John Doe', '', true);

      expect(story.userAvatar).toBe('');
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object with all properties', () => {
      const story = new Story(
        'user-1',
        'John Doe',
        'avatar1.jpg',
        true,
        true,
        '2024-01-01T10:00:00Z'
      );

      const plainObject = story.toPlainObject();

      expect(plainObject).toEqual({
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'avatar1.jpg',
        isOnline: true,
        hasStory: true,
        lastUpdated: '2024-01-01T10:00:00Z',
      });
    });

    it('should convert to plain object without lastUpdated', () => {
      const story = new Story(
        'user-1',
        'John Doe',
        'avatar1.jpg',
        false,
        false
      );

      const plainObject = story.toPlainObject();

      expect(plainObject).toEqual({
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'avatar1.jpg',
        isOnline: false,
        hasStory: false,
        lastUpdated: undefined,
      });
    });

    it('should not be instance of Story', () => {
      const story = new Story('user-1', 'John Doe', 'avatar1.jpg', true);

      const plainObject = story.toPlainObject();

      expect(plainObject).not.toBeInstanceOf(Story);
    });
  });

  describe('fromPlainObject', () => {
    it('should create Story from plain object with all properties', () => {
      const plainObject = {
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'avatar1.jpg',
        isOnline: true,
        hasStory: true,
        lastUpdated: '2024-01-01T10:00:00Z',
      };

      const story = Story.fromPlainObject(plainObject);

      expect(story).toBeInstanceOf(Story);
      expect(story.userId).toBe('user-1');
      expect(story.userName).toBe('John Doe');
      expect(story.userAvatar).toBe('avatar1.jpg');
      expect(story.isOnline).toBe(true);
      expect(story.hasStory).toBe(true);
      expect(story.lastUpdated).toBe('2024-01-01T10:00:00Z');
    });

    it('should create Story from plain object without lastUpdated', () => {
      const plainObject = {
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'avatar1.jpg',
        isOnline: false,
        hasStory: false,
        lastUpdated: undefined,
      };

      const story = Story.fromPlainObject(plainObject);

      expect(story.userId).toBe('user-1');
      expect(story.isOnline).toBe(false);
      expect(story.hasStory).toBe(false);
      expect(story.lastUpdated).toBeUndefined();
    });

    it('should throw error for invalid plain object with empty user ID', () => {
      const plainObject = {
        userId: '',
        userName: 'John Doe',
        userAvatar: 'avatar1.jpg',
        isOnline: true,
        hasStory: true,
      };

      expect(() => {
        Story.fromPlainObject(plainObject);
      }).toThrow('User ID cannot be empty');
    });

    it('should throw error for invalid plain object with empty user name', () => {
      const plainObject = {
        userId: 'user-1',
        userName: '',
        userAvatar: 'avatar1.jpg',
        isOnline: true,
        hasStory: true,
      };

      expect(() => {
        Story.fromPlainObject(plainObject);
      }).toThrow('User name cannot be empty');
    });
  });

  describe('Serialization round-trip', () => {
    it('should maintain data integrity through serialization cycle with all properties', () => {
      const original = new Story(
        'user-1',
        'John Doe',
        'avatar1.jpg',
        true,
        true,
        '2024-01-01T10:00:00Z'
      );

      const plainObject = original.toPlainObject();
      const restored = Story.fromPlainObject(plainObject);

      expect(restored.userId).toBe(original.userId);
      expect(restored.userName).toBe(original.userName);
      expect(restored.userAvatar).toBe(original.userAvatar);
      expect(restored.isOnline).toBe(original.isOnline);
      expect(restored.hasStory).toBe(original.hasStory);
      expect(restored.lastUpdated).toBe(original.lastUpdated);
    });

    it('should maintain data integrity through serialization cycle without optional properties', () => {
      const original = new Story(
        'user-2',
        'Jane Smith',
        'avatar2.jpg',
        false,
        false
      );

      const plainObject = original.toPlainObject();
      const restored = Story.fromPlainObject(plainObject);

      expect(restored.userId).toBe(original.userId);
      expect(restored.userName).toBe(original.userName);
      expect(restored.userAvatar).toBe(original.userAvatar);
      expect(restored.isOnline).toBe(original.isOnline);
      expect(restored.hasStory).toBe(original.hasStory);
      expect(restored.lastUpdated).toBe(original.lastUpdated);
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in user name', () => {
      const story = new Story('user-1', 'Jöhn Döé 👋', 'avatar1.jpg', true);

      expect(story.userName).toBe('Jöhn Döé 👋');
    });

    it('should handle very long user names', () => {
      const longName = 'A'.repeat(1000);
      const story = new Story('user-1', longName, 'avatar1.jpg', true);

      expect(story.userName).toBe(longName);
    });

    it('should handle different timestamp formats', () => {
      const story1 = new Story(
        'user-1',
        'John',
        'avatar1.jpg',
        true,
        true,
        '2024-01-01T10:00:00Z'
      );
      const story2 = new Story(
        'user-2',
        'Jane',
        'avatar2.jpg',
        true,
        true,
        '2024-12-31T23:59:59.999Z'
      );

      expect(story1.lastUpdated).toBe('2024-01-01T10:00:00Z');
      expect(story2.lastUpdated).toBe('2024-12-31T23:59:59.999Z');
    });
  });
});
