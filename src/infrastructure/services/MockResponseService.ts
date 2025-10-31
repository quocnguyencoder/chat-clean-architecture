/**
 * Mock Response Service
 *
 * Background service that listens to chat events and generates mock responses.
 * This is for testing and demonstration purposes only.
 * Runs independently of UI components.
 */

import { mockConfig } from '@/config/mockConfig';
import type { Chat } from '@/domain/entities/Chat';
import type { ChatDetail } from '@/domain/entities/ChatDetail';
import {
  CURRENT_USER,
  getRandomAutoMessage,
  getRandomOtherUser,
  getRandomResponse,
} from '@/mocks';
import type { ChatRepository } from '@/ports/ChatRepository';
import type { ReceiveMessageUseCase } from '@/usecases/ReceiveMessageUseCase';
import { getRandomResponseDelay } from '@/utils/mockHelpers';
import { generateMessageId } from '@/utils/uuid';

interface MessageEvent extends CustomEvent {
  detail: {
    chatId: string;
    messageId: string;
    text: string;
    senderId: string;
    senderName: string;
    time: string;
  };
}

export class MockResponseService {
  private receiveMessageUseCase: ReceiveMessageUseCase;
  private chatRepository: ChatRepository;
  private autoSendInterval: number | null = null;
  private getChatsFn: () => Chat[];
  private getChatDetailFn: (chatId: string) => ChatDetail | null;
  private isPaused: boolean = false;
  private boundHandleNewMessage: EventListener;

  constructor(
    receiveMessageUseCase: ReceiveMessageUseCase,
    chatRepository: ChatRepository,
    getChatsFn: () => Chat[],
    getChatDetailFn: (chatId: string) => ChatDetail | null
  ) {
    this.receiveMessageUseCase = receiveMessageUseCase;
    this.chatRepository = chatRepository;
    this.getChatsFn = getChatsFn;
    this.getChatDetailFn = getChatDetailFn;
    // Initialize with config value
    this.isPaused = mockConfig.behavior.startPaused;
    // Bind the handler once in constructor
    this.boundHandleNewMessage = this.handleNewMessage.bind(
      this
    ) as EventListener;
  }

  /**
   * Start listening to message events and auto-sending messages
   */
  start(): void {
    // Remove any existing listener first to prevent duplicates
    window.removeEventListener('chat:newMessage', this.boundHandleNewMessage);

    // Listen to new messages
    window.addEventListener('chat:newMessage', this.boundHandleNewMessage);

    // Start auto-sending messages to random chats
    this.startAutoSendMessages();
  }

  /**
   * Stop the service and clean up
   */
  stop(): void {
    window.removeEventListener('chat:newMessage', this.boundHandleNewMessage);

    if (this.autoSendInterval !== null) {
      clearInterval(this.autoSendInterval);
      this.autoSendInterval = null;
    }
  }

  /**
   * Pause mock responses (stop responding to messages and auto-sending)
   */
  pause(): void {
    this.isPaused = true;
    if (mockConfig.behavior.enableLogging) {
      // eslint-disable-next-line no-console
      console.log('🔕 Mock responses paused');
    }
  }

  /**
   * Resume mock responses
   */
  resume(): void {
    this.isPaused = false;
    if (mockConfig.behavior.enableLogging) {
      // eslint-disable-next-line no-console
      console.log('🔔 Mock responses resumed');
    }
  }

  /**
   * Toggle pause/resume state
   */
  toggle(): boolean {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
    return this.isPaused;
  }

  /**
   * Check if service is paused
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Handle new message events
   */
  private async handleNewMessage(event: Event): Promise<void> {
    const messageEvent = event as MessageEvent;
    const { chatId, text, senderId } = messageEvent.detail;

    // Only respond to messages sent by current user
    if (senderId !== CURRENT_USER.id) return;

    // Don't respond if paused
    if (this.isPaused) return;

    // Simulate response after 1-2 seconds
    this.simulateResponse(chatId, text);
  }

