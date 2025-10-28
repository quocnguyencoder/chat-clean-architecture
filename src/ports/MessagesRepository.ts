/**
 * Messages Repository Port
 *
 * Interface defining the contract for messages data persistence.
 * Note: This will be extended for infinite scroll in the future.
 */

import type { Message } from '@/domain/entities/Message';

export interface MessagesRepository {
  /**
   * Get all messages for a chat
   * Note: Currently loads all messages, will be updated for infinite scroll
   * @param chatId - Chat ID
   * @returns Promise resolving to array of messages
   */
  getByChatId(chatId: string): Promise<Message[]>;

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
