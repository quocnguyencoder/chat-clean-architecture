/**
 * Chat Repository Port
 *
 * Interface defining the contract for chat data persistence.
 * This port will be implemented by infrastructure adapters.
 */

import type { Chat } from '@/domain/entities/Chat';

export interface ChatRepository {
  /**
   * Get all chats
   * @returns Promise resolving to array of chats
   */
  getAll(): Promise<Chat[]>;

  /**
   * Get chat by ID
   * @param id - Chat ID
   * @returns Promise resolving to chat or null if not found
   */
  getById(id: string): Promise<Chat | null>;

  /**
   * Save chat
   * @param chat - Chat to save
   * @returns Promise resolving to saved chat
   */
  save(chat: Chat): Promise<Chat>;

  /**
   * Delete chat
   * @param id - Chat ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: string): Promise<boolean>;

  /**
   * Update unread count for a chat
   * @param id - Chat ID
   * @param count - New unread count
   * @returns Promise resolving to updated chat or null if not found
   */
  updateUnreadCount(id: string, count: number): Promise<Chat | null>;

  /**
   * Update online status for a chat
   * @param id - Chat ID
   * @param isOnline - New online status
   * @returns Promise resolving to updated chat or null if not found
   */
  updateOnlineStatus(id: string, isOnline: boolean): Promise<Chat | null>;

  /**
   * Update last message for a chat
   * @param id - Chat ID
   * @param lastMessage - New last message text
   * @param time - Message time
   * @returns Promise resolving to updated chat or null if not found
   */
  updateLastMessage(
    id: string,
    lastMessage: string,
    time: string
  ): Promise<Chat | null>;
}
