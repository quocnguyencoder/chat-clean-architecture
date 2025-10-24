import { Badge, Button } from 'antd';
import type { ReactNode } from 'react';

import { styles } from './styles';

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
      style={isActive ? styles.button.active : styles.button.inactive}
    />
  );

  return (
    <div style={styles.container}>
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
      <div style={isActive ? styles.label.active : styles.label.inactive}>
        {label}
      </div>
    </div>
  );
};
