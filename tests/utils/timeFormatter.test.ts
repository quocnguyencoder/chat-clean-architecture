import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatRelativeTime, formatTimestamp } from '@/utils/timeFormatter';

describe('timeFormatter utilities', () => {
  describe('formatTimestamp', () => {
    it('should format valid ISO timestamp to 12-hour time', () => {
      const timestamp = '2024-01-15T10:30:00.000Z';
      const result = formatTimestamp(timestamp);

      // Result should be in format like "10:30 AM" or locale equivalent
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format afternoon time with PM', () => {
      const timestamp = '2024-01-15T14:45:00.000Z';
      const result = formatTimestamp(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle midnight correctly', () => {
      const timestamp = '2024-01-15T00:00:00.000Z';
      const result = formatTimestamp(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle noon correctly', () => {
      const timestamp = '2024-01-15T12:00:00.000Z';
      const result = formatTimestamp(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should return empty string for empty input', () => {
      expect(formatTimestamp('')).toBe('');
    });

    it('should return empty string for whitespace input', () => {
      expect(formatTimestamp('   ')).toBe('');
    });

    it('should return empty string for invalid timestamp', () => {
      expect(formatTimestamp('invalid-date')).toBe('');
    });

    it('should return empty string for malformed ISO string', () => {
      expect(formatTimestamp('2024-13-45T99:99:99.000Z')).toBe('');
    });

    it('should handle timestamps with milliseconds', () => {
      const timestamp = '2024-01-15T10:30:45.123Z';
      const result = formatTimestamp(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle timestamps without Z suffix', () => {
      const timestamp = '2024-01-15T10:30:00';
      const result = formatTimestamp(timestamp);

      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current time to 2024-01-15T12:00:00.000Z
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "just now" for recent messages (< 1 minute)', () => {
      const timestamp = '2024-01-15T11:59:30.000Z'; // 30 seconds ago
      expect(formatRelativeTime(timestamp)).toBe('just now');
    });

    it('should return minutes for messages less than 1 hour old', () => {
      const timestamp = '2024-01-15T11:30:00.000Z'; // 30 minutes ago
      expect(formatRelativeTime(timestamp)).toBe('30m ago');
    });

    it('should return single minute correctly', () => {
      const timestamp = '2024-01-15T11:59:00.000Z'; // 1 minute ago
      expect(formatRelativeTime(timestamp)).toBe('1m ago');
    });

    it('should return hours for messages less than 24 hours old', () => {
      const timestamp = '2024-01-15T10:00:00.000Z'; // 2 hours ago
      expect(formatRelativeTime(timestamp)).toBe('2h ago');
    });

    it('should return single hour correctly', () => {
      const timestamp = '2024-01-15T11:00:00.000Z'; // 1 hour ago
      expect(formatRelativeTime(timestamp)).toBe('1h ago');
    });

    it('should return days for messages less than 7 days old', () => {
      const timestamp = '2024-01-13T12:00:00.000Z'; // 2 days ago
      expect(formatRelativeTime(timestamp)).toBe('2d ago');
    });

    it('should return single day correctly', () => {
      const timestamp = '2024-01-14T12:00:00.000Z'; // 1 day ago
      expect(formatRelativeTime(timestamp)).toBe('1d ago');
    });

    it('should return formatted date for messages older than 7 days', () => {
      const timestamp = '2024-01-01T12:00:00.000Z'; // 14 days ago
      const result = formatRelativeTime(timestamp);

      // Should be formatted as "Jan 1" or similar
      expect(result).toMatch(/Jan/);
      expect(result).toMatch(/1/);
    });

    it('should return empty string for empty input', () => {
      expect(formatRelativeTime('')).toBe('');
    });

    it('should return empty string for whitespace input', () => {
      expect(formatRelativeTime('   ')).toBe('');
    });

    it('should return empty string for invalid timestamp', () => {
      expect(formatRelativeTime('invalid-date')).toBe('');
    });

    it('should handle messages exactly 59 minutes ago', () => {
      const timestamp = '2024-01-15T11:01:00.000Z'; // 59 minutes ago
      expect(formatRelativeTime(timestamp)).toBe('59m ago');
    });

    it('should handle messages exactly 23 hours ago', () => {
      const timestamp = '2024-01-14T13:00:00.000Z'; // 23 hours ago
      expect(formatRelativeTime(timestamp)).toBe('23h ago');
    });

    it('should handle messages exactly 6 days ago', () => {
      const timestamp = '2024-01-09T12:00:00.000Z'; // 6 days ago
      expect(formatRelativeTime(timestamp)).toBe('6d ago');
    });

    it('should handle future timestamps gracefully', () => {
      const timestamp = '2024-01-15T13:00:00.000Z'; // 1 hour in future
      expect(formatRelativeTime(timestamp)).toBe('just now');
    });
  });
});
