/**
 * Initialize User Status Data
 *
 * This utility initializes the UserStatusRepository with mock data
 * if no data exists in storage.
 */

import { mockUserStatuses } from '@/mocks/userStatuses';
import type { UserStatusRepository } from '@/ports/UserStatusRepository';

const STORAGE_KEY = 'chat-user-statuses';

/**
 * Initialize user status data in the repository if not already present
 */
export async function initializeUserStatusData(
  repository: UserStatusRepository
): Promise<void> {
  // Check if data already exists in storage
  const existingData = localStorage.getItem(STORAGE_KEY);

  if (!existingData || existingData === '[]') {
    // Initialize with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUserStatuses));

    // Verify by loading through repository
    const statuses = await repository.getAllUserStatuses();
    // eslint-disable-next-line no-console
    console.log(
      `Initialized ${statuses.length} user statuses in the repository`
    );
  }
}
