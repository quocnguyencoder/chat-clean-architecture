import { describe, expect, it } from 'vitest';

import {
  DICEBEAR_CONFIG,
  generateAvatarUrl,
  generateGroupAvatar,
  generateUserAvatar,
  getDefaultAvatar,
} from '@/utils/avatar';

describe('avatar utilities', () => {
  describe('DICEBEAR_CONFIG', () => {
    it('should have correct BASE_URL', () => {
      expect(DICEBEAR_CONFIG.BASE_URL).toBe('https://api.dicebear.com/7.x');
    });

    it('should have correct STYLES', () => {
      expect(DICEBEAR_CONFIG.STYLES.AVATAAARS).toBe('avataaars');
      expect(DICEBEAR_CONFIG.STYLES.INITIALS).toBe('initials');
    });

    it('should have correct DEFAULT_SEEDS', () => {
      expect(DICEBEAR_CONFIG.DEFAULT_SEEDS.USER).toBe('default-user');
      expect(DICEBEAR_CONFIG.DEFAULT_SEEDS.GROUP).toBe('default-group');
    });
  });

  describe('generateAvatarUrl', () => {
    it('should generate URL with default parameters', () => {
      const url = generateAvatarUrl('John Doe');
      expect(url).toBe(
        'https://api.dicebear.com/7.x/avataaars/svg?seed=john-doe&backgroundColor=f0f0f0'
      );
    });

    it('should normalize seed by converting to lowercase', () => {
      const url = generateAvatarUrl('JOHN DOE');
      expect(url).toContain('seed=john-doe');
    });

    it('should replace spaces with hyphens in seed', () => {
      const url = generateAvatarUrl('John   Doe   Smith');
      expect(url).toContain('seed=john-doe-smith');
    });

    it('should use avataaars style by default', () => {
      const url = generateAvatarUrl('test');
      expect(url).toContain('/avataaars/svg');
    });

    it('should use initials style when specified', () => {
      const url = generateAvatarUrl('test', 'INITIALS');
      expect(url).toContain('/initials/svg');
    });

    it('should use custom background color when provided', () => {
      const url = generateAvatarUrl('test', 'AVATAAARS', 'ff0000');
      expect(url).toContain('backgroundColor=ff0000');
    });

    it('should use default background color f0f0f0 when not provided', () => {
      const url = generateAvatarUrl('test');
      expect(url).toContain('backgroundColor=f0f0f0');
    });

    it('should handle empty string seed', () => {
      const url = generateAvatarUrl('');
      expect(url).toContain('seed=');
      expect(url).toMatch(/\?seed=&/);
    });

    it('should handle special characters in seed', () => {
      const url = generateAvatarUrl('John@Doe!');
      expect(url).toContain('seed=john@doe!');
    });
  });

  describe('generateUserAvatar', () => {
    it('should generate user avatar with correct style', () => {
      const url = generateUserAvatar('John Doe');
      expect(url).toContain('/avataaars/svg');
    });

    it('should use blue background color (1976d2)', () => {
      const url = generateUserAvatar('John Doe');
      expect(url).toContain('backgroundColor=1976d2');
    });

    it('should normalize user name', () => {
      const url = generateUserAvatar('John Doe');
      expect(url).toContain('seed=john-doe');
    });

    it('should handle single name', () => {
      const url = generateUserAvatar('John');
      expect(url).toBe(
        'https://api.dicebear.com/7.x/avataaars/svg?seed=john&backgroundColor=1976d2'
      );
    });
  });

  describe('generateGroupAvatar', () => {
    it('should generate group avatar with initials style', () => {
      const url = generateGroupAvatar('Team Awesome');
      expect(url).toContain('/initials/svg');
    });

    it('should normalize group name', () => {
      const url = generateGroupAvatar('Team Awesome');
      expect(url).toContain('seed=team-awesome');
    });

    it('should not include backgroundColor parameter', () => {
      const url = generateGroupAvatar('Team');
      expect(url).not.toContain('backgroundColor');
    });

    it('should handle single word group name', () => {
      const url = generateGroupAvatar('Developers');
      expect(url).toBe(
        'https://api.dicebear.com/7.x/initials/svg?seed=developers'
      );
    });

    it('should handle multiple spaces in group name', () => {
      const url = generateGroupAvatar('My   Cool   Team');
      expect(url).toContain('seed=my-cool-team');
    });
  });

  describe('getDefaultAvatar', () => {
    it('should return user default avatar when isGroup is false', () => {
      const url = getDefaultAvatar(false);
      expect(url).toContain('/avataaars/svg');
      expect(url).toContain('seed=default-user');
      expect(url).toContain('backgroundColor=1976d2');
    });

    it('should return user default avatar when no parameter', () => {
      const url = getDefaultAvatar();
      expect(url).toContain('/avataaars/svg');
      expect(url).toContain('seed=default-user');
    });

    it('should return group default avatar when isGroup is true', () => {
      const url = getDefaultAvatar(true);
      expect(url).toContain('/initials/svg');
      expect(url).toContain('seed=default-group');
      expect(url).not.toContain('backgroundColor');
    });

    it('should generate complete URLs', () => {
      const userUrl = getDefaultAvatar(false);
      const groupUrl = getDefaultAvatar(true);

      expect(userUrl).toMatch(/^https:\/\//);
      expect(groupUrl).toMatch(/^https:\/\//);
    });
  });
});
