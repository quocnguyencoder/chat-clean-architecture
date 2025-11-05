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
  private workerConfig = {
    enableDemo: false,
    url: '', // WebSocket URL or API endpoint
  };

  /**
   * Start listening for messages from all sources
   */
  startListening(config?: { enableDemo?: boolean; url?: string }): void {
    if (this.isListening) {
      return;
    }

    this.isListening = true;

    // Update worker config if provided
    if (config) {
      this.workerConfig = { ...this.workerConfig, ...config };
    }

    // Listen for postMessage events
    window.addEventListener('message', this.handlePostMessage);

    // Initialize worker
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
   * Initialize transport worker
   */
  private initializeWorker(): void {
    try {
      // Create worker from public directory
      this.workerRef = new Worker('/transport-worker.js');

      // Handle messages from worker
      this.workerRef.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        switch (type) {
          case 'INCOMING_MESSAGE':
            // Message received from transport layer
            if (this.isValidMessage(payload)) {
              const messageData = this.parseMessageEvent(payload);
              if (messageData) {
                this.notifyListeners(messageData);
              }
            }
            break;

          case 'CONNECTION_STATUS':
            // eslint-disable-next-line no-console
            console.log(
              '[MessageEventService] Worker connection status:',
              payload
            );
            break;

          case 'ERROR':
            // eslint-disable-next-line no-console
            console.error('[MessageEventService] Worker error:', payload);
            break;

          case 'RECONNECTING':
            // eslint-disable-next-line no-console
            console.log('[MessageEventService] Worker reconnecting:', payload);
            break;

          case 'CONNECTION_FAILED':
            // eslint-disable-next-line no-console
            console.error(
              '[MessageEventService] Worker connection failed:',
              payload
            );
            break;

          case 'MESSAGE_SENT':
            // eslint-disable-next-line no-console
            console.log('[MessageEventService] Message sent:', payload);
            break;

          case 'PONG':
            // Health check response
            break;

          default:
            // eslint-disable-next-line no-console
            console.warn('[MessageEventService] Unknown worker message:', type);
        }
      };

      // Handle worker errors
      this.workerRef.onerror = (error: ErrorEvent) => {
        // eslint-disable-next-line no-console
        console.error('[MessageEventService] Worker error:', error);
      };

      // Initialize worker with config
      this.workerRef.postMessage({
        type: 'INIT',
        payload: this.workerConfig,
      });

      // eslint-disable-next-line no-console
      console.log('[MessageEventService] Worker initialized');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        '[MessageEventService] Failed to initialize worker:',
        error
      );
      // Service will continue to work with just postMessage API
    }
  }

  /**
   * Send message through worker
   */
  sendThroughWorker(messageData: IncomingMessageData): void {
    if (!this.workerRef) {
      // eslint-disable-next-line no-console
      console.warn('[MessageEventService] Worker not available');
      return;
    }

    this.workerRef.postMessage({
      type: 'SEND_MESSAGE',
      payload: messageData,
    });
  }

  /**
   * Health check for worker
   */
  pingWorker(): void {
    if (!this.workerRef) {
      return;
    }

    this.workerRef.postMessage({
      type: 'PING',
    });
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
