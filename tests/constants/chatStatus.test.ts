import { describe, expect, it } from 'vitest';

import {
  CHAT_STATUS_COLORS,
  CHAT_STATUS_TEXT,
  getStatusColor,
  getStatusText,
} from '@/constants/chatStatus';
import { theme } from '@/constants/theme';

describe('Chat Status Constants', () => {
  describe('CHAT_STATUS_TEXT', () => {
    it('should have GROUP text', () => {
      expect(CHAT_STATUS_TEXT.GROUP).toBe('Group');
    });

    it('should have ACTIVE text', () => {
      expect(CHAT_STATUS_TEXT.ACTIVE).toBe('Active now');
    });

    it('should have OFFLINE text', () => {
      expect(CHAT_STATUS_TEXT.OFFLINE).toBe('Offline');
    });
  });

  describe('CHAT_STATUS_COLORS', () => {
    it('should have GROUP color', () => {
      expect(CHAT_STATUS_COLORS.GROUP).toBe(theme.colors.text.secondary);
    });

    it('should have ACTIVE color', () => {
      expect(CHAT_STATUS_COLORS.ACTIVE).toBe(theme.colors.success);
    });

    it('should have OFFLINE color', () => {
      expect(CHAT_STATUS_COLORS.OFFLINE).toBe(theme.colors.text.secondary);
    });
  });

  describe('getStatusText', () => {
    it('should return GROUP text for group chat', () => {
      const result = getStatusText(true, false);

      expect(result).toBe(CHAT_STATUS_TEXT.GROUP);
    });

    it('should return GROUP text for group chat even if online', () => {
      const result = getStatusText(true, true);

      expect(result).toBe(CHAT_STATUS_TEXT.GROUP);
    });

    it('should return ACTIVE text for non-group online chat', () => {
      const result = getStatusText(false, true);

      expect(result).toBe(CHAT_STATUS_TEXT.ACTIVE);
    });

    it('should return OFFLINE text for non-group offline chat', () => {
      const result = getStatusText(false, false);

      expect(result).toBe(CHAT_STATUS_TEXT.OFFLINE);
    });
  });

  describe('getStatusColor', () => {
    it('should return GROUP color for group chat', () => {
      const result = getStatusColor(true, false);

      expect(result).toBe(CHAT_STATUS_COLORS.GROUP);
    });

    it('should return GROUP color for group chat even if online', () => {
      const result = getStatusColor(true, true);

      expect(result).toBe(CHAT_STATUS_COLORS.GROUP);
    });

    it('should return ACTIVE color for non-group online chat', () => {
      const result = getStatusColor(false, true);

      expect(result).toBe(CHAT_STATUS_COLORS.ACTIVE);
    });

    it('should return OFFLINE color for non-group offline chat', () => {
      const result = getStatusColor(false, false);

      expect(result).toBe(CHAT_STATUS_COLORS.OFFLINE);
    });
  });

  describe('Integration with theme', () => {
    it('should use consistent theme colors', () => {
      expect(CHAT_STATUS_COLORS.GROUP).toBe(CHAT_STATUS_COLORS.OFFLINE);
      expect(CHAT_STATUS_COLORS.ACTIVE).toBe(theme.colors.success);
    });

    it('should return theme-based colors from getStatusColor', () => {
      const groupColor = getStatusColor(true, false);
      const activeColor = getStatusColor(false, true);
      const offlineColor = getStatusColor(false, false);

      expect(groupColor).toBe(theme.colors.text.secondary);
      expect(activeColor).toBe(theme.colors.success);
      expect(offlineColor).toBe(theme.colors.text.secondary);
    });
  });

  describe('Function consistency', () => {
    it('should return consistent values for same inputs', () => {
      const text1 = getStatusText(true, true);
      const text2 = getStatusText(true, true);

      expect(text1).toBe(text2);
    });

    it('should return consistent colors for same inputs', () => {
      const color1 = getStatusColor(false, true);
      const color2 = getStatusColor(false, true);

      expect(color1).toBe(color2);
    });
  });

  describe('Edge cases', () => {
    it('should handle all boolean combinations for getStatusText', () => {
      const results = [
        getStatusText(true, true),
        getStatusText(true, false),
        getStatusText(false, true),
        getStatusText(false, false),
      ];

      expect(results).toHaveLength(4);
      expect(results.every(r => typeof r === 'string')).toBe(true);
    });

    it('should handle all boolean combinations for getStatusColor', () => {
      const results = [
        getStatusColor(true, true),
        getStatusColor(true, false),
        getStatusColor(false, true),
        getStatusColor(false, false),
      ];

      expect(results).toHaveLength(4);
      expect(results.every(r => typeof r === 'string')).toBe(true);
    });

    it('should prioritize group status over online status', () => {
      const groupOnline = getStatusText(true, true);
      const groupOffline = getStatusText(true, false);

      expect(groupOnline).toBe(groupOffline);
      expect(groupOnline).toBe(CHAT_STATUS_TEXT.GROUP);
    });
  });
});
