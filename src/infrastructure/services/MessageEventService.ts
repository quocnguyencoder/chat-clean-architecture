/**
 * Message Event Service
 *
 * Service for handling incoming messages from various sources:
 * - postMessage API (iframe communication)
 * - Transport workers
 * - WebSocket connections
 *
 * This service provides a unified interface for message reception
 * and follows the Observer pattern for event handling.
 */

import type { IncomingMessageData } from '@/usecases/ReceiveMessageUseCase';

export type MessageEventHandler = (message: IncomingMessageData) => void;

export interface MessageEventSource {
  type: 'postMessage' | 'worker' | 'websocket';
  data: IncomingMessageData;
}

export class MessageEventService {
  private listeners: Set<MessageEventHandler> = new Set();
  private isListening = false;
  private workerRef: Worker | null = null;

  /**
   * Start listening for messages from all sources
   */
  startListening(): void {
    if (this.isListening) {
      return;
    }

    this.isListening = true;

    // Listen for postMessage events
    window.addEventListener('message', this.handlePostMessage);

    // Initialize worker if available (placeholder for actual worker setup)
    this.initializeWorker();
  }

  /**
   * Stop listening for messages
   */
  stopListening(): void {
    if (!this.isListening) {
      return;
    }

    this.isListening = false;

    // Remove postMessage listener
    window.removeEventListener('message', this.handlePostMessage);

    // Cleanup worker
    if (this.workerRef) {
      this.workerRef.terminate();
      this.workerRef = null;
    }
  }

  /**
   * Subscribe to message events
   */
  subscribe(handler: MessageEventHandler): () => void {
    this.listeners.add(handler);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(handler);
    };
  }

  /**
   * Manually emit a message event (for testing or programmatic use)
   */
  emit(message: IncomingMessageData): void {
    this.notifyListeners(message);
  }

  /**
   * Handle postMessage events
   */
  private handlePostMessage = (event: MessageEvent): void => {
    // Validate message origin for security
    // In production, you should check event.origin
    if (!this.isValidMessage(event.data)) {
      return;
    }

    try {
      const messageData = this.parseMessageEvent(event.data);
      if (messageData) {
        this.notifyListeners(messageData);
      }
    } catch (error) {
      // Silently handle parsing errors
      if (error instanceof Error) {
        // Could log to monitoring service in production
      }
    }
  };

  /**
   * Initialize transport worker (placeholder)
   */
  private initializeWorker(): void {
    // This is a placeholder for actual worker initialization
    // In a real application, you would create and configure a worker here
    // Example:
    // this.workerRef = new Worker('/transport-worker.js');
    // this.workerRef.onmessage = (event: MessageEvent) => {
    //   if (!this.isValidMessage(event.data)) return;
    //   try {
    //     const messageData = this.parseMessageEvent(event.data);
    //     if (messageData) this.notifyListeners(messageData);
    //   } catch {
    //     // Silently handle parsing errors
    //   }
    // };
  }

  /**
   * Validate if the incoming message is valid
   */
  private isValidMessage(data: unknown): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const msg = data as Record<string, unknown>;

    // Check for required fields
    return Boolean(
      msg.chatId &&
        msg.messageId &&
        msg.text &&
        msg.senderId &&
        msg.senderName &&
        msg.time
    );
  }

  /**
   * Parse message event data into IncomingMessageData
   */
  private parseMessageEvent(data: unknown): IncomingMessageData | null {
    if (!this.isValidMessage(data)) {
      return null;
    }

    const msg = data as Record<string, unknown>;

    return {
      chatId: String(msg.chatId),
      messageId: String(msg.messageId),
      text: String(msg.text),
      senderId: String(msg.senderId),
      senderName: String(msg.senderName),
      time: String(msg.time),
      isSentByCurrentUser: Boolean(
        msg.isSentByCurrentUser ?? msg.isFromCurrentUser ?? msg.isFromMe
      ),
    };
  }

  /**
   * Notify all listeners of a new message
   */
  private notifyListeners(message: IncomingMessageData): void {
    this.listeners.forEach(listener => {
      try {
        listener(message);
      } catch {
        // Prevent one listener error from affecting others
      }
    });
  }

  /**
   * Get the current listening state
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Get the number of active listeners
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}

// Export singleton instance
export const messageEventService = new MessageEventService();
