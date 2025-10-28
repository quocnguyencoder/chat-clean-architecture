/**
 * Chat Context
 *
 * React context for providing chat-related services and state to components.
 * This follows the Dependency Injection pattern for Clean Architecture.
 */

import React, {
  createContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

import { messageEventService } from '@/infrastructure/services';
import type { ChatParticipantsRepository } from '@/ports/ChatParticipantsRepository';
import type { ChatRepository } from '@/ports/ChatRepository';
import type { MessagesRepository } from '@/ports/MessagesRepository';
import { GetChatDetailUseCase } from '@/usecases/GetChatDetailUseCase';
import { GetChatListUseCase } from '@/usecases/GetChatListUseCase';
import { ReceiveMessageUseCase } from '@/usecases/ReceiveMessageUseCase';
import { SendMessageUseCase } from '@/usecases/SendMessageUseCase';

interface ChatContextValue {
  chatRepository: ChatRepository;
  participantsRepository: ChatParticipantsRepository;
  messagesRepository: MessagesRepository;
  getChatListUseCase: GetChatListUseCase;
  getChatDetailUseCase: GetChatDetailUseCase;
  sendMessageUseCase: SendMessageUseCase;
  receiveMessageUseCase: ReceiveMessageUseCase;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  chatRepository: ChatRepository;
  participantsRepository: ChatParticipantsRepository;
  messagesRepository: MessagesRepository;
}

/**
 * Chat Provider Component
 *
 * Provides chat services to the component tree via React context.
 * This enables dependency injection following Clean Architecture principles.
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  chatRepository,
  participantsRepository,
  messagesRepository,
}) => {
  // Create use case instances with injected dependencies using useMemo
  const getChatListUseCase = useMemo(
    () => new GetChatListUseCase(chatRepository),
    [chatRepository]
  );

  const getChatDetailUseCase = useMemo(
    () => new GetChatDetailUseCase(participantsRepository, messagesRepository),
    [participantsRepository, messagesRepository]
  );

  const sendMessageUseCase = useMemo(
    () => new SendMessageUseCase(messagesRepository, chatRepository),
    [messagesRepository, chatRepository]
  );

  const receiveMessageUseCase = useMemo(
    () => new ReceiveMessageUseCase(messagesRepository, chatRepository),
    [messagesRepository, chatRepository]
  );

  const contextValue: ChatContextValue = useMemo(
    () => ({
      chatRepository,
      participantsRepository,
      messagesRepository,
      getChatListUseCase,
      getChatDetailUseCase,
      sendMessageUseCase,
      receiveMessageUseCase,
    }),
    [
      chatRepository,
      participantsRepository,
      messagesRepository,
      getChatListUseCase,
      getChatDetailUseCase,
      sendMessageUseCase,
      receiveMessageUseCase,
    ]
  );

  // Initialize message event service
  useEffect(() => {
    // Start listening for incoming messages
    messageEventService.startListening();

    // Subscribe to message events
    const unsubscribe = messageEventService.subscribe(async messageData => {
      try {
        // Process incoming message through use case
        await receiveMessageUseCase.execute(messageData);

        // Trigger a custom event that components can listen to
        window.dispatchEvent(
          new CustomEvent('chat:newMessage', {
            detail: messageData,
          })
        );
      } catch {
        // Silently handle errors
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      messageEventService.stopListening();
    };
  }, [receiveMessageUseCase]);

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Export context for use in hooks
export { ChatContext };
export type { ChatContextValue };
