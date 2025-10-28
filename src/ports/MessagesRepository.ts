/**
 * Messages Repository Port
 *
 * Interface defining the contract for messages data persistence.
 * Supports pagination for efficient handling of large message lists.
 */

import type { Message } from '@/domain/entities/Message';

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  beforeMessageId?: string;
  afterMessageId?: string;
}

export interface PaginatedMessages {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface MessagesRepository {
  /**
   * Get all messages for a chat
   * @param chatId - Chat ID
   * @returns Promise resolving to array of messages
   */
  getByChatId(chatId: string): Promise<Message[]>;

  /**
   * Get paginated messages for a chat
   * @param chatId - Chat ID
   * @param options - Pagination options
   * @returns Promise resolving to paginated messages
   */
  getPaginatedByChatId(
    chatId: string,
    options?: PaginationOptions
  ): Promise<PaginatedMessages>;

  /**
   * Add message to chat
   * @param chatId - Chat ID
   * @param message - Message to add
   * @returns Promise resolving to added message
   */
  add(chatId: string, message: Message): Promise<Message>;

  /**
   * Get message by ID
   * @param chatId - Chat ID
   * @param messageId - Message ID
   * @returns Promise resolving to message or null if not found
   */
  getById(chatId: string, messageId: string): Promise<Message | null>;

  /**
   * Delete message
   * @param chatId - Chat ID
   * @param messageId - Message ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(chatId: string, messageId: string): Promise<boolean>;
}
