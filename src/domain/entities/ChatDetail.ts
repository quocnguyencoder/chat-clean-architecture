/**
 * Chat Detail Domain Entity
 *
 * Represents detailed information about a chat including participants and messages.
 */

import { ChatParticipant } from './ChatParticipant';
import { Message } from './Message';

export class ChatDetail {
  public readonly chatId: string;
  public readonly participants: ChatParticipant[];
  public readonly messages: Message[];

  constructor(
    chatId: string,
    participants: ChatParticipant[],
    messages: Message[]
  ) {
    this.chatId = chatId;
    this.participants = participants;
    this.messages = messages;
    this.validateChatId(chatId);
  }

  private validateChatId(chatId: string): void {
    if (!chatId || chatId.trim().length === 0) {
      throw new Error('Chat ID cannot be empty');
    }
  }

  /**
   * Get participant count
   */
  getParticipantCount(): number {
    return this.participants.length;
  }

  /**
   * Get message count
   */
  getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * Check if chat is group chat
   */
  isGroupChat(): boolean {
    return this.participants.length > 2;
  }

  /**
   * Get admin participants
   */
  getAdmins(): ChatParticipant[] {
    return this.participants.filter(participant => participant.isAdmin());
  }

  /**
   * Get online participants
   */
  getOnlineParticipants(): ChatParticipant[] {
    return this.participants.filter(participant => participant.isOnline);
  }

  /**
   * Get messages sorted by time (oldest first)
   */
  getMessagesSortedByTime(): Message[] {
    return [...this.messages].sort((a, b) => {
      // Simple string comparison for now
      // In real app, you'd want proper date parsing
      return a.time.localeCompare(b.time);
    });
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): ChatDetailPlainObject {
    return {
      chatId: this.chatId,
      participants: this.participants.map(p => p.toPlainObject()),
      messages: this.messages.map(m => m.toPlainObject()),
    };
  }

  /**
   * Create ChatDetail entity from plain object
   */
  static fromPlainObject(data: ChatDetailPlainObject): ChatDetail {
    const participants = data.participants.map(p =>
      ChatParticipant.fromPlainObject(p)
    );
    const messages = data.messages.map(m => Message.fromPlainObject(m));

    return new ChatDetail(data.chatId, participants, messages);
  }
}

/**
 * Plain object representation for serialization/deserialization
 */
export interface ChatDetailPlainObject {
  chatId: string;
  participants: import('./ChatParticipant').ChatParticipantPlainObject[];
  messages: import('./Message').MessagePlainObject[];
}
