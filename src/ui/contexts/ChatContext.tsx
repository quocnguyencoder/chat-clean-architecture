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
  useState,
  type ReactNode,
} from 'react';

import type { Chat } from '@/domain/entities/Chat';
import type { Story } from '@/domain/entities/Story';
import type { UserStatus } from '@/domain/entities/UserStatus';
import { messageEventService } from '@/infrastructure/services';
import { MockResponseService } from '@/infrastructure/services/MockResponseService';
import { CURRENT_USER, type User } from '@/mocks/users';
import type { ChatParticipantsRepository } from '@/ports/ChatParticipantsRepository';
import type { ChatRepository } from '@/ports/ChatRepository';
import type { MessagesRepository } from '@/ports/MessagesRepository';
import type { UserStatusRepository } from '@/ports/UserStatusRepository';
import { GetChatDetailUseCase } from '@/usecases/GetChatDetailUseCase';
import { GetChatListUseCase } from '@/usecases/GetChatListUseCase';
import { GetOnlineUsersUseCase } from '@/usecases/GetOnlineUsersUseCase';
import { GetStoriesUseCase } from '@/usecases/GetStoriesUseCase';
import { ReceiveMessageUseCase } from '@/usecases/ReceiveMessageUseCase';
import { SendMessageUseCase } from '@/usecases/SendMessageUseCase';

interface ChatContextValue {
  chatRepository: ChatRepository;
  participantsRepository: ChatParticipantsRepository;
  messagesRepository: MessagesRepository;
  userStatusRepository: UserStatusRepository;
  getChatListUseCase: GetChatListUseCase;
  getChatDetailUseCase: GetChatDetailUseCase;
  sendMessageUseCase: SendMessageUseCase;
  receiveMessageUseCase: ReceiveMessageUseCase;
  getOnlineUsersUseCase: GetOnlineUsersUseCase;
  getStoriesUseCase: GetStoriesUseCase;
  mockResponseService: MockResponseService | null;
  currentUser: User;
  onlineUsers: UserStatus[];
  stories: Story[];
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  chatRepository: ChatRepository;
  participantsRepository: ChatParticipantsRepository;
  messagesRepository: MessagesRepository;
  userStatusRepository: UserStatusRepository;
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
  userStatusRepository,
}) => {
  // Ref to store chats for the mock service
  const chatsRef = useRef<Chat[]>([]);

  // State for online users and stories
  const [onlineUsers, setOnlineUsers] = useState<UserStatus[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

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

  const getOnlineUsersUseCase = useMemo(
    () => new GetOnlineUsersUseCase(userStatusRepository),
    [userStatusRepository]
  );

  const getStoriesUseCase = useMemo(
    () => new GetStoriesUseCase(userStatusRepository),
    [userStatusRepository]
  );

  // Initialize mock response service
  const mockResponseService = useMemo(
    () =>
      new MockResponseService(
        receiveMessageUseCase,
        chatRepository,
        participantsRepository,
        () => chatsRef.current
      ),
    [receiveMessageUseCase, chatRepository, participantsRepository]
  );

  const contextValue: ChatContextValue = useMemo(
    () => ({
      chatRepository,
      participantsRepository,
      messagesRepository,
      userStatusRepository,
      getChatListUseCase,
      getChatDetailUseCase,
      sendMessageUseCase,
      receiveMessageUseCase,
      getOnlineUsersUseCase,
      getStoriesUseCase,
      mockResponseService,
      currentUser: CURRENT_USER,
      onlineUsers,
      stories,
    }),
    [
      chatRepository,
      participantsRepository,
      messagesRepository,
      userStatusRepository,
      getChatListUseCase,
      getChatDetailUseCase,
      sendMessageUseCase,
      receiveMessageUseCase,
      getOnlineUsersUseCase,
      getStoriesUseCase,
      mockResponseService,
      onlineUsers,
      stories,
    ]
  );

  // Initialize message event service
  useEffect(() => {
    // Load initial chats data
    void getChatListUseCase.execute().then(chats => {
      chatsRef.current = chats;
    });

    // Load initial online users
    void getOnlineUsersUseCase.execute().then(users => {
      setOnlineUsers(users);
    });

    // Load initial stories
    void getStoriesUseCase.execute().then(storiesData => {
      setStories(storiesData);
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
  }, [
    receiveMessageUseCase,
    getChatListUseCase,
    mockResponseService,
    getOnlineUsersUseCase,
    getStoriesUseCase,
  ]);

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Export context for use in hooks
export { ChatContext };
export type { ChatContextValue };
