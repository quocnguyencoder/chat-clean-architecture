import { Layout } from 'antd';
import { useState } from 'react';

import { ChatHeader } from '../../organisms/ChatHeader';
import { ChatList } from '../../organisms/ChatList';
import { EmptyState } from '../../organisms/EmptyState';
import { NavigationSidebar } from '../../organisms/NavigationSidebar';
import { MessagesArea } from '../MessagesArea';

import {
  getChatHeaderStyles,
  getChatListSidebarStyles,
  getMainChatAreaStyles,
  getNavigationSidebarStyles,
} from './styles';

import { mockChats } from '@/data/mockData';
import type { MainLayoutProps } from '@/types/chat';

const { Header, Sider, Content } = Layout;

export const ChatContent: React.FC<MainLayoutProps> = () => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [messageText, setMessageText] = useState('');

  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message logic here
      setMessageText('');
    }
  };

  return (
    <>
      {/* Left Navigation Sidebar */}
      <Sider width={60} style={getNavigationSidebarStyles()}>
        <NavigationSidebar />
      </Sider>

      {/* Chat List Sidebar */}
      <Sider width={320} style={getChatListSidebarStyles()}>
        <ChatList
          selectedChatId={selectedChat}
          onChatSelect={setSelectedChat}
        />
      </Sider>

      {/* Main Chat Area */}
      <Layout style={getMainChatAreaStyles()}>
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <Header style={getChatHeaderStyles()}>
              <ChatHeader selectedChat={selectedChatData} />
            </Header>

            {/* Messages Area */}
            <Content>
              <MessagesArea
                messageText={messageText}
                onMessageChange={setMessageText}
                onSendMessage={handleSendMessage}
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
