import { describe, expect, it, vi } from 'vitest';

import {
  generateChatId,
  generateMessageId,
  generateUserId,
  generateUUID,
  isValidUUID,
} from '@/utils/uuid';

// Mock uuid module
vi.mock('uuid', () => ({
  v4: vi.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
}));

describe('uuid utilities', () => {
  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = generateUUID();
      expect(uuid).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should return a string', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
    });
  });

  describe('generateUserId', () => {
    it('should generate a valid user ID', () => {
      const userId = generateUserId();
      expect(userId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should return a UUID format', () => {
      const userId = generateUserId();
      expect(isValidUUID(userId)).toBe(true);
    });
  });

  describe('generateChatId', () => {
    it('should generate a valid chat ID', () => {
      const chatId = generateChatId();
      expect(chatId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should return a UUID format', () => {
      const chatId = generateChatId();
      expect(isValidUUID(chatId)).toBe(true);
    });
  });

  describe('generateMessageId', () => {
    it('should generate a valid message ID', () => {
      const messageId = generateMessageId();
      expect(messageId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should return a UUID format', () => {
      const messageId = generateMessageId();
      expect(isValidUUID(messageId)).toBe(true);
    });
  });

  describe('isValidUUID', () => {
    it('should return true for valid UUID v4', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return true for different valid UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('c73bcdcc-2669-4bf6-81d3-e4ae73fb11fd')).toBe(true);
      expect(isValidUUID('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')).toBe(true);
    });

    it('should return true for uppercase UUID', () => {
      expect(isValidUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });

    it('should return true for mixed case UUID', () => {
      expect(isValidUUID('550e8400-E29B-41d4-A716-446655440000')).toBe(true);
    });

    it('should return false for UUID without hyphens', () => {
      expect(isValidUUID('550e8400e29b41d4a716446655440000')).toBe(false);
    });

    it('should return false for UUID with wrong version', () => {
      // Version 1 UUID (first digit of third group should be 4)
      expect(isValidUUID('550e8400-e29b-11d4-a716-446655440000')).toBe(false);
    });

    it('should return false for UUID with wrong variant', () => {
      // Variant should be 8, 9, a, or b (first character of fourth group)
      expect(isValidUUID('550e8400-e29b-41d4-1716-446655440000')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidUUID('')).toBe(false);
    });

    it('should return false for random string', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
    });

    it('should return false for string with correct length but wrong format', () => {
      expect(isValidUUID('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).toBe(false);
    });

    it('should return false for UUID with too many characters', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-4466554400001')).toBe(false);
    });

    it('should return false for UUID with too few characters', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-44665544000')).toBe(false);
    });

    it('should return false for null input', () => {
      expect(isValidUUID(null as unknown as string)).toBe(false);
    });

    it('should return false for undefined input', () => {
      expect(isValidUUID(undefined as unknown as string)).toBe(false);
    });

    it('should return false for number input', () => {
      expect(isValidUUID(123 as unknown as string)).toBe(false);
    });
  });
});
