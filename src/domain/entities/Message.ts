/**
 * Message Domain Entity
 *
 * Represents a message in a chat conversation.
 */

export class Message {
  public readonly id: string;
  public readonly text: string;
  public readonly senderId: string;
  public readonly senderName: string;
  public readonly time: string;
  public readonly isFromMe: boolean;

  constructor(
    id: string,
    text: string,
    senderId: string,
    senderName: string,
    time: string,
    isFromMe: boolean
  ) {
    this.id = id;
    this.text = text;
    this.senderId = senderId;
    this.senderName = senderName;
    this.time = time;
    this.isFromMe = isFromMe;
    this.validateId(id);
    this.validateText(text);
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('Message ID cannot be empty');
    }
  }

  private validateText(text: string): void {
    if (text === null || text === undefined) {
      throw new Error('Message text cannot be null or undefined');
    }
  }

  /**
   * Check if message is empty
   */
  isEmpty(): boolean {
    return this.text.trim().length === 0;
  }

  /**
   * Get message length
   */
  getLength(): number {
    return this.text.length;
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): MessagePlainObject {
    return {
      id: this.id,
      text: this.text,
      senderId: this.senderId,
      senderName: this.senderName,
      time: this.time,
      isFromMe: this.isFromMe,
    };
  }

  /**
   * Create Message entity from plain object
   */
  static fromPlainObject(data: MessagePlainObject): Message {
    return new Message(
      data.id,
      data.text,
      data.senderId,
      data.senderName,
      data.time,
      data.isFromMe
    );
  }
}

/**
 * Plain object representation for serialization/deserialization
 */
export interface MessagePlainObject {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  time: string;
  isFromMe: boolean;
}
