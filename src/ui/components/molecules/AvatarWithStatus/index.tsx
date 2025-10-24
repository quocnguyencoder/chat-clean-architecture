import { Avatar as AntdAvatar } from 'antd';
import type { CSSProperties } from 'react';

import { OnlineStatusIndicator } from '../../atoms/OnlineStatusIndicator';

import { styles } from './styles';

interface AvatarWithStatusProps {
  src: string;
  size: number;
  isOnline?: boolean;
  statusSize?: 'small' | 'medium' | 'large';
  style?: CSSProperties;
  alt?: string;
}

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
  src,
  size,
  isOnline = false,
  statusSize = 'medium',
  style,
  alt,
}) => {
  return (
    <div style={{ ...styles.container, ...style }}>
      <AntdAvatar size={size} src={src} alt={alt} />
      <OnlineStatusIndicator isOnline={isOnline} size={statusSize} />
    </div>
  );
};
