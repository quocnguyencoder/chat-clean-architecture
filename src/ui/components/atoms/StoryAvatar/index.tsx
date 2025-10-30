import { Avatar } from 'antd';

import { styles } from './styles';

import { generateUserAvatar, getDefaultAvatar } from '@/utils/avatar';

interface StoryAvatarProps {
  size?: number;
  userName?: string;
  avatarSrc?: string;
  isCurrentUser?: boolean;
  style?: React.CSSProperties;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({
  size = 52,
  userName,
  avatarSrc,
  isCurrentUser = false,
  style,
}) => {
  const getAvatarSrc = () => {
    if (avatarSrc) return avatarSrc;
    if (isCurrentUser) return getDefaultAvatar();
    if (userName) return generateUserAvatar(userName);
    return getDefaultAvatar();
  };

  return (
    <Avatar
      size={size}
      src={getAvatarSrc()}
      style={{ ...styles.avatar, ...style }}
    />
  );
};
