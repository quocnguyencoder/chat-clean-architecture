/**
 * Seed Data Utility
 *
 * Functions to clear and seed default data into LocalStorage.
 * This is useful for development, testing, and resetting the application state.
 */

import { Chat } from '@/domain/entities/Chat';
import { ChatDetail } from '@/domain/entities/ChatDetail';
import { ChatParticipant } from '@/domain/entities/ChatParticipant';
import { Message } from '@/domain/entities/Message';
import { mockChatsData, mockMessagesData, mockParticipantsData } from '@/mocks';

const STORAGE_KEYS = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  PARTICIPANTS: 'participants',
  CHAT_DETAILS: 'chatDetails',
} as const;

/**
 * Clear all data from LocalStorage
 */
export function clearAllData(): void {
  // Clear all localStorage
  localStorage.clear();
  // eslint-disable-next-line no-console
  console.log('✓ All data cleared from LocalStorage');
}

/**
 * Seed chats data
 */
export function seedChats(): void {
  const chats = mockChatsData.map(chatData => Chat.fromPlainObject(chatData));
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  // eslint-disable-next-line no-console
  console.log(`✓ Seeded ${chats.length} chats`);
}

/**
 * Seed messages data
 */
export function seedMessages(): void {
  const allMessages: Record<string, Message[]> = {};

  Object.entries(mockMessagesData).forEach(([chatId, messagesData]) => {
    allMessages[chatId] = messagesData.map(messageData =>
      Message.fromPlainObject(messageData)
    );
  });

  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));

  const totalMessages = Object.values(allMessages).reduce(
    (sum, messages) => sum + messages.length,
    0
  );
  // eslint-disable-next-line no-console
  console.log(
    `✓ Seeded ${totalMessages} messages across ${Object.keys(allMessages).length} chats`
  );
}

/**
 * Seed participants data
 */
export function seedParticipants(): void {
  const allParticipants: Record<string, ChatParticipant[]> = {};

  Object.entries(mockParticipantsData).forEach(([chatId, participantsData]) => {
    allParticipants[chatId] = participantsData.map(participantData =>
      ChatParticipant.fromPlainObject(participantData)
    );
  });

  localStorage.setItem(
    STORAGE_KEYS.PARTICIPANTS,
    JSON.stringify(allParticipants)
  );

  const totalParticipants = Object.values(allParticipants).reduce(
    (sum, participants) => sum + participants.length,
    0
  );
  // eslint-disable-next-line no-console
  console.log(
    `✓ Seeded ${totalParticipants} participants across ${Object.keys(allParticipants).length} chats`
  );
}

/**
 * Seed chat details (combining participants and messages)
 */
export function seedChatDetails(): void {
  const chatDetails: Record<string, ChatDetail> = {};

  Object.keys(mockMessagesData).forEach(chatId => {
    const messages = mockMessagesData[chatId]?.map(messageData =>
      Message.fromPlainObject(messageData)
    );

    const participants = mockParticipantsData[chatId]?.map(participantData =>
      ChatParticipant.fromPlainObject(participantData)
    );

    if (messages && participants) {
      chatDetails[chatId] = new ChatDetail(chatId, participants, messages);
    }
  });

  localStorage.setItem(STORAGE_KEYS.CHAT_DETAILS, JSON.stringify(chatDetails));
  // eslint-disable-next-line no-console
  console.log(`✓ Seeded ${Object.keys(chatDetails).length} chat details`);
}

/**
 * Seed all default data
 */
export function seedAllData(): void {
  // eslint-disable-next-line no-console
  console.log('🌱 Starting data seeding...');

  seedChats();
  seedMessages();
  seedParticipants();
  seedChatDetails();

  // eslint-disable-next-line no-console
  console.log('✅ Data seeding completed successfully!');
}

/**
 * Clear and reseed all data, then refresh the application
 */
export function resetData(): void {
  // eslint-disable-next-line no-console
  console.log('🔄 Resetting data...\n');

  // Clear all localStorage
  clearAllData();

  // eslint-disable-next-line no-console
  console.log('');

  // Seed fresh data
  seedAllData();

  // eslint-disable-next-line no-console
  console.log('\n✨ Data reset completed! Refreshing application...');

  // Refresh the page to reload with fresh data
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

// Make functions available globally for easy access in browser console
if (typeof window !== 'undefined') {
  (window as typeof window & { seedData: typeof resetData }).seedData =
    resetData;
}
