import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { chatHeaderStyles } from '@/ui/styles/chatStyles';

export const getChatHeaderStyles = () => chatHeaderStyles.container;
export const getChatHeaderUserInfoStyles = () => chatHeaderStyles.userInfo;
export const getChatHeaderUserDetailsStyles = () =>
  chatHeaderStyles.userDetails;
export const getChatHeaderActionsStyles = () => chatHeaderStyles.actions;
export const getChatHeaderUserNameStyles = () => chatHeaderStyles.userName;
export const getChatHeaderUserStatusStyles = () => chatHeaderStyles.userStatus;

export const getActionButtonStyle = (
  variant: 'primary' | 'secondary'
): CSSProperties => ({
  color:
    variant === 'primary' ? theme.colors.primary : theme.colors.text.secondary,
  border: 'none',
});

export const getAvatarContainerStyles = (): CSSProperties => ({
  marginRight: 12,
});
