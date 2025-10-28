/**
 * Chat Participant Domain Entity
 *
 * Represents a participant in a chat conversation.
 */

export class ChatParticipant {
  public readonly id: string;
  public readonly name: string;
  public readonly avatar: string;
  public readonly isOnline: boolean;
  public readonly role: 'admin' | 'member';

  constructor(
    id: string,
    name: string,
    avatar: string,
    isOnline: boolean,
    role: 'admin' | 'member' = 'member'
  ) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.isOnline = isOnline;
    this.role = role;
    this.validateId(id);
    this.validateName(name);
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('Participant ID cannot be empty');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Participant name cannot be empty');
    }
  }

  /**
   * Check if participant is admin
   */
  isAdmin(): boolean {
    return this.role === 'admin';
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): ChatParticipantPlainObject {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      isOnline: this.isOnline,
      role: this.role,
    };
  }

  /**
   * Create ChatParticipant entity from plain object
   */
  static fromPlainObject(data: ChatParticipantPlainObject): ChatParticipant {
    return new ChatParticipant(
      data.id,
      data.name,
      data.avatar,
      data.isOnline,
      data.role
    );
  }
}

/**
 * Plain object representation for serialization/deserialization
 */
export interface ChatParticipantPlainObject {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role: 'admin' | 'member';
}
