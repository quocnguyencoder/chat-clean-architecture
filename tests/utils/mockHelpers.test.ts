import { describe, expect, it, vi } from 'vitest';

import { getRandomResponseDelay } from '@/utils/mockHelpers';

// Mock the mockConfig
vi.mock('@/config/mockConfig', () => ({
  mockConfig: {
    response: {
      minDelay: 100,
      maxDelay: 500,
    },
  },
}));

describe('mockHelpers utilities', () => {
  describe('getRandomResponseDelay', () => {
    it('should return a number', () => {
      const delay = getRandomResponseDelay();
      expect(typeof delay).toBe('number');
    });

    it('should return a value within the configured range', () => {
      const delay = getRandomResponseDelay();
      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(500);
    });

    it('should return different values on multiple calls', () => {
      const delays = new Set();
      // Generate 100 random delays
      for (let i = 0; i < 100; i++) {
        delays.add(getRandomResponseDelay());
      }

      // Should have at least 10 different values (very likely with 100 calls)
      expect(delays.size).toBeGreaterThan(10);
    });

    it('should not return values below minDelay', () => {
      const delays: number[] = [];
      for (let i = 0; i < 50; i++) {
        delays.push(getRandomResponseDelay());
      }

      delays.forEach(delay => {
        expect(delay).toBeGreaterThanOrEqual(100);
      });
    });

    it('should not return values above maxDelay', () => {
      const delays: number[] = [];
      for (let i = 0; i < 50; i++) {
        delays.push(getRandomResponseDelay());
      }

      delays.forEach(delay => {
        expect(delay).toBeLessThanOrEqual(500);
      });
    });

    it('should have reasonable distribution', () => {
      const delays: number[] = [];
      for (let i = 0; i < 1000; i++) {
        delays.push(getRandomResponseDelay());
      }

      const average = delays.reduce((sum, d) => sum + d, 0) / delays.length;

      // Average should be roughly in the middle (300 ± 100)
      expect(average).toBeGreaterThan(200);
      expect(average).toBeLessThan(400);
    });
  });
});
