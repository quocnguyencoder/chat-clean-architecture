/**
 * Chat Domain Entity
 *
 * Represents a chat conversation in the domain layer.
 * This is a pure domain entity with no external dependencies.
 */

export interface LastMessage {
  message: string;
  senderId: string;
  senderName?: string;
  time: string;
}

export class Chat {
  public readonly id: string;
  public readonly name: string;
  public readonly lastMessage: LastMessage;
  public readonly avatar: string;
  public readonly isOnline: boolean;
  public readonly unreadCount: number;
  public readonly isGroup: boolean;

  constructor(
    id: string,
    name: string,
    lastMessage: LastMessage,
    avatar: string,
    isOnline: boolean,
    unreadCount: number = 0,
    isGroup: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.lastMessage = lastMessage;
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
   * Get formatted last message with "You: " prefix if sent by current user
   * For group chats, shows sender name for messages from others
   */
  getFormattedLastMessage(currentUserId: string): string {
    // Handle empty message (new chat)
    if (!this.lastMessage.message || this.lastMessage.message.trim() === '') {
      return 'Start a conversation...';
    }

    if (this.lastMessage.senderId === currentUserId) {
      return `You: ${this.lastMessage.message}`;
    }

    // For group chats, show sender name for messages from others
    if (this.isGroup && this.lastMessage.senderName) {
      return `${this.lastMessage.senderName}: ${this.lastMessage.message}`;
    }

    return this.lastMessage.message;
  }

  /**
   * Check if chat has any messages
   */
  hasMessages(): boolean {
    return this.lastMessage.message !== '' && this.lastMessage.senderId !== '';
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): ChatPlainObject {
    return {
      id: this.id,
      name: this.name,
      lastMessage: this.lastMessage,
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
  lastMessage: LastMessage;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
  isGroup: boolean;
}