  /**
   * Simulate a response to a sent message
   */
  private simulateResponse(chatId: string, originalMessage: string): void {
    // Use configured delay range
    const delay = getRandomResponseDelay();

    setTimeout(async () => {
      try {
        const chats = this.getChatsFn();
        const targetChat = chats.find(c => c.id === chatId);
        if (!targetChat) return;

        // Generate a demo response
        const responseText = getRandomResponse(originalMessage);

        // Determine sender
        const { senderId, senderName } = this.determineSender(
          targetChat,
          chatId
        );

        const messageId = generateMessageId();

        // Use ReceiveMessageUseCase to add the response
        await this.receiveMessageUseCase.execute({
          chatId: chatId,
          messageId: messageId,
          text: responseText,
          senderId: senderId,
          senderName: senderName,
          time: new Date().toISOString(),
        });

        // Trigger custom event for UI updates
        this.dispatchMessageEvent(
          chatId,
          messageId,
          responseText,
          senderId,
          senderName
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to simulate response:', error);
      }
    }, delay);
  }

  /**
   * Dispatch a message event for UI updates
   */
  private dispatchMessageEvent(
    chatId: string,
    messageId: string,
    text: string,
    senderId: string,
    senderName: string
  ): void {
    window.dispatchEvent(
      new CustomEvent('chat:newMessage', {
        detail: {
          chatId,
          messageId,
          text,
          senderId,
          senderName,
          time: new Date().toISOString(),
        },
      })
    );
  }

  /**
   * Start auto-sending messages to random chats
   */
  private startAutoSendMessages(): void {
    // Only start if enabled in config
    if (!mockConfig.autoSend.enabled) {
      return;
    }

    this.autoSendInterval = window.setInterval(() => {
      void this.sendMessageToRandomChat();
    }, mockConfig.autoSend.interval);
  }

  /**
   * Send a message to a random chat (for testing unread badges)
   */
  private async sendMessageToRandomChat(): Promise<void> {
    // Don't send if paused
    if (this.isPaused) return;

    try {
      const chats = this.getChatsFn();
      if (chats.length === 0) return;

      // Pick a random chat
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      // Generate random message
      const randomMessage = getRandomAutoMessage();

      // Determine sender using the same logic as responses
      const { senderId, senderName } = this.determineSender(
        randomChat,
        randomChat.id
      );

      const messageId = generateMessageId();

      // Use ReceiveMessageUseCase to add the message
      await this.receiveMessageUseCase.execute({
        chatId: randomChat.id,
        messageId: messageId,
        text: randomMessage,
        senderId: senderId,
        senderName: senderName,
        time: new Date().toISOString(),
      });

      // Increment unread count
      const currentUnread = randomChat.unreadCount || 0;
      await this.chatRepository.updateUnreadCount(
        randomChat.id,
        currentUnread + 1
      );

      // Trigger custom event for UI updates
      this.dispatchMessageEvent(
        randomChat.id,
        messageId,
        randomMessage,
        senderId,
        senderName
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to auto-send message:', error);
    }
  }

  /**
   * Determine sender based on chat type and participants
   */
  private determineSender(
    chat: Chat,
    chatId: string
  ): { senderId: string; senderName: string } {
    // For group chat, get a random participant
    if (chat.isGroup) {
      const chatDetail = this.getChatDetailFn(chatId);
      if (chatDetail?.participants) {
        // Filter out current user from participants
        const otherParticipants = chatDetail.participants.filter(
          participant => participant.id !== CURRENT_USER.id
        );

        // If we have other participants, pick one randomly
        if (otherParticipants.length > 0) {
          const randomParticipant =
            otherParticipants[
              Math.floor(Math.random() * otherParticipants.length)
            ];
          return {
            senderId: randomParticipant.id,
            senderName: randomParticipant.name,
          };
        }
      }

      // Fallback to random user from mock data if no participants found
      return this.getGroupSender();
    }

    // For 1-on-1 chat, use the chat contact
    return this.getIndividualSender(chatId, chat.name);
  }

  /**
   * Get sender info for individual (1-on-1) chat
   */
  private getIndividualSender(
    chatId: string,
    chatName: string
  ): { senderId: string; senderName: string } {
    return {
      senderId: this.generateSenderId(chatId),
      senderName: chatName,
    };
  }

  /**
   * Get sender info for group chat (random member)
   */
  private getGroupSender(): { senderId: string; senderName: string } {
    const randomUser = getRandomOtherUser();
    return {
      senderId: randomUser.id,
      senderName: randomUser.name,
    };
  }

  /**
   * Generate a sender ID from a name or chat ID
   */
  private generateSenderId(nameOrId: string): string {
    return `user-${nameOrId.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
