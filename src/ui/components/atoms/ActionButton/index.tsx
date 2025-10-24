import { Button } from 'antd';
import type { ReactNode } from 'react';

import { getActionButtonStyles } from './styles';

interface ActionButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  variant = 'secondary',
  disabled = false,
}) => {
  return (
    <Button
      type='text'
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      style={getActionButtonStyles(variant)}
    />
  );
};
