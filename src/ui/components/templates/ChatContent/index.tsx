import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ChatHeader } from '../../organisms/ChatHeader';
import { ChatList } from '../../organisms/ChatList';
import { EmptyState } from '../../organisms/EmptyState';
import { NavigationSidebar } from '../../organisms/NavigationSidebar';
import { MessagesArea } from '../MessagesArea';

import { styles } from './styles';

import { URL_PARAMS } from '@/constants';
import type { MainLayoutProps } from '@/types/chat';
import { useChatContext, useChatDetail, useChatList } from '@/ui/hooks';

const { Header, Sider, Content } = Layout;

export const ChatContent: React.FC<MainLayoutProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const chatIdFromUrl = searchParams.get(URL_PARAMS.CHAT_ID);
  const messageIdFromUrl = searchParams.get(URL_PARAMS.MESSAGE_ID);

  const [selectedChat, setSelectedChat] = useState<string | null>(
    chatIdFromUrl
  );
  const [messageText, setMessageText] = useState('');
  const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(
    messageIdFromUrl
  );

  const { sendMessageUseCase, currentUser } = useChatContext();
  const { chats } = useChatList();
  const {
    chatDetail,
    loading: detailLoading,
    loadChatDetail,
    refreshChatDetail,
  } = useChatDetail();

  // Set default chat if none selected and chats are available
  useEffect(() => {
    if (!selectedChat && chats.length > 0) {
      const firstChat = chats[0];
      setSelectedChat(firstChat.id);
      navigate(`?${URL_PARAMS.CHAT_ID}=${firstChat.id}`, { replace: true });
    }
  }, [selectedChat, chats, navigate]);

  // Update selected chat when URL changes
  useEffect(() => {
    if (chatIdFromUrl && chatIdFromUrl !== selectedChat) {
      setSelectedChat(chatIdFromUrl);
    }
  }, [chatIdFromUrl, selectedChat]);

  // Update scroll target when URL changes
  useEffect(() => {
    setScrollToMessageId(messageIdFromUrl);
  }, [messageIdFromUrl]);

  // Load chat detail when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      void loadChatDetail(selectedChat);
    }
  }, [selectedChat, loadChatDetail]);

  const selectedChatData = selectedChat
    ? chats.find(chat => chat.id === selectedChat)
    : null;

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedChat) {
      try {
        // Send the message using the use case
        await sendMessageUseCase.execute(
          selectedChat,
          messageText,
          currentUser.id,
          currentUser.name
        );

        // Clear the input
        setMessageText('');

        // Refresh chat detail to show the new message
        await refreshChatDetail();
      } catch (error) {
        // Handle error - could show a toast notification
        // eslint-disable-next-line no-console
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleChatSelect = async (chatId: string) => {
    setSelectedChat(chatId);
    // Update URL without message ID
    navigate(`?${URL_PARAMS.CHAT_ID}=${chatId}`, { replace: true });
  };

  const handleScrollToComplete = () => {
    // Clear the scroll target and remove messageId from URL
    setScrollToMessageId(null);
    if (messageIdFromUrl && selectedChat) {
      navigate(`?${URL_PARAMS.CHAT_ID}=${selectedChat}`, { replace: true });
    }
  };

  return (
    <>
      {/* Left Navigation Sidebar */}
      <Sider width={60} style={styles.navigationSidebar}>
        <NavigationSidebar />
      </Sider>

      {/* Chat List Sidebar */}
      <Sider width={320} style={styles.chatListSidebar}>
        <ChatList
          selectedChatId={selectedChat ?? ''}
          onChatSelect={handleChatSelect}
        />
      </Sider>

      {/* Main Chat Area */}
      <Layout style={styles.mainChatArea}>
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <Header style={styles.chatHeader}>
              <ChatHeader
                selectedChat={selectedChatData}
                chatMessages={chatDetail?.messages || []}
                chatParticipants={chatDetail?.participants || []}
              />
            </Header>

            {/* Messages Area */}
            <Content>
              <MessagesArea
                messageText={messageText}
                onMessageChange={setMessageText}
                onSendMessage={handleSendMessage}
                chatDetail={chatDetail}
                detailLoading={detailLoading}
                scrollToMessageId={scrollToMessageId}
                onScrollToComplete={handleScrollToComplete}
              />
            </Content>
          </>
        ) : (
          <Content>
            <EmptyState />
          </Content>
        )}
      </Layout>
    </>
  );
};
