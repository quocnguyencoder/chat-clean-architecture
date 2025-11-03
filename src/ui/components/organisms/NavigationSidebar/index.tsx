import {
  DownloadOutlined,
  MessageOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Avatar, Space, Tooltip, Typography, Upload, message } from 'antd';
import { useState } from 'react';

import { useChatContext } from '../../../hooks/useChatContext';
import { NavigationItem } from '../../molecules/NavigationItem';

import { styles } from './styles';

import { theme } from '@/constants/theme';
import {
  downloadLocalStorageData,
  loadLocalStorageFromFile,
} from '@/utils/localStorageManager';
import { resetData } from '@/utils/seedData';

const { Title } = Typography;

export const NavigationSidebar: React.FC = () => {
  const { mockResponseService, currentUser } = useChatContext();
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

  const handleExport = () => {
    try {
      downloadLocalStorageData();
      message.success('Data exported successfully!');
    } catch {
      message.error('Failed to export data');
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      await loadLocalStorageFromFile(file);
      message.success('Data imported successfully! Refreshing page...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Failed to import data'
      );
    }
  };

  const uploadProps = {
    beforeUpload: (file: UploadFile) => {
      if (file.type !== 'application/json') {
        message.error('Please upload a JSON file');
        return false;
      }
      handleFileSelect(file as unknown as File);
      return false;
    },
    showUploadList: false,
    accept: '.json',
    style: styles.uploadButton,
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
        />

        {/* <NavigationItem
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
        /> */}

        {/* Divider */}
        <div style={styles.divider} />

        {/* Export Data Button */}
        <Tooltip title='Export data to JSON file' placement='right'>
          <div
            role='button'
            tabIndex={0}
            onClick={handleExport}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleExport();
              }
            }}
            style={styles.actionButton}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                theme.colors.background.hoverLight;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <DownloadOutlined style={styles.exportIcon} />
          </div>
        </Tooltip>

        {/* Import Data Button */}
        <Tooltip title='Import data from JSON file' placement='right'>
          <Upload {...uploadProps}>
            <div
              role='button'
              tabIndex={0}
              style={{
                ...styles.actionButton,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  theme.colors.background.hoverLight;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <UploadOutlined style={styles.importIcon} />
            </div>
          </Upload>
        </Tooltip>

        {/* Divider */}
        <div style={styles.divider} />

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
            style={styles.actionButton}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                theme.colors.background.hoverLight;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ReloadOutlined style={styles.reloadIcon} />
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
            style={styles.actionButton}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                theme.colors.background.hoverLight;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isPaused ? (
              <PlayCircleOutlined style={styles.playIcon} />
            ) : (
              <PauseCircleOutlined style={styles.pauseIcon} />
            )}
          </div>
        </Tooltip>
      </Space>

      <div style={styles.userAvatarContainer}>
        <Tooltip title={currentUser.name} placement='right'>
          <Avatar size={32} src={currentUser.avatar} />
        </Tooltip>
      </div>
    </div>
  );
};
