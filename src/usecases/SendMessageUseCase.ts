/**
 * Send Message Use Case
 *
 * Handles the business logic for sending a new message in a chat.
 * This use case follows the Single Responsibility Principle and
 * orchestrates the message sending process.
 */

import { Message } from '@/domain/entities/Message';
import type { ChatRepository } from '@/ports/ChatRepository';
import type { MessagesRepository } from '@/ports/MessagesRepository';
import { generateMessageId } from '@/utils/uuid';

export class SendMessageUseCase {
  private readonly messagesRepository: MessagesRepository;
  private readonly chatRepository: ChatRepository;

  constructor(
    messagesRepository: MessagesRepository,
    chatRepository: ChatRepository
  ) {
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
  }

  /**
   * Execute the use case to send a message
   *
   * @param chatId - The ID of the chat to send the message to
   * @param text - The message text content
   * @param senderId - The ID of the sender
   * @param senderName - The name of the sender
   * @returns Promise resolving to the created Message entity
   */
  async execute(
    chatId: string,
    text: string,
    senderId: string,
    senderName: string
  ): Promise<Message> {
    // Validate input
    if (!chatId || !text.trim()) {
      throw new Error('Chat ID and message text are required');
    }

    // Create message entity
    const messageId = generateMessageId();
    const timestamp = this.getCurrentTimestamp();

    const message = new Message(
      messageId,
      text,
      senderId,
      senderName,
      timestamp,
      true // isFromMe is true for sent messages
    );

    // Save message via repository
    const savedMessage = await this.messagesRepository.add(chatId, message);

    // Update chat's last message
    await this.updateChatLastMessage(chatId, text, senderId, timestamp);

    // Dispatch event for other services (like MockResponseService) to react
    window.dispatchEvent(
      new CustomEvent('chat:newMessage', {
        detail: {
          chatId,
          messageId,
          text,
          senderId,
          senderName,
          time: timestamp,
        },
      })
    );

    return savedMessage;
  }

  /**
   * Get current timestamp in ISO format
   */
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Update the chat's last message information
   */
  private async updateChatLastMessage(
    chatId: string,
    message: string,
    senderId: string,
    time: string
  ): Promise<void> {
    try {
      await this.chatRepository.updateLastMessage(
        chatId,
        message,
        senderId,
        time
      );
    } catch {
      // Silently handle error - don't fail the send operation
    }
  }
}
