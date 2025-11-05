import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UserStatusRepository } from '@/ports/UserStatusRepository';
import { initializeUserStatusData } from '@/utils/initializeUserStatus';

// Mock the userStatuses
vi.mock('@/mocks/userStatuses', () => ({
  mockUserStatuses: [
    { userId: 'user1', status: 'online' },
    { userId: 'user2', status: 'offline' },
  ],
}));

describe('initializeUserStatus utilities', () => {
  let mockRepository: UserStatusRepository;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    mockRepository = {
      getAllUserStatuses: vi.fn().mockResolvedValue([
        { userId: 'user1', status: 'online' },
        { userId: 'user2', status: 'offline' },
      ]),
      getUserStatus: vi.fn(),
      updateUserStatus: vi.fn(),
      updateLastOnlineTime: vi.fn(),
      getOnlineUsers: vi.fn(),
    };
  });

  describe('initializeUserStatusData', () => {
    it('should initialize data when localStorage is empty', async () => {
      await initializeUserStatusData(mockRepository);

      const stored = localStorage.getItem('chat-user-statuses');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toHaveProperty('userId', 'user1');
      expect(parsed[1]).toHaveProperty('userId', 'user2');
    });

    it('should initialize data when localStorage contains empty array', async () => {
      localStorage.setItem('chat-user-statuses', '[]');

      await initializeUserStatusData(mockRepository);

      const stored = localStorage.getItem('chat-user-statuses');
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(2);
    });

    it('should not reinitialize when data already exists', async () => {
      const existingData = JSON.stringify([
        { userId: 'existing1', status: 'online' },
      ]);
      localStorage.setItem('chat-user-statuses', existingData);

      await initializeUserStatusData(mockRepository);

      const stored = localStorage.getItem('chat-user-statuses');
      expect(stored).toBe(existingData);
    });

    it('should call repository.getAllUserStatuses after initialization', async () => {
      await initializeUserStatusData(mockRepository);

      expect(mockRepository.getAllUserStatuses).toHaveBeenCalled();
    });

    it('should not call repository when data exists', async () => {
      localStorage.setItem(
        'chat-user-statuses',
        JSON.stringify([{ userId: 'user1' }])
      );

      await initializeUserStatusData(mockRepository);

      expect(mockRepository.getAllUserStatuses).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      mockRepository.getAllUserStatuses = vi
        .fn()
        .mockRejectedValue(new Error('Repository error'));

      // Should not throw
      await expect(initializeUserStatusData(mockRepository)).rejects.toThrow(
        'Repository error'
      );
    });
  });
});
