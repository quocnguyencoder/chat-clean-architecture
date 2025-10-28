/**
 * Get Chat List Use Case
 *
 * Application service responsible for retrieving chat list.
 * This is the main entry point for chat list operations from the UI layer.
 */

import type { Chat } from '@/domain/entities/Chat';
import type { ChatRepository } from '@/ports/ChatRepository';

export class GetChatListUseCase {
  private readonly chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  /**
   * Execute the use case to get all chats
   * @returns Promise resolving to array of chats
   */
  async execute(): Promise<Chat[]> {
    try {
      const chats = await this.chatRepository.getAll();

      // Sort chats by time (most recent first)
      // This is domain logic - sorting business rule
      return this.sortChatsByTime(chats);
    } catch {
      // TODO: Add proper error logging service
      throw new Error('Failed to load chat list');
    }
  }

  /**
   * Domain logic: Sort chats by time
   * @param chats - Array of chats to sort
   * @returns Sorted array of chats
   */
  private sortChatsByTime(chats: Chat[]): Chat[] {
    return [...chats].sort((a, b) => {
      // Convert time strings to comparable format
      // For now, assume time is already in sortable format
      // In real app, you'd want proper date parsing
      return b.time.localeCompare(a.time);
    });
  }
}
