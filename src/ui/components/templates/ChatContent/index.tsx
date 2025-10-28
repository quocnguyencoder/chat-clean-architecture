import { Layout } from 'antd';
import { useEffect, useState } from 'react';

import { ChatHeader } from '../../organisms/ChatHeader';
import { ChatList } from '../../organisms/ChatList';
import { EmptyState } from '../../organisms/EmptyState';
import { NavigationSidebar } from '../../organisms/NavigationSidebar';
import { MessagesArea } from '../MessagesArea';

import { styles } from './styles';

import type { MainLayoutProps } from '@/types/chat';
import { useChatDetail, useChatList } from '@/ui/hooks';

const { Header, Sider, Content } = Layout;

export const ChatContent: React.FC<MainLayoutProps> = () => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [messageText, setMessageText] = useState('');

  const { chats } = useChatList();
  const {
    chatDetail,
    loading: detailLoading,
    loadChatDetail,
  } = useChatDetail();

  // Load chat detail when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      void loadChatDetail(selectedChat);
    }
  }, [selectedChat, loadChatDetail]);

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message logic here
      setMessageText('');
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
          onChatSelect={setSelectedChat}
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
