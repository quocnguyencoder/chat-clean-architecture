import {
  BookOutlined,
  MenuOutlined,
  MessageOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Avatar, Space, Tooltip, Typography, message } from 'antd';
import { useState } from 'react';

import { useChatContext } from '../../../hooks/useChatContext';
import { NavigationItem } from '../../molecules/NavigationItem';

import { styles } from './styles';

import { resetData } from '@/utils/seedData';

const { Title } = Typography;

export const NavigationSidebar: React.FC = () => {
  const { mockResponseService } = useChatContext();
  const [isPaused, setIsPaused] = useState(
    mockResponseService?.isPausedState() ?? false
  );

  const handleSeedData = () => {
    message.loading('Resetting data...', 0.5);
    // resetData() will clear localStorage, seed data, and refresh automatically
    resetData();
  };

  const handleToggleMockResponse = () => {
    if (mockResponseService) {
      const newPausedState = mockResponseService.toggle();
      setIsPaused(newPausedState);
      message.info(
        newPausedState ? 'Mock responses paused' : 'Mock responses resumed'
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.brandContainer}>
        <Title level={4} style={styles.brand}>
          Q
        </Title>
      </div>

      <Space direction='vertical' size={16} style={styles.navigationMenu}>
        <NavigationItem
          icon={<MessageOutlined />}
          label='Chats'
          isActive={true}
          badge={3}
          badgeType='count'
        />

        <NavigationItem
          icon={<BookOutlined />}
          label='Stories'
          isActive={false}
        />

        <NavigationItem
          icon={<MenuOutlined />}
          label='Menu'
          isActive={false}
          badge={true}
          badgeType='dot'
        />

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8', margin: '8px 0' }} />

        {/* Seed Data Button */}
        <Tooltip title='Reset to default data' placement='right'>
          <div
            role='button'
            tabIndex={0}
            onClick={handleSeedData}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSeedData();
              }
            }}
            style={{
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ReloadOutlined style={{ fontSize: '20px', color: '#1976d2' }} />
          </div>
        </Tooltip>

        {/* Toggle Mock Response Button */}
        <Tooltip
          title={isPaused ? 'Resume mock responses' : 'Pause mock responses'}
          placement='right'
        >
          <div
            role='button'
            tabIndex={0}
            onClick={handleToggleMockResponse}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleToggleMockResponse();
              }
            }}
            style={{
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isPaused ? (
              <PlayCircleOutlined
                style={{ fontSize: '20px', color: '#52c41a' }}
              />
            ) : (
              <PauseCircleOutlined
                style={{ fontSize: '20px', color: '#faad14' }}
              />
            )}
          </div>
        </Tooltip>
      </Space>

      <div style={styles.userAvatarContainer}>
        <Avatar size={32} src='/api/placeholder/32/32' />
      </div>
    </div>
  );
};
