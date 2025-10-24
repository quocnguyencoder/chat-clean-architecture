import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { chatListStyles } from '@/ui/styles/chatStyles';

export const getChatListContainerStyles = () => chatListStyles.container;
export const getChatListHeaderStyles = () => chatListStyles.header;
export const getChatListTitleStyles = () => chatListStyles.title;
export const getChatListSearchInputStyles = () => chatListStyles.searchInput;
export const getChatListStoriesContainerStyles = () =>
  chatListStyles.storiesContainer;
export const getChatListStoryItemStyles = () => chatListStyles.storyItem;
export const getChatListStoryAvatarStyles = () => chatListStyles.storyAvatar;
export const getChatListChatItemStyles = () => chatListStyles.chatItem;
export const getChatListChatItemActiveStyles = () =>
  chatListStyles.chatItemActive;
export const getChatListChatItemInactiveStyles = () =>
  chatListStyles.chatItemInactive;

export const getAddButtonStyles = (): CSSProperties => ({
  color: theme.colors.text.secondary,
  border: 'none',
});

export const getSearchIconStyles = (): CSSProperties => ({
  color: theme.colors.text.secondary,
});

export const getStoryAvatarStyles = (): CSSProperties => ({
  border: `2px solid ${theme.colors.background.secondary}`,
});

export const getStoryAvatarContainerStyles = (): CSSProperties => ({
  ...chatListStyles.storyAvatar,
  position: 'relative',
});

export const getStoryTextStyles = (): CSSProperties => ({
  color: theme.colors.text.primary,
  fontSize: 12,
});

export const getDividerStyles = (): CSSProperties => ({
  borderColor: theme.colors.border,
  margin: '16px 0',
});

export const getChatListScrollStyles = (): CSSProperties => ({
  maxHeight: 'calc(100vh - 280px)',
  overflowY: 'auto',
});

export const getChatItemContainerStyles = (
  isActive: boolean
): CSSProperties => ({
  ...chatListStyles.chatItem,
  ...(isActive
    ? chatListStyles.chatItemActive
    : chatListStyles.chatItemInactive),
});

export const getChatInfoRowStyles = (): CSSProperties => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const getChatNameStyles = (): CSSProperties => ({
  color: theme.colors.text.primary,
  fontSize: 14,
});

export const getChatTimeStyles = (): CSSProperties => ({
  color: theme.colors.text.secondary,
  fontSize: 12,
});

export const getChatMessageStyles = (hasUnread: boolean): CSSProperties => ({
  color: hasUnread ? theme.colors.text.primary : theme.colors.text.secondary,
  fontSize: 13,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '180px',
});

export const getChatBadgeStyles = (): CSSProperties => ({
  background: theme.colors.primary,
  minWidth: theme.sizes.badge.minWidth,
  height: theme.sizes.badge.height,
  borderRadius: 10,
  fontSize: 11,
});

export const getChatContentStyles = (): CSSProperties => ({
  flex: 1,
  minWidth: 0,
});

export const getAvatarContainerStyles = (): CSSProperties => ({
  marginRight: 12,
});

export const getStoriesSectionStyles = (): CSSProperties => ({
  marginBottom: 16,
});
