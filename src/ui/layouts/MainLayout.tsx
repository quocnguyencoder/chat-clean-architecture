import {
  AudioOutlined,
  BookOutlined,
  MenuOutlined,
  MessageOutlined,
  MoreOutlined,
  PhoneOutlined,
  PictureOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  Layout,
  Space,
  Typography,
} from 'antd';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

interface MainLayoutProps {
  children?: React.ReactNode;
}

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline: boolean;
  unreadCount?: number;
  isGroup?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  senderName?: string;
}

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Đã Lạt 🚙',
    lastMessage: 'Tuyển: kh tốt cho e...',
    time: '12:44 pm',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Thuy Trang',
    lastMessage: 'Ok',
    time: '12:34 pm',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Phước Yên',
    lastMessage: 'Em qúi con buq vo tr...',
    time: '11:53 am',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    unreadCount: 49,
  },
  {
    id: '4',
    name: 'Make Frontline Great...',
    lastMessage: 'Seizam: Ngon k...',
    time: '11:08 am',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Ninh Thuận 4/10/2025 Kh...',
    lastMessage: 'Phương: S nay đêo...',
    time: '11:05 am',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    isGroup: true,
  },
  {
    id: '6',
    name: 'Tỗ Hợp Thể Thao Speedy...',
    lastMessage: 'Ok c chốt 1 sẵn câu...',
    time: '10:59 am',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    isGroup: true,
  },
  {
    id: '7',
    name: 'Văn phòng thám tử',
    lastMessage: 'Nam: những cuộc kì k...',
    time: '10:54 am',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    isGroup: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'a Sang nữa',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Tuyển',
  },
  {
    id: '2',
    text: 'đồn hết cty rồi',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Linh',
  },
  {
    id: '3',
    text: 'đi làm k con bth nữa rồi 😂',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Tuyển',
  },
  {
    id: '4',
    text: 'quá đã',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Linh',
  },
  {
    id: '5',
    text: 'làm thiệt luôn cho ngta khỏi đồn đoán e',
    sender: 'other',
    time: '12:40 PM',
  },
  {
    id: '6',
    text: 'kh tốt cho em anh a 😂',
    sender: 'other',
    time: '12:40 PM',
    senderName: 'Tuyển',
  },
  {
    id: '7',
    text: 'ko hể hỏi gì luôn ấy',
    sender: 'me',
    time: '12:40 PM',
  },
];

