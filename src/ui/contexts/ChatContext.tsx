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
  useRef,
  type ReactNode,
} from 'react';

import type { Chat } from '@/domain/entities/Chat';
import type { ChatDetail } from '@/domain/entities/ChatDetail';
import { messageEventService } from '@/infrastructure/services';
import { MockResponseService } from '@/infrastructure/services/MockResponseService';
import { CURRENT_USER, type User } from '@/mocks/users';
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
  mockResponseService: MockResponseService | null;
  currentUser: User;
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
  // Ref to store chats and chat details for the mock service
  const chatsRef = useRef<Chat[]>([]);
  const chatDetailsRef = useRef<Map<string, ChatDetail>>(new Map());

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

  // Initialize mock response service
  const mockResponseService = useMemo(
    () =>
      new MockResponseService(
        receiveMessageUseCase,
        chatRepository,
        () => chatsRef.current,
        (chatId: string) => chatDetailsRef.current.get(chatId) || null
      ),
    [receiveMessageUseCase, chatRepository]
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
      mockResponseService,
      currentUser: CURRENT_USER,
    }),
    [
      chatRepository,
      participantsRepository,
      messagesRepository,
      getChatListUseCase,
      getChatDetailUseCase,
      sendMessageUseCase,
      receiveMessageUseCase,
      mockResponseService,
    ]
  );

  // Initialize message event service
  useEffect(() => {
    // Load initial chats data
    void getChatListUseCase.execute().then(chats => {
      chatsRef.current = chats;
    });

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

    // Start mock response service for demo
    mockResponseService.start();

    // Listen to chat list updates to keep the ref updated
    const handleChatUpdate = () => {
      void getChatListUseCase.execute().then(chats => {
        chatsRef.current = chats;
      });
    };
    window.addEventListener('chat:newMessage', handleChatUpdate);
    window.addEventListener('chat:updated', handleChatUpdate);

    // Cleanup on unmount
    return () => {
      unsubscribe();
      messageEventService.stopListening();
      mockResponseService.stop();
      window.removeEventListener('chat:newMessage', handleChatUpdate);
      window.removeEventListener('chat:updated', handleChatUpdate);
    };
  }, [receiveMessageUseCase, getChatListUseCase, mockResponseService]);

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Export context for use in hooks
export { ChatContext };
export type { ChatContextValue };
