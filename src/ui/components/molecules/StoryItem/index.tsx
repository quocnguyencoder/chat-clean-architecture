import { Typography } from 'antd';

import { OnlineStatusIndicator } from '../../atoms/OnlineStatusIndicator';
import { StoryAvatar } from '../../atoms/StoryAvatar';

import { styles } from './styles';

const { Text } = Typography;

interface StoryItemProps {
  userName?: string;
  avatarSrc?: string;
  isCurrentUser?: boolean;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  displayText?: string;
}

export const StoryItem: React.FC<StoryItemProps> = ({
  userName,
  avatarSrc,
  isCurrentUser = false,
  showOnlineStatus = false,
  isOnline = true,
  displayText,
}) => {
  const text =
    displayText || (isCurrentUser ? 'Your note' : userName || 'User');

  return (
    <div style={styles.container}>
      <div style={styles.avatarContainer}>
        <StoryAvatar
          userName={userName}
          avatarSrc={avatarSrc}
          isCurrentUser={isCurrentUser}
          style={styles.avatar}
        />
        {showOnlineStatus && (
          <OnlineStatusIndicator isOnline={isOnline} size='large' />
        )}
      </div>
      <Text style={styles.text}>{text}</Text>
    </div>
  );
};
