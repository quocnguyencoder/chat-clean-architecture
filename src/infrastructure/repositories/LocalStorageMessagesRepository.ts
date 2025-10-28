/**
 * Local Storage Messages Repository
 *
 * Concrete implementation of MessagesRepository using localStorage for persistence.
 * Supports pagination for efficient handling of large message lists.
 */

import { Message, type MessagePlainObject } from '@/domain/entities/Message';
import { mockMessagesData } from '@/mocks';
import type {
  MessagesRepository,
  PaginatedMessages,
  PaginationOptions,
} from '@/ports/MessagesRepository';

const STORAGE_KEY_PREFIX = 'chat-messages-';

export class LocalStorageMessagesRepository implements MessagesRepository {
  /**
   * Get all messages for a chat
   */
  async getByChatId(chatId: string): Promise<Message[]> {
    try {
      const storageKey = this.getStorageKey(chatId);
      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        // Initialize with mock data if no data exists
        const mockMessages = this.getMockMessages(chatId);
        await this.saveAllMessages(chatId, mockMessages);
        return mockMessages;
      }

      const messageData: MessagePlainObject[] = JSON.parse(stored);
      return messageData.map(data => Message.fromPlainObject(data));
    } catch {
      // If parsing fails, return mock data
      return this.getMockMessages(chatId);
    }
  }

  /**
   * Get paginated messages for a chat
   */
  async getPaginatedByChatId(
    chatId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedMessages> {
    const allMessages = await this.getByChatId(chatId);
    const { limit = 50, offset = 0, beforeMessageId, afterMessageId } = options;

    let messages = allMessages;

    // Filter by message ID if specified
    if (beforeMessageId) {
      const index = messages.findIndex(m => m.id === beforeMessageId);
      if (index !== -1) {
        messages = messages.slice(0, index);
      }
    }

    if (afterMessageId) {
      const index = messages.findIndex(m => m.id === afterMessageId);
      if (index !== -1) {
        messages = messages.slice(index + 1);
      }
    }

    // Apply pagination
    const paginatedMessages = messages.slice(offset, offset + limit);
    const hasMore = offset + limit < messages.length;

    return {
      messages: paginatedMessages,
      total: messages.length,
      hasMore,
    };
  }

  /**
   * Add message to chat
   */
  async add(chatId: string, message: Message): Promise<Message> {
    const messages = await this.getByChatId(chatId);
    const existingIndex = messages.findIndex(m => m.id === message.id);

    if (existingIndex >= 0) {
      // Update existing message
      messages[existingIndex] = message;
    } else {
      // Add new message
      messages.push(message);
    }

    await this.saveAllMessages(chatId, messages);
    return message;
  }

  /**
   * Get message by ID
   */
  async getById(chatId: string, messageId: string): Promise<Message | null> {
    const messages = await this.getByChatId(chatId);
    return messages.find(message => message.id === messageId) || null;
  }

  /**
   * Delete message
   */
  async delete(chatId: string, messageId: string): Promise<boolean> {
    const messages = await this.getByChatId(chatId);
    const initialLength = messages.length;
    const filteredMessages = messages.filter(m => m.id !== messageId);

    if (filteredMessages.length !== initialLength) {
      await this.saveAllMessages(chatId, filteredMessages);
      return true;
    }

    return false;
  }

  /**
   * Get storage key for a chat
   */
  private getStorageKey(chatId: string): string {
    return `${STORAGE_KEY_PREFIX}${chatId}`;
  }

  /**
   * Save all messages for a chat
   */
  private async saveAllMessages(
    chatId: string,
    messages: Message[]
  ): Promise<void> {
    const storageKey = this.getStorageKey(chatId);
    const messageData = messages.map(m => m.toPlainObject());
    localStorage.setItem(storageKey, JSON.stringify(messageData));
  }

  /**
   * Get mock messages for a chat
   */
  private getMockMessages(chatId: string): Message[] {
    const mockData = mockMessagesData[chatId] || [
      {
        id: 'msg-default',
        text: 'Welcome to the chat!',
        senderId: 'system',
        senderName: 'System',
        time: '12:00 PM',
        isFromMe: false,
      },
    ];

    return mockData.map(data => Message.fromPlainObject(data));
  }
}
