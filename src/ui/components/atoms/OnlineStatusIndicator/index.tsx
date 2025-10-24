import type { CSSProperties } from 'react';

import { getOnlineStatusIndicatorStyles } from './styles';

interface OnlineStatusIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  isOnline: boolean;
  style?: CSSProperties;
}

export const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
  size = 'medium',
  isOnline,
  style,
}) => {
  if (!isOnline) return null;

  return <div style={getOnlineStatusIndicatorStyles(size, style)} />;
};
