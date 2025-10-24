import {
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';

import { AvatarWithStatus } from '../../molecules/AvatarWithStatus';

import {
  getActionButtonStyle,
  getAvatarContainerStyles,
  getChatHeaderActionsStyles,
  getChatHeaderStyles,
  getChatHeaderUserDetailsStyles,
  getChatHeaderUserInfoStyles,
  getChatHeaderUserNameStyles,
  getChatHeaderUserStatusStyles,
} from './styles';

import type { ChatItem } from '@/types/chat';

const { Text } = Typography;

interface ChatHeaderProps {
  selectedChat: ChatItem;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedChat }) => {
  return (
    <div style={getChatHeaderStyles()}>
      <div style={getChatHeaderUserInfoStyles()}>
        <AvatarWithStatus
          size={48}
          src={selectedChat.avatar}
          isOnline={selectedChat.isOnline}
          statusSize='large'
          style={getAvatarContainerStyles()}
        />
        <div style={getChatHeaderUserDetailsStyles()}>
          <Text strong style={getChatHeaderUserNameStyles()}>
            {selectedChat.name}
          </Text>
          <Text style={getChatHeaderUserStatusStyles()}>Active now</Text>
        </div>
      </div>
      <Space style={getChatHeaderActionsStyles()}>
        <Button
          type='text'
          icon={<PhoneOutlined />}
          style={getActionButtonStyle('primary')}
        />
        <Button
          type='text'
          icon={<VideoCameraOutlined />}
          style={getActionButtonStyle('primary')}
        />
        <Button
          type='text'
          icon={<MoreOutlined />}
          style={getActionButtonStyle('secondary')}
        />
      </Space>
    </div>
  );
};
