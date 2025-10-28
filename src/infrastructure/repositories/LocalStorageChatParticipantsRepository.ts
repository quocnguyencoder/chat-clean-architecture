/**
 * Local Storage Chat Participants Repository
 *
 * Concrete implementation of ChatParticipantsRepository using localStorage for persistence.
 */

import {
  ChatParticipant,
  type ChatParticipantPlainObject,
} from '@/domain/entities/ChatParticipant';
import { mockParticipantsData } from '@/mocks';
import type { ChatParticipantsRepository } from '@/ports/ChatParticipantsRepository';

const STORAGE_KEY_PREFIX = 'chat-participants-';

export class LocalStorageChatParticipantsRepository
  implements ChatParticipantsRepository
{
  /**
   * Get all participants for a chat
   */
  async getByChatId(chatId: string): Promise<ChatParticipant[]> {
    try {
      const storageKey = this.getStorageKey(chatId);
      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        // Initialize with mock data if no data exists
        const mockParticipants = this.getMockParticipants(chatId);
        await this.saveAllParticipants(chatId, mockParticipants);
        return mockParticipants;
      }

      const participantData: ChatParticipantPlainObject[] = JSON.parse(stored);
      return participantData.map(data => ChatParticipant.fromPlainObject(data));
    } catch {
      // If parsing fails, return mock data
      return this.getMockParticipants(chatId);
    }
  }

  /**
   * Add participant to chat
   */
  async add(
    chatId: string,
    participant: ChatParticipant
  ): Promise<ChatParticipant> {
    const participants = await this.getByChatId(chatId);
    const existingIndex = participants.findIndex(p => p.id === participant.id);

    if (existingIndex >= 0) {
      // Update existing participant
      participants[existingIndex] = participant;
    } else {
      // Add new participant
      participants.push(participant);
    }

    await this.saveAllParticipants(chatId, participants);
    return participant;
  }

  /**
   * Remove participant from chat
   */
  async remove(chatId: string, participantId: string): Promise<boolean> {
    const participants = await this.getByChatId(chatId);
    const initialLength = participants.length;
    const filteredParticipants = participants.filter(
      p => p.id !== participantId
    );

    if (filteredParticipants.length !== initialLength) {
      await this.saveAllParticipants(chatId, filteredParticipants);
      return true;
    }

    return false;
  }

  /**
   * Update participant online status
   */
  async updateOnlineStatus(
    chatId: string,
    participantId: string,
    isOnline: boolean
  ): Promise<ChatParticipant | null> {
    const participants = await this.getByChatId(chatId);
    const participantIndex = participants.findIndex(
      p => p.id === participantId
    );

    if (participantIndex === -1) {
      return null;
    }

    const participant = participants[participantIndex];
    const updatedParticipant = new ChatParticipant(
      participant.id,
      participant.name,
      participant.avatar,
      isOnline,
      participant.role
    );

    participants[participantIndex] = updatedParticipant;
    await this.saveAllParticipants(chatId, participants);

    return updatedParticipant;
  }

  /**
   * Get storage key for a chat
   */
  private getStorageKey(chatId: string): string {
    return `${STORAGE_KEY_PREFIX}${chatId}`;
  }

  /**
   * Save all participants for a chat
   */
  private async saveAllParticipants(
    chatId: string,
    participants: ChatParticipant[]
  ): Promise<void> {
    const storageKey = this.getStorageKey(chatId);
    const participantData = participants.map(p => p.toPlainObject());
    localStorage.setItem(storageKey, JSON.stringify(participantData));
  }

  /**
   * Get mock participants for a chat
   */
  private getMockParticipants(chatId: string): ChatParticipant[] {
    const mockData = mockParticipantsData[chatId] || [
      {
        id: 'user-2',
        name: 'You',
        avatar:
          'https://api.dicebear.com/7.x/avataaars/svg?seed=You&backgroundColor=1976d2',
        isOnline: true,
        role: 'admin',
      },
    ];

    return mockData.map(data => ChatParticipant.fromPlainObject(data));
  }
}
