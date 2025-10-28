/**
 * Get Chat Detail Use Case
 *
 * Application service responsible for retrieving detailed chat information
 * including participants and messages.
 */

import { ChatDetail } from '@/domain/entities/ChatDetail';
import type { ChatParticipantsRepository } from '@/ports/ChatParticipantsRepository';
import type { MessagesRepository } from '@/ports/MessagesRepository';

export class GetChatDetailUseCase {
  private readonly participantsRepository: ChatParticipantsRepository;
  private readonly messagesRepository: MessagesRepository;

  constructor(
    participantsRepository: ChatParticipantsRepository,
    messagesRepository: MessagesRepository
  ) {
    this.participantsRepository = participantsRepository;
    this.messagesRepository = messagesRepository;
  }

  /**
   * Execute the use case to get chat detail
   * @param chatId - Chat ID to get details for
   * @returns Promise resolving to chat detail
   */
  async execute(chatId: string): Promise<ChatDetail> {
    try {
      // Get participants and messages in parallel for better performance
      const [participants, messages] = await Promise.all([
        this.participantsRepository.getByChatId(chatId),
        this.messagesRepository.getByChatId(chatId),
      ]);

      return new ChatDetail(chatId, participants, messages);
    } catch {
      // TODO: Add proper error logging service
      throw new Error('Failed to load chat detail');
    }
  }
}
