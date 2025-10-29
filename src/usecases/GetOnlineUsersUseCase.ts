/**
 * Get Online Users Use Case
 *
 * This use case handles retrieving the list of currently online users.
 */

import type { UserStatus } from '@/domain/entities/UserStatus';
import type { UserStatusRepository } from '@/ports/UserStatusRepository';

export class GetOnlineUsersUseCase {
  private readonly userStatusRepository: UserStatusRepository;

  constructor(userStatusRepository: UserStatusRepository) {
    this.userStatusRepository = userStatusRepository;
  }

  /**
   * Execute the use case to get all online users
   */
  async execute(): Promise<UserStatus[]> {
    return await this.userStatusRepository.getOnlineUsers();
  }
}
