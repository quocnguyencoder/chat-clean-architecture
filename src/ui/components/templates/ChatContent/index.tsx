import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ChatHeader } from '../../organisms/ChatHeader';
import { ChatList } from '../../organisms/ChatList';
import { EmptyState } from '../../organisms/EmptyState';
import { NavigationSidebar } from '../../organisms/NavigationSidebar';
import { MessagesArea } from '../MessagesArea';

import { styles } from './styles';

import type { MainLayoutProps } from '@/types/chat';
import { useChatContext, useChatDetail, useChatList } from '@/ui/hooks';

const { Header, Sider, Content } = Layout;

export const ChatContent: React.FC<MainLayoutProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const chatIdFromUrl = searchParams.get('chatId') || '1';
  const messageIdFromUrl = searchParams.get('messageId');

  const [selectedChat, setSelectedChat] = useState<string>(chatIdFromUrl);
  const [messageText, setMessageText] = useState('');
  const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(
    messageIdFromUrl
  );

  const { sendMessageUseCase } = useChatContext();
  const { chats } = useChatList();
  const {
    chatDetail,
    loading: detailLoading,
    loadChatDetail,
    refreshChatDetail,
  } = useChatDetail();

  // Update selected chat when URL changes
  useEffect(() => {
    if (chatIdFromUrl !== selectedChat) {
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

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedChat) {
      try {
        // Send the message using the use case
        await sendMessageUseCase.execute(
          selectedChat,
          messageText,
          'current-user', // This should be from actual user context
          'Me' // This should be from actual user context
        );

        // Clear the input
        setMessageText('');

        // Refresh chat detail to show the new message
        await refreshChatDetail();

        // Trigger custom event for other components to update
        window.dispatchEvent(
          new CustomEvent('chat:newMessage', {
            detail: {
              chatId: selectedChat,
              messageId: `msg-${Date.now()}`,
              text: messageText,
              senderId: 'current-user',
              senderName: 'Me',
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              }),
              isFromMe: true,
            },
          })
        );
      } catch (error) {
        // Handle error - could show a toast notification
        // eslint-disable-next-line no-console
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    // Update URL without message ID
    navigate(`?chatId=${chatId}`, { replace: true });
  };

  const handleScrollToComplete = () => {
    // Clear the scroll target and remove messageId from URL
    setScrollToMessageId(null);
    if (messageIdFromUrl) {
      navigate(`?chatId=${selectedChat}`, { replace: true });
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
          selectedChatId={selectedChat}
          onChatSelect={handleChatSelect}
        />
      </Sider>

      {/* Main Chat Area */}
      <Layout style={styles.mainChatArea}>
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <Header style={styles.chatHeader}>
              <ChatHeader selectedChat={selectedChatData} />
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
