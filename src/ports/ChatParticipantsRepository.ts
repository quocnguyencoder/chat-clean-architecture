/**
 * Chat Participants Repository Port
 *
 * Interface defining the contract for chat participants data persistence.
 */

import type { ChatParticipant } from '@/domain/entities/ChatParticipant';

export interface ChatParticipantsRepository {
  /**
   * Get all participants for a chat
   * @param chatId - Chat ID
   * @returns Promise resolving to array of participants
   */
  getByChatId(chatId: string): Promise<ChatParticipant[]>;

  /**
   * Add participant to chat
   * @param chatId - Chat ID
   * @param participant - Participant to add
   * @returns Promise resolving to added participant
   */
  add(chatId: string, participant: ChatParticipant): Promise<ChatParticipant>;

  /**
   * Remove participant from chat
   * @param chatId - Chat ID
   * @param participantId - Participant ID to remove
   * @returns Promise resolving to boolean indicating success
   */
  remove(chatId: string, participantId: string): Promise<boolean>;

  /**
   * Update participant online status
   * @param chatId - Chat ID
   * @param participantId - Participant ID
   * @param isOnline - New online status
   * @returns Promise resolving to updated participant or null if not found
   */
  updateOnlineStatus(
    chatId: string,
    participantId: string,
    isOnline: boolean
  ): Promise<ChatParticipant | null>;
}
