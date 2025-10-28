/**
 * Chat Context
 *
 * React context for providing chat-related services and state to components.
 * This follows the Dependency Injection pattern for Clean Architecture.
 */

import React, { createContext, type ReactNode } from 'react';

import type { ChatRepository } from '@/ports/ChatRepository';
import { GetChatListUseCase } from '@/usecases/GetChatListUseCase';

interface ChatContextValue {
  chatRepository: ChatRepository;
  getChatListUseCase: GetChatListUseCase;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  chatRepository: ChatRepository;
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
}) => {
  // Create use case instances with injected dependencies
  const getChatListUseCase = new GetChatListUseCase(chatRepository);

  const contextValue: ChatContextValue = {
    chatRepository,
    getChatListUseCase,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Export context for use in hooks
export { ChatContext };
export type { ChatContextValue };
