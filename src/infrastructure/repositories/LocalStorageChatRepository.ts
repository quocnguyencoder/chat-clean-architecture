/**
 * Local Storage Chat Repository
 *
 * Concrete implementation of ChatRepository using localStorage for persistence.
 * This adapter handles all I/O operations and data transformation.
 */

import { Chat, type ChatPlainObject } from '@/domain/entities/Chat';
import type { ChatRepository } from '@/ports/ChatRepository';
import { generateGroupAvatar, generateUserAvatar } from '@/utils/avatar';

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
      chat.time,
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
      chat.time,
      chat.avatar,
      isOnline,
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
    const mockData = [
      {
        id: '1',
        name: 'John Smith 🚙',
        lastMessage: 'Sarah: That sounds great...',
        time: '12:44 pm',
        avatar: generateUserAvatar('John Smith'),
        isOnline: true,
        unreadCount: 3,
        isGroup: false,
      },
      {
        id: '2',
        name: 'Emma Wilson',
        lastMessage: 'Ok',
        time: '12:34 pm',
        avatar: generateUserAvatar('Emma Wilson'),
        isOnline: true,
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: '3',
        name: 'Michael Brown',
        lastMessage: 'Let me check and get back...',
        time: '11:53 am',
        avatar: generateUserAvatar('Michael Brown'),
        isOnline: false,
        unreadCount: 49,
        isGroup: false,
      },
      {
        id: '4',
        name: 'Project Team Alpha',
        lastMessage: 'Alex: Looking good...',
        time: '11:08 am',
        avatar: generateGroupAvatar('Project Team Alpha'),
        isOnline: false,
        unreadCount: 0,
        isGroup: true,
      },
    ];

    return mockData.map(data => Chat.fromPlainObject(data));
  }
}
