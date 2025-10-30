/**
 * Get Stories Use Case
 *
 * This use case handles retrieving stories based on users and their online status.
 * Stories are shown for online users first, followed by recent stories from offline users.
 */

import { Story } from '@/domain/entities/Story';
import { OTHER_USERS } from '@/mocks/users';
import type { UserStatusRepository } from '@/ports/UserStatusRepository';

export class GetStoriesUseCase {
  private readonly userStatusRepository: UserStatusRepository;

  constructor(userStatusRepository: UserStatusRepository) {
    this.userStatusRepository = userStatusRepository;
  }

  /**
   * Execute the use case to get stories
   * Returns stories sorted by online status (online users first)
   */
  async execute(): Promise<Story[]> {
    // Get all user statuses
    const userStatuses = await this.userStatusRepository.getAllUserStatuses();

    // Create a map for quick status lookup
    const statusMap = new Map(
      userStatuses.map(status => [status.userId, status])
    );

    // Generate stories from users (excluding current user)
    const stories: Story[] = OTHER_USERS.map(user => {
      const userStatus = statusMap.get(user.id);
      const isOnline = userStatus?.isOnline() ?? user.isOnline ?? false;

      return new Story(
        user.id,
        user.name,
        user.avatar || '',
        isOnline,
        true, // All users have stories for demo
        new Date().toISOString() // Current time as last updated
      );
    }).sort((a, b) => {
      // Sort by online status first (online users first)
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      // Then by name alphabetically
      return a.userName.localeCompare(b.userName);
    });

    return stories;
  }

  /**
   * Get stories for online users only
   */
  async getOnlineStories(): Promise<Story[]> {
    const allStories = await this.execute();
    return allStories.filter(story => story.isOnline);
  }

  /**
   * Get story for a specific user
   */
  async getUserStory(userId: string): Promise<Story | null> {
    const user = OTHER_USERS.find(u => u.id === userId);
    if (!user) {
      return null;
    }

    const userStatus = await this.userStatusRepository.getUserStatus(userId);
    const isOnline = userStatus?.isOnline() ?? user.isOnline ?? false;

    return new Story(
      user.id,
      user.name,
      user.avatar || '',
      isOnline,
      true,
      new Date().toISOString()
    );
  }
}