export const MainLayout: React.FC<MainLayoutProps> = () => {
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
    <Layout
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#1a1a1a',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Left Navigation Sidebar */}
      <Sider
        width={60}
        style={{
          background: '#1a1a1a',
          borderRight: '1px solid #2a2a2a',
          padding: '8px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <Title level={4} style={{ color: '#fff', margin: 0, fontSize: 18 }}>
              Q
            </Title>
          </div>

          <Space direction='vertical' size={16} style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge count={3} size='small'>
                <Button
                  type='text'
                  icon={<MessageOutlined />}
                  style={{
                    color: '#0084ff',
                    background: 'rgba(0, 132, 255, 0.1)',
                    border: 'none',
                    width: 40,
                    height: 40,
                  }}
                />
              </Badge>
              <div style={{ color: '#0084ff', fontSize: 10, marginTop: 4 }}>
                Chats
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                type='text'
                icon={<BookOutlined />}
                style={{
                  color: '#8a8a8a',
                  border: 'none',
                  width: 40,
                  height: 40,
                }}
              />
              <div style={{ color: '#8a8a8a', fontSize: 10, marginTop: 4 }}>
                Stories
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Badge dot>
                <Button
                  type='text'
                  icon={<MenuOutlined />}
                  style={{
                    color: '#8a8a8a',
                    border: 'none',
                    width: 40,
                    height: 40,
                  }}
                />
              </Badge>
              <div style={{ color: '#8a8a8a', fontSize: 10, marginTop: 4 }}>
                Menu
              </div>
            </div>
          </Space>

          <div style={{ marginTop: 'auto', marginBottom: 16 }}>
            <Avatar size={32} src='/api/placeholder/32/32' />
          </div>
        </div>
      </Sider>

      {/* Chat List Sidebar */}
      <Sider
        width={320}
        style={{
          background: '#1e1e1e',
          borderRight: '1px solid #2a2a2a',
        }}
      >
        <div style={{ padding: '16px 12px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              Chats
            </Title>
            <Button
              type='text'
              icon={<PlusOutlined />}
              style={{ color: '#8a8a8a', border: 'none' }}
            />
          </div>

          {/* Search */}
          <Input
            placeholder='Search'
            prefix={<SearchOutlined style={{ color: '#8a8a8a' }} />}
            style={{
              background: '#2a2a2a',
              border: 'none',
              borderRadius: 20,
              color: '#fff',
              marginBottom: 16,
            }}
          />

          {/* Status Stories */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 8,
              }}
            >
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)',
                    padding: 2,
                    marginBottom: 4,
                  }}
                >
                  <Avatar
                    size={52}
                    src='/api/placeholder/52/52'
                    style={{ border: '2px solid #1e1e1e' }}
                  />
                </div>
                <Text style={{ color: '#fff', fontSize: 12 }}>Your note</Text>
              </div>
              {['Bình', 'Trang', 'Đ'].map(name => (
                <div key={name} style={{ textAlign: 'center', minWidth: 60 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)',
                      padding: 2,
                      marginBottom: 4,
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      size={52}
                      src='/api/placeholder/52/52'
                      style={{ border: '2px solid #1e1e1e' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#44b700',
                        border: '2px solid #1e1e1e',
                      }}
                    />
                  </div>
                  <Text style={{ color: '#fff', fontSize: 12 }}>{name}</Text>
                </div>
              ))}
            </div>
          </div>

          <Divider style={{ borderColor: '#2a2a2a', margin: '16px 0' }} />

          {/* Chat List */}
          <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
            {mockChats.map(chat => (
              <div
                key={chat.id}
                role='button'
                tabIndex={0}
                onClick={() => setSelectedChat(chat.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedChat(chat.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 8px',
                  borderRadius: 8,
                  background:
                    selectedChat === chat.id ? '#2a2a2a' : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 4,
                }}
              >
                <div style={{ position: 'relative', marginRight: 12 }}>
                  <Avatar size={48} src={chat.avatar} />
                  {chat.isOnline && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: '#44b700',
                        border: '2px solid #1e1e1e',
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text strong style={{ color: '#fff', fontSize: 14 }}>
                      {chat.name}
                    </Text>
                    <Text style={{ color: '#8a8a8a', fontSize: 12 }}>
                      {chat.time}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: chat.unreadCount ? '#fff' : '#8a8a8a',
                        fontSize: 13,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px',
                      }}
                    >
                      {chat.lastMessage}
                    </Text>
                    {chat.unreadCount && (
                      <Badge
                        count={chat.unreadCount}
                        style={{
                          background: '#0084ff',
                          minWidth: 20,
                          height: 20,
                          borderRadius: 10,
                          fontSize: 11,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sider>

      {/* Main Chat Area */}
      <Layout
        style={{
          background: '#1e1e1e',
          width: 'calc(100vw - 380px)', // Total width minus sidebars (60px + 320px)
          minWidth: 400, // Minimum width for proper display
        }}
      >
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <Header
              style={{
                background: '#1e1e1e',
                borderBottom: '1px solid #2a2a2a',
                padding: '0 16px',
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div style={{ position: 'relative', marginRight: 12 }}>
                  <Avatar size={40} src={selectedChatData.avatar} />
                  {selectedChatData.isOnline && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: '#44b700',
                        border: '2px solid #1e1e1e',
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    maxWidth: 'calc(100% - 200px)', // Reserve space for buttons
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Text
                    strong
                    style={{
                      color: '#fff',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    {selectedChatData.name}
                  </Text>
                  <Text
                    style={{
                      color: '#44b700',
                      fontSize: 12,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    Active now
                  </Text>
                </div>
              </div>
              <Space style={{ flexShrink: 0 }}>
                <Button
                  type='text'
                  icon={<PhoneOutlined />}
                  style={{ color: '#0084ff', border: 'none' }}
                />
                <Button
                  type='text'
                  icon={<VideoCameraOutlined />}
                  style={{ color: '#0084ff', border: 'none' }}
                />
                <Button
                  type='text'
                  icon={<MoreOutlined />}
                  style={{ color: '#8a8a8a', border: 'none' }}
                />
              </Space>
            </Header>

            {/* Messages Area */}
            <Content
              style={{
                padding: '16px',
                overflowY: 'auto',
                height: 'calc(100vh - 140px)',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: 'calc(100vw - 380px)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Text style={{ color: '#8a8a8a', fontSize: 12 }}>
                    Unread messages
                  </Text>
                </div>

                {mockMessages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        message.sender === 'me' ? 'flex-end' : 'flex-start',
                      marginBottom: 8,
                      alignItems: 'flex-end',
                    }}
                  >
                    {message.sender === 'other' && (
                      <Avatar
                        size={28}
                        src='/api/placeholder/28/28'
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '8px 12px',
                        borderRadius: 18,
                        background:
                          message.sender === 'me' ? '#0084ff' : '#2a2a2a',
                        color: '#fff',
                        position: 'relative',
                      }}
                    >
                      {message.senderName && message.sender === 'other' && (
                        <Text
                          style={{
                            color: '#8a8a8a',
                            fontSize: 11,
                            display: 'block',
                            marginBottom: 2,
                          }}
                        >
                          {message.senderName}
                        </Text>
                      )}
                      <Text style={{ color: '#fff' }}>{message.text}</Text>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div
                style={{
                  background: '#2a2a2a',
                  borderRadius: 24,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <Button
                  type='text'
                  icon={<PlusOutlined />}
                  style={{
                    color: '#0084ff',
                    border: 'none',
                    minWidth: 'auto',
                    padding: 4,
                  }}
                />
                <Button
                  type='text'
                  icon={<PictureOutlined />}
                  style={{
                    color: '#8a8a8a',
                    border: 'none',
                    minWidth: 'auto',
                    padding: 4,
                  }}
                />
                <Button
                  type='text'
                  icon={<AudioOutlined />}
                  style={{
                    color: '#8a8a8a',
                    border: 'none',
                    minWidth: 'auto',
                    padding: 4,
                  }}
                />
                <Input
                  placeholder='Aa'
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onPressEnter={handleSendMessage}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    flex: 1,
                  }}
                  suffix={
                    <Button
                      type='text'
                      icon={<SmileOutlined />}
                      style={{
                        color: '#8a8a8a',
                        border: 'none',
                        minWidth: 'auto',
                        padding: 4,
                      }}
                    />
                  }
                />
                {messageText ? (
                  <Button
                    type='text'
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    style={{
                      color: '#0084ff',
                      border: 'none',
                      minWidth: 'auto',
                      padding: 4,
                    }}
                  />
                ) : (
                  <Button
                    type='text'
                    icon={<AudioOutlined />}
                    style={{
                      color: '#8a8a8a',
                      border: 'none',
                      minWidth: 'auto',
                      padding: 4,
                    }}
                  />
                )}
              </div>
            </Content>
          </>
        ) : (
          <Content
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1e1e1e',
              width: '100%',
              height: '100vh',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <MessageOutlined
                style={{ fontSize: 64, color: '#8a8a8a', marginBottom: 16 }}
              />
              <Title level={4} style={{ color: '#8a8a8a' }}>
                Select a chat to start messaging
              </Title>
            </div>
          </Content>
        )}
      </Layout>
    </Layout>
  );
};
