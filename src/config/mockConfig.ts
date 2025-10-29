/**
 * Mock Service Configuration
 *
 * Configuration settings for mock responses and auto-send functionality.
 * Centralized place to adjust timing and behavior of mock services.
 */

export const mockConfig = {
  /**
   * Mock response timing settings
   */
  response: {
    /**
     * Minimum delay before sending a mock response (in milliseconds)
     * @default 4000 (4 seconds)
     */
    minDelay: 4000,

    /**
     * Maximum delay before sending a mock response (in milliseconds)
     * @default 5000 (5 seconds)
     */
    maxDelay: 5000,
  },

  /**
   * Auto-send message settings
   */
  autoSend: {
    /**
     * Interval between auto-sending messages to random chats (in milliseconds)
     * @default 10000 (10 seconds)
     */
    interval: 10000,

    /**
     * Whether auto-send is enabled by default
     * @default true
     */
    enabled: true,
  },

  /**
   * Service behavior settings
   */
  behavior: {
    /**
     * Whether mock responses are paused by default
     * @default true
     */
    startPaused: true,

    /**
     * Whether to log mock service activity to console
     * @default true
     */
    enableLogging: true,
  },
} as const;
