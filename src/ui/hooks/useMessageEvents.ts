/**
 * Use Message Events Hook
 *
 * Custom hook for handling incoming message events.
 * Listens for new messages and triggers callbacks when they arrive.
 */

import { useEffect, useState } from 'react';

import type { IncomingMessageData } from '@/usecases/ReceiveMessageUseCase';

interface UseMessageEventsOptions {
  onNewMessage?: (message: IncomingMessageData) => void;
  chatId?: string; // Only listen for messages in this chat
}

/**
 * Hook for handling message events
 */
export const useMessageEvents = (options: UseMessageEventsOptions = {}) => {
  const { onNewMessage, chatId } = options;
  const [lastMessage, setLastMessage] = useState<IncomingMessageData | null>(
    null
  );

  useEffect(() => {
    const handleNewMessage = (event: Event) => {
      const customEvent = event as CustomEvent<IncomingMessageData>;
      const messageData = customEvent.detail;

      // Filter by chatId if specified
      if (chatId && messageData.chatId !== chatId) {
        return;
      }

      setLastMessage(messageData);

      if (onNewMessage) {
        onNewMessage(messageData);
      }
    };

    window.addEventListener('chat:newMessage', handleNewMessage);

    return () => {
      window.removeEventListener('chat:newMessage', handleNewMessage);
    };
  }, [onNewMessage, chatId]);

  return { lastMessage };
};
