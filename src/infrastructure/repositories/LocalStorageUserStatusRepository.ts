/**
 * LocalStorage-based UserStatus Repository Implementation
 *
 * This implementation stores user status data in browser's LocalStorage.
 */

import { UserStatus } from '@/domain/entities/UserStatus';
import type { UserStatusRepository } from '@/ports/UserStatusRepository';

const STORAGE_KEY = 'chat-user-statuses';

export class LocalStorageUserStatusRepository implements UserStatusRepository {
  /**
   * Get all user statuses from storage
   */
  async getAllUserStatuses(): Promise<UserStatus[]> {
    const data = this.getStorageData();
    return data.map(item => UserStatus.fromPlainObject(item));
  }

  /**
   * Get status for a specific user
   */
  async getUserStatus(userId: string): Promise<UserStatus | null> {
    const data = this.getStorageData();
    const userStatusData = data.find(item => item.userId === userId);

    if (!userStatusData) {
      return null;
    }

    return UserStatus.fromPlainObject(userStatusData);
  }

  /**
   * Update user status
   */
  async updateUserStatus(
    userId: string,
    status: 'online' | 'offline' | 'away'
  ): Promise<void> {
    const data = this.getStorageData();
    const index = data.findIndex(item => item.userId === userId);

    if (index !== -1) {
      data[index].status = status;
      // Update last online time when going offline
      if (status === 'offline') {
        data[index].lastOnlineTime = new Date().toISOString();
      }
    } else {
      // Create new user status if doesn't exist
      data.push({
        userId,
        status,
        lastOnlineTime: new Date().toISOString(),
      });
    }

    this.setStorageData(data);
  }

  /**
   * Update last online time
   */
  async updateLastOnlineTime(userId: string, time: string): Promise<void> {
    const data = this.getStorageData();
    const index = data.findIndex(item => item.userId === userId);

    if (index !== -1) {
      data[index].lastOnlineTime = time;
      this.setStorageData(data);
    }
  }

  /**
   * Get all online users
   */
  async getOnlineUsers(): Promise<UserStatus[]> {
    const allStatuses = await this.getAllUserStatuses();
    return allStatuses.filter(status => status.isOnline());
  }

  /**
   * Get data from LocalStorage
   */
  private getStorageData(): Array<{
    userId: string;
    status: 'online' | 'offline' | 'away';
    lastOnlineTime: string;
  }> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save data to LocalStorage
   */
  private setStorageData(
    data: Array<{
      userId: string;
      status: 'online' | 'offline' | 'away';
      lastOnlineTime: string;
    }>
  ): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
