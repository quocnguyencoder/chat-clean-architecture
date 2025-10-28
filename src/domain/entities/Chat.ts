/**
 * Chat Domain Entity
 *
 * Represents a chat conversation in the domain layer.
 * This is a pure domain entity with no external dependencies.
 */

export class Chat {
  public readonly id: string;
  public readonly name: string;
  public readonly lastMessage: string;
  public readonly time: string;
  public readonly avatar: string;
  public readonly isOnline: boolean;
  public readonly unreadCount: number;
  public readonly isGroup: boolean;

  constructor(
    id: string,
    name: string,
    lastMessage: string,
    time: string,
    avatar: string,
    isOnline: boolean,
    unreadCount: number = 0,
    isGroup: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.lastMessage = lastMessage;
    this.time = time;
    this.avatar = avatar;
    this.isOnline = isOnline;
    this.unreadCount = unreadCount;
    this.isGroup = isGroup;
    this.validateId(id);
    this.validateName(name);
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('Chat ID cannot be empty');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Chat name cannot be empty');
    }
  }

  /**
   * Domain method to check if chat has unread messages
   */
  hasUnreadMessages(): boolean {
    return this.unreadCount > 0;
  }

  /**
   * Domain method to get display name with type indicator
   */
  getDisplayName(): string {
    return this.isGroup ? `${this.name} (Group)` : this.name;
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): ChatPlainObject {
    return {
      id: this.id,
      name: this.name,
      lastMessage: this.lastMessage,
      time: this.time,
      avatar: this.avatar,
      isOnline: this.isOnline,
      unreadCount: this.unreadCount,
      isGroup: this.isGroup,
    };
  }

  /**
   * Create Chat entity from plain object
   */
  static fromPlainObject(data: ChatPlainObject): Chat {
    return new Chat(
      data.id,
      data.name,
      data.lastMessage,
      data.time,
      data.avatar,
      data.isOnline,
      data.unreadCount,
      data.isGroup
    );
  }
}

/**
 * Plain object representation for serialization/deserialization
 */
export interface ChatPlainObject {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
  isGroup: boolean;
}
