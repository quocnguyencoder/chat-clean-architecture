/**
 * Mock Service Helper Functions
 *
 * Utility functions for mock services.
 */

import { mockConfig } from '@/config/mockConfig';

/**
 * Get a random delay within the configured response time range
 *
 * @returns Random delay in milliseconds between minDelay and maxDelay
 */
export const getRandomResponseDelay = (): number => {
  const { minDelay, maxDelay } = mockConfig.response;
  return minDelay + Math.random() * (maxDelay - minDelay);
};
