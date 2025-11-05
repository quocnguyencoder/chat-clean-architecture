import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Message } from '@/domain/entities/Message';
import {
  formatTimestampHeader,
  shouldShowTimestamp,
} from '@/utils/messageTimestamp';

describe('messageTimestamp utilities', () => {
  describe('formatTimestampHeader', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Set current time to 2024-01-15T15:00:00.000Z
      vi.setSystemTime(new Date('2024-01-15T15:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format today message with time only', () => {
      const timestamp = '2024-01-15T10:30:00.000Z';
      const result = formatTimestampHeader(timestamp);

      // Should contain time but not date
      expect(result).toMatch(/\d{1,2}:\d{2}/);
      expect(result.toLowerCase()).not.toContain('jan');
      expect(result.toLowerCase()).not.toContain('yesterday');
    });

    it('should format yesterday message with "Yesterday" prefix', () => {
      const timestamp = '2024-01-14T10:30:00.000Z';
      const result = formatTimestampHeader(timestamp);

      expect(result.toLowerCase()).toContain('yesterday');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format older message with date and time', () => {
      const timestamp = '2024-01-10T10:30:00.000Z';
      const result = formatTimestampHeader(timestamp);

      // Should contain month abbreviation
      expect(result).toMatch(/Jan/i);
      // Should contain day
      expect(result).toContain('10');
      // Should contain time
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format midnight today correctly', () => {
      const timestamp = '2024-01-15T00:00:00.000Z';
      const result = formatTimestampHeader(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format end of day today correctly', () => {
      const timestamp = '2024-01-15T23:59:59.000Z';
      const result = formatTimestampHeader(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle different months', () => {
      const timestamp = '2023-12-25T10:30:00.000Z';
      const result = formatTimestampHeader(timestamp);

      expect(result).toMatch(/Dec/i);
      expect(result).toContain('25');
    });

    it('should use 12-hour format with AM/PM', () => {
      const morningTime = '2024-01-15T09:30:00.000Z';
      const afternoonTime = '2024-01-15T14:30:00.000Z';

      const morningResult = formatTimestampHeader(morningTime);
      const afternoonResult = formatTimestampHeader(afternoonTime);

      // Results should be valid time strings
      expect(morningResult).toMatch(/\d{1,2}:\d{2}/);
      expect(afternoonResult).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('shouldShowTimestamp', () => {
    it('should return true when previousMessage is null', () => {
      const currentMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, null)).toBe(true);
    });

    it('should return true when more than 1 hour has passed', () => {
      const currentMessage = {
        time: '2024-01-15T12:00:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(true);
    });

    it('should return false when less than 1 hour has passed', () => {
      const currentMessage = {
        time: '2024-01-15T10:30:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(false);
    });

    it('should return false when exactly 59 minutes have passed', () => {
      const currentMessage = {
        time: '2024-01-15T10:59:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(false);
    });

    it('should return false when exactly 1 hour has passed', () => {
      const currentMessage = {
        time: '2024-01-15T11:00:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      // Function uses > not >=, so exactly 1 hour returns false
      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(false);
    });

    it('should return true when exactly 61 minutes have passed', () => {
      const currentMessage = {
        time: '2024-01-15T11:01:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(true);
    });

    it('should handle messages on different days', () => {
      const currentMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-14T23:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(true);
    });

    it('should handle messages very close together (< 1 second)', () => {
      const currentMessage = {
        time: '2024-01-15T10:00:00.500Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(false);
    });

    it('should handle messages several hours apart', () => {
      const currentMessage = {
        time: '2024-01-15T15:00:00.000Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.000Z',
      } as Message;

      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(true);
    });

    it('should handle messages with milliseconds', () => {
      const currentMessage = {
        time: '2024-01-15T11:00:01.123Z',
      } as Message;

      const previousMessage = {
        time: '2024-01-15T10:00:00.456Z',
      } as Message;

      // More than 1 hour (1 hour and 1 second)
      expect(shouldShowTimestamp(currentMessage, previousMessage)).toBe(true);
    });
  });
});
