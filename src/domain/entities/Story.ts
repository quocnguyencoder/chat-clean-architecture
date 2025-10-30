/**
 * Story Domain Entity
 *
 * Represents a user story/status in the domain layer.
 * This is a pure domain entity with no external dependencies.
 */

export class Story {
  public readonly userId: string;
  public readonly userName: string;
  public readonly userAvatar: string;
  public readonly isOnline: boolean;
  public readonly hasStory: boolean;
  public readonly lastUpdated?: string; // ISO 8601 format

  constructor(
    userId: string,
    userName: string,
    userAvatar: string,
    isOnline: boolean,
    hasStory: boolean = true,
    lastUpdated?: string
  ) {
    this.userId = userId;
    this.userName = userName;
    this.userAvatar = userAvatar;
    this.isOnline = isOnline;
    this.hasStory = hasStory;
    this.lastUpdated = lastUpdated;
    this.validateUserId(userId);
    this.validateUserName(userName);
  }

  private validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  private validateUserName(userName: string): void {
    if (!userName || userName.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): StoryPlainObject {
    return {
      userId: this.userId,
      userName: this.userName,
      userAvatar: this.userAvatar,
      isOnline: this.isOnline,
      hasStory: this.hasStory,
      lastUpdated: this.lastUpdated,
    };
  }

  /**
   * Create Story entity from plain object
   */
  static fromPlainObject(data: StoryPlainObject): Story {
    return new Story(
      data.userId,
      data.userName,
      data.userAvatar,
      data.isOnline,
      data.hasStory,
      data.lastUpdated
    );
  }
}

/**
 * Plain object representation for serialization/deserialization
 */
export interface StoryPlainObject {
  userId: string;
  userName: string;
  userAvatar: string;
  isOnline: boolean;
  hasStory: boolean;
  lastUpdated?: string;
}
