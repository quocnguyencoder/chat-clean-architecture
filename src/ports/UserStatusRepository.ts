/**
 * UserStatus Repository Port
 *
 * This interface defines the contract for user status data access.
 * Implementations can use different data sources (LocalStorage, API, etc.)
 */

import type { UserStatus } from '@/domain/entities/UserStatus';

export interface UserStatusRepository {
  /**
   * Get status for all users
   */
  getAllUserStatuses(): Promise<UserStatus[]>;

  /**
   * Get status for a specific user
   */
  getUserStatus(userId: string): Promise<UserStatus | null>;

  /**
   * Update user status
   */
  updateUserStatus(
    userId: string,
    status: 'online' | 'offline' | 'away'
  ): Promise<void>;

  /**
   * Update last online time
   */
  updateLastOnlineTime(userId: string, time: string): Promise<void>;

  /**
   * Get all online users
   */
  getOnlineUsers(): Promise<UserStatus[]>;
}
