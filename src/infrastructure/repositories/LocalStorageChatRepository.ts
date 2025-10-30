/**
 * Local Storage Chat Repository
 *
 * Concrete implementation of ChatRepository using localStorage for persistence.
 * This adapter handles all I/O operations and data transformation.
 */

import { Chat, type ChatPlainObject } from '@/domain/entities/Chat';
import { mockChatsData } from '@/mocks';
import type { ChatRepository } from '@/ports/ChatRepository';

const STORAGE_KEY = 'chat-app-chats';

export class LocalStorageChatRepository implements ChatRepository {
  /**
   * Get all chats from localStorage
   */
  async getAll(): Promise<Chat[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with mock data if no data exists
        const mockChats = this.getMockChats();
        await this.saveAllChats(mockChats);
        return mockChats;
      }

      const chatData: ChatPlainObject[] = JSON.parse(stored);
      return chatData.map(data => Chat.fromPlainObject(data));
    } catch {
      // If parsing fails, return mock data
      return this.getMockChats();
    }
  }

  /**
   * Get chat by ID
   */
  async getById(id: string): Promise<Chat | null> {
    const chats = await this.getAll();
    return chats.find(chat => chat.id === id) || null;
  }

  /**
   * Save a single chat
   */
  async save(chat: Chat): Promise<Chat> {
    const chats = await this.getAll();
    const existingIndex = chats.findIndex(c => c.id === chat.id);

    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.push(chat);
    }

    await this.saveAllChats(chats);
    return chat;
  }

  /**
   * Delete chat by ID
   */
  async delete(id: string): Promise<boolean> {
    const chats = await this.getAll();
    const initialLength = chats.length;
    const filteredChats = chats.filter(chat => chat.id !== id);

    if (filteredChats.length !== initialLength) {
      await this.saveAllChats(filteredChats);
      return true;
    }

    return false;
  }

  /**
   * Update unread count for a chat
   */
  async updateUnreadCount(id: string, count: number): Promise<Chat | null> {
    const chat = await this.getById(id);
    if (!chat) return null;

    const updatedChat = new Chat(
      chat.id,
      chat.name,
      chat.lastMessage,
      chat.avatar,
      chat.isOnline,
      Math.max(0, count), // Ensure non-negative
      chat.isGroup
    );

    await this.save(updatedChat);
    return updatedChat;
  }

  /**
   * Update online status for a chat
   */
  async updateOnlineStatus(
    id: string,
    isOnline: boolean
  ): Promise<Chat | null> {
    const chat = await this.getById(id);
    if (!chat) return null;

    const updatedChat = new Chat(
      chat.id,
      chat.name,
      chat.lastMessage,
      chat.avatar,
      isOnline,
      chat.unreadCount,
      chat.isGroup
    );

    await this.save(updatedChat);
    return updatedChat;
  }

  /**
   * Update last message for a chat
   */
  async updateLastMessage(
    id: string,
    message: string,
    senderId: string,
    senderName: string | undefined,
    time: string
  ): Promise<Chat | null> {
    const chat = await this.getById(id);
    if (!chat) return null;

    const updatedChat = new Chat(
      chat.id,
      chat.name,
      { message, senderId, senderName, time },
      chat.avatar,
      chat.isOnline,
      chat.unreadCount,
      chat.isGroup
    );

    await this.save(updatedChat);
    return updatedChat;
  }

  /**
   * Save all chats to localStorage
   */
  private async saveAllChats(chats: Chat[]): Promise<void> {
    const chatData = chats.map(chat => chat.toPlainObject());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatData));
  }

  /**
   * Get mock chat data for initialization
   */
  private getMockChats(): Chat[] {
    return mockChatsData.map(data => Chat.fromPlainObject(data));
  }
}
