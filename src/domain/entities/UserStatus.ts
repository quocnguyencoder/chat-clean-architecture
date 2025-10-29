/**
 * UserStatus Domain Entity
 *
 * Represents a user's online status and presence information.
 * This is a pure domain entity with no external dependencies.
 */

export class UserStatus {
  public readonly userId: string;
  public readonly status: 'online' | 'offline' | 'away';
  public readonly lastOnlineTime: string; // ISO 8601 format

  constructor(
    userId: string,
    status: 'online' | 'offline' | 'away',
    lastOnlineTime: string
  ) {
    this.userId = userId;
    this.status = status;
    this.lastOnlineTime = lastOnlineTime;
    this.validateUserId(userId);
    this.validateLastOnlineTime(lastOnlineTime);
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  private validateLastOnlineTime(lastOnlineTime: string): void {
    if (!lastOnlineTime || lastOnlineTime.trim().length === 0) {
      throw new Error('Last online time cannot be empty');
    }
  }

  /**
   * Check if user is currently online
   */
  isOnline(): boolean {
    return this.status === 'online';
  }

  /**
   * Check if user is away
   */
  isAway(): boolean {
    return this.status === 'away';
  }

  /**
   * Check if user is offline
   */
  isOffline(): boolean {
    return this.status === 'offline';
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): UserStatusPlainObject {
    return {
      userId: this.userId,
      status: this.status,
      lastOnlineTime: this.lastOnlineTime,
    };
  }

  /**
   * Create UserStatus entity from plain object
   */
  static fromPlainObject(data: UserStatusPlainObject): UserStatus {
    return new UserStatus(data.userId, data.status, data.lastOnlineTime);
  }
}

/**
 * Plain object representation for serialization/deserialization
 */
export interface UserStatusPlainObject {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastOnlineTime: string;
}
