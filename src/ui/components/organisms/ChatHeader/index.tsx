import {
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';

import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';

import { styles } from './styles';

import type { ChatItem } from '@/types/chat';

const { Text } = Typography;

interface ChatHeaderProps {
  selectedChat: ChatItem;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChat }) => {
  return (
    <div style={styles.container}>
      <div style={styles.userInfo}>
        <AvatarWithStatus
          size={48}
          src={selectedChat.avatar}
          isOnline={selectedChat.isOnline}
          statusSize='large'
          style={styles.avatarContainer}
        />
        <div style={styles.userDetails}>
          <Text strong style={styles.userName}>
            {selectedChat.name}
          </Text>
          <Text style={styles.userStatus}>Active now</Text>
        </div>
      </div>
      <Space style={styles.actions}>
        <Button
          type='text'
          icon={<PhoneOutlined />}
          style={styles.actionButton.primary}
        />
        <Button
          type='text'
          icon={<VideoCameraOutlined />}
          style={styles.actionButton.primary}
        />
        <Button
          type='text'
          icon={<MoreOutlined />}
          style={styles.actionButton.secondary}
        />
      </Space>
    </div>
  );
};
