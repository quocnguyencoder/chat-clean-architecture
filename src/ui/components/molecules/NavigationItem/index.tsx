import { Badge, Button } from 'antd';
import type { ReactNode } from 'react';

import {
  getNavigationButtonStyles,
  getNavigationItemStyles,
  getNavigationLabelStyles,
} from './styles';

interface NavigationItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number | boolean;
  badgeType?: 'count' | 'dot';
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  icon,
  label,
  isActive = false,
  badge,
  badgeType = 'count',
}) => {
  const ButtonComponent = (
    <Button
      type='text'
      icon={icon}
      style={getNavigationButtonStyles(isActive)}
    />
  );

  return (
    <div style={getNavigationItemStyles()}>
      {badge ? (
        <Badge
          count={badgeType === 'count' ? badge : undefined}
          dot={badgeType === 'dot'}
          size='small'
        >
          {ButtonComponent}
        </Badge>
      ) : (
        ButtonComponent
      )}
      <div style={getNavigationLabelStyles(isActive)}>{label}</div>
    </div>
  );
};
