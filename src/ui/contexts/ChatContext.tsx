/**
 * Chat Context
 *
 * React context for providing chat-related services and state to components.
 * This follows the Dependency Injection pattern for Clean Architecture.
 */

import React, { createContext, type ReactNode } from 'react';

import type { ChatParticipantsRepository } from '@/ports/ChatParticipantsRepository';
import type { ChatRepository } from '@/ports/ChatRepository';
import type { MessagesRepository } from '@/ports/MessagesRepository';
import { GetChatDetailUseCase } from '@/usecases/GetChatDetailUseCase';
import { GetChatListUseCase } from '@/usecases/GetChatListUseCase';

interface ChatContextValue {
  chatRepository: ChatRepository;
  participantsRepository: ChatParticipantsRepository;
  messagesRepository: MessagesRepository;
  getChatListUseCase: GetChatListUseCase;
  getChatDetailUseCase: GetChatDetailUseCase;
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
  // Create use case instances with injected dependencies
  const getChatListUseCase = new GetChatListUseCase(chatRepository);
  const getChatDetailUseCase = new GetChatDetailUseCase(
    participantsRepository,
    messagesRepository
  );

  const contextValue: ChatContextValue = {
    chatRepository,
    participantsRepository,
    messagesRepository,
    getChatListUseCase,
    getChatDetailUseCase,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Export context for use in hooks
export { ChatContext };
export type { ChatContextValue };
