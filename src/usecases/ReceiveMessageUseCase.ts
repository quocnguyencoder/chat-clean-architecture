/**
 * Receive Message Use Case
 *
 * Handles the business logic for receiving and processing incoming messages.
 * This use case is triggered when a message arrives from external sources
 * (e.g., postMessage API, transport workers, websockets).
 */

import { Message } from '@/domain/entities/Message';
import { CURRENT_USER } from '@/mocks/users';
import type { ChatRepository } from '@/ports/ChatRepository';
import type { MessagesRepository } from '@/ports/MessagesRepository';

export interface IncomingMessageData {
  chatId: string;
  messageId: string;
  text: string;
  senderId: string;
  senderName: string;
  time: string;
}

export class ReceiveMessageUseCase {
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
   * Execute the use case to receive and store an incoming message
   *
   * @param messageData - The incoming message data
   * @returns Promise resolving to the created Message entity
   */
  async execute(messageData: IncomingMessageData): Promise<Message> {
    // Validate input
    this.validateMessageData(messageData);

    // Create message entity from incoming data
    const message = new Message(
      messageData.messageId,
      messageData.text,
      messageData.senderId,
      messageData.senderName,
      messageData.time,
      messageData.senderId === CURRENT_USER.id // Determine if message is from current user
    );

    // Save message via repository
    const savedMessage = await this.messagesRepository.add(
      messageData.chatId,
      message
    );

    // Update chat's last message
    await this.updateChatLastMessage(
      messageData.chatId,
      messageData.text,
      messageData.senderId,
      messageData.time
    );

    return savedMessage;
  }

  /**
   * Validate incoming message data
   */
  private validateMessageData(data: IncomingMessageData): void {
    if (!data.chatId) {
      throw new Error('Chat ID is required');
    }
    if (!data.messageId) {
      throw new Error('Message ID is required');
    }
    if (!data.text) {
      throw new Error('Message text is required');
    }
    if (!data.senderId) {
      throw new Error('Sender ID is required');
    }
    if (!data.senderName) {
      throw new Error('Sender name is required');
    }
    if (!data.time) {
      throw new Error('Message time is required');
    }
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
      // Silently handle error - don't fail the receive operation
    }
  }
}
