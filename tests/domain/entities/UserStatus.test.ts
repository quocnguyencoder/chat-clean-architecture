import { describe, expect, it } from 'vitest';

import { UserStatus } from '@/domain/entities/UserStatus';

describe('UserStatus Entity', () => {
  describe('Constructor and Validation', () => {
    it('should create user status with online status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.userId).toBe('user-1');
      expect(userStatus.status).toBe('online');
      expect(userStatus.lastOnlineTime).toBe('2024-01-01T10:00:00Z');
    });

    it('should create user status with offline status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'offline',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.status).toBe('offline');
    });

    it('should create user status with away status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'away',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.status).toBe('away');
    });

    it('should throw error for empty user ID', () => {
      expect(() => {
        new UserStatus('', 'online', '2024-01-01T10:00:00Z');
      }).toThrow('User ID cannot be empty');
    });

    it('should throw error for whitespace-only user ID', () => {
      expect(() => {
        new UserStatus('   ', 'online', '2024-01-01T10:00:00Z');
      }).toThrow('User ID cannot be empty');
    });

    it('should throw error for empty lastOnlineTime', () => {
      expect(() => {
        new UserStatus('user-1', 'online', '');
      }).toThrow('Last online time cannot be empty');
    });

    it('should throw error for whitespace-only lastOnlineTime', () => {
      expect(() => {
        new UserStatus('user-1', 'online', '   ');
      }).toThrow('Last online time cannot be empty');
    });
  });

  describe('isOnline', () => {
    it('should return true for online status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isOnline()).toBe(true);
    });

    it('should return false for offline status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'offline',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isOnline()).toBe(false);
    });

    it('should return false for away status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'away',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isOnline()).toBe(false);
    });
  });

  describe('isAway', () => {
    it('should return true for away status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'away',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isAway()).toBe(true);
    });

    it('should return false for online status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isAway()).toBe(false);
    });

    it('should return false for offline status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'offline',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isAway()).toBe(false);
    });
  });

  describe('isOffline', () => {
    it('should return true for offline status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'offline',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isOffline()).toBe(true);
    });

    it('should return false for online status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isOffline()).toBe(false);
    });

    it('should return false for away status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'away',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.isOffline()).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('should convert to plain object with online status', () => {
      const userStatus = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      const plainObject = userStatus.toPlainObject();

      expect(plainObject).toEqual({
        userId: 'user-1',
        status: 'online',
        lastOnlineTime: '2024-01-01T10:00:00Z',
      });
    });

    it('should convert to plain object with offline status', () => {
      const userStatus = new UserStatus(
        'user-2',
        'offline',
        '2024-01-02T15:30:00Z'
      );

      const plainObject = userStatus.toPlainObject();

      expect(plainObject).toEqual({
        userId: 'user-2',
        status: 'offline',
        lastOnlineTime: '2024-01-02T15:30:00Z',
      });
    });

    it('should convert to plain object with away status', () => {
      const userStatus = new UserStatus(
        'user-3',
        'away',
        '2024-01-03T12:00:00Z'
      );

      const plainObject = userStatus.toPlainObject();

      expect(plainObject).toEqual({
        userId: 'user-3',
        status: 'away',
        lastOnlineTime: '2024-01-03T12:00:00Z',
      });
    });

    it('should not be instance of UserStatus', () => {
      const userStatus = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      const plainObject = userStatus.toPlainObject();

      expect(plainObject).not.toBeInstanceOf(UserStatus);
    });
  });

  describe('fromPlainObject', () => {
    it('should create UserStatus from plain object with online status', () => {
      const plainObject = {
        userId: 'user-1',
        status: 'online' as const,
        lastOnlineTime: '2024-01-01T10:00:00Z',
      };

      const userStatus = UserStatus.fromPlainObject(plainObject);

      expect(userStatus).toBeInstanceOf(UserStatus);
      expect(userStatus.userId).toBe('user-1');
      expect(userStatus.status).toBe('online');
      expect(userStatus.lastOnlineTime).toBe('2024-01-01T10:00:00Z');
    });

    it('should create UserStatus from plain object with offline status', () => {
      const plainObject = {
        userId: 'user-2',
        status: 'offline' as const,
        lastOnlineTime: '2024-01-02T15:30:00Z',
      };

      const userStatus = UserStatus.fromPlainObject(plainObject);

      expect(userStatus.status).toBe('offline');
      expect(userStatus.isOffline()).toBe(true);
    });

    it('should create UserStatus from plain object with away status', () => {
      const plainObject = {
        userId: 'user-3',
        status: 'away' as const,
        lastOnlineTime: '2024-01-03T12:00:00Z',
      };

      const userStatus = UserStatus.fromPlainObject(plainObject);

      expect(userStatus.status).toBe('away');
      expect(userStatus.isAway()).toBe(true);
    });

    it('should restore entity methods', () => {
      const plainObject = {
        userId: 'user-1',
        status: 'online' as const,
        lastOnlineTime: '2024-01-01T10:00:00Z',
      };

      const userStatus = UserStatus.fromPlainObject(plainObject);

      expect(userStatus.isOnline()).toBe(true);
      expect(userStatus.isAway()).toBe(false);
      expect(userStatus.isOffline()).toBe(false);
      expect(typeof userStatus.toPlainObject).toBe('function');
    });

    it('should throw error for invalid plain object with empty user ID', () => {
      const plainObject = {
        userId: '',
        status: 'online' as const,
        lastOnlineTime: '2024-01-01T10:00:00Z',
      };

      expect(() => {
        UserStatus.fromPlainObject(plainObject);
      }).toThrow('User ID cannot be empty');
    });

    it('should throw error for invalid plain object with empty lastOnlineTime', () => {
      const plainObject = {
        userId: 'user-1',
        status: 'online' as const,
        lastOnlineTime: '',
      };

      expect(() => {
        UserStatus.fromPlainObject(plainObject);
      }).toThrow('Last online time cannot be empty');
    });
  });

  describe('Serialization round-trip', () => {
    it('should maintain data integrity through serialization cycle for online status', () => {
      const original = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );

      const plainObject = original.toPlainObject();
      const restored = UserStatus.fromPlainObject(plainObject);

      expect(restored.userId).toBe(original.userId);
      expect(restored.status).toBe(original.status);
      expect(restored.lastOnlineTime).toBe(original.lastOnlineTime);
    });

    it('should maintain data integrity through serialization cycle for offline status', () => {
      const original = new UserStatus(
        'user-2',
        'offline',
        '2024-01-02T15:30:00Z'
      );

      const plainObject = original.toPlainObject();
      const restored = UserStatus.fromPlainObject(plainObject);

      expect(restored.userId).toBe(original.userId);
      expect(restored.status).toBe(original.status);
      expect(restored.lastOnlineTime).toBe(original.lastOnlineTime);
    });

    it('should maintain data integrity through serialization cycle for away status', () => {
      const original = new UserStatus('user-3', 'away', '2024-01-03T12:00:00Z');

      const plainObject = original.toPlainObject();
      const restored = UserStatus.fromPlainObject(plainObject);

      expect(restored.userId).toBe(original.userId);
      expect(restored.status).toBe(original.status);
      expect(restored.lastOnlineTime).toBe(original.lastOnlineTime);
    });

    it('should maintain method functionality after deserialization', () => {
      const original = new UserStatus('user-1', 'away', '2024-01-01T10:00:00Z');

      const restored = UserStatus.fromPlainObject(original.toPlainObject());

      expect(restored.isOnline()).toBe(original.isOnline());
      expect(restored.isAway()).toBe(original.isAway());
      expect(restored.isOffline()).toBe(original.isOffline());
    });
  });

  describe('Edge cases', () => {
    it('should handle different timestamp formats', () => {
      const userStatus1 = new UserStatus(
        'user-1',
        'online',
        '2024-01-01T10:00:00Z'
      );
      const userStatus2 = new UserStatus(
        'user-2',
        'offline',
        '2024-12-31T23:59:59.999Z'
      );

      expect(userStatus1.lastOnlineTime).toBe('2024-01-01T10:00:00Z');
      expect(userStatus2.lastOnlineTime).toBe('2024-12-31T23:59:59.999Z');
    });

    it('should handle special characters in user ID', () => {
      const userStatus = new UserStatus(
        'user-123-abc_DEF',
        'online',
        '2024-01-01T10:00:00Z'
      );

      expect(userStatus.userId).toBe('user-123-abc_DEF');
    });
  });
});
