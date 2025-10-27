import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';
import { chatListStyles } from '@/ui/styles/chatStyles';

export const styles = {
  container: chatListStyles.container,
  header: chatListStyles.header,
  title: chatListStyles.title,
  searchInput: chatListStyles.searchInput,
  storiesContainer: chatListStyles.storiesContainer,
  storyItem: chatListStyles.storyItem,
  storyAvatar: chatListStyles.storyAvatar,
  chatItem: {
    base: chatListStyles.chatItem,
    active: {
      ...chatListStyles.chatItem,
      ...chatListStyles.chatItemActive,
    } as CSSProperties,
    inactive: {
      ...chatListStyles.chatItem,
      ...chatListStyles.chatItemInactive,
    } as CSSProperties,
  },
  addButton: {
    color: theme.colors.text.secondary,
    border: 'none',
  } as CSSProperties,
  searchIcon: {
    color: theme.colors.text.secondary,
  } as CSSProperties,
  storyAvatarStyles: {
    border: `2px solid ${theme.colors.background.secondary}`,
  } as CSSProperties,
  storyAvatarContainer: {
    ...chatListStyles.storyAvatar,
    position: 'relative',
  } as CSSProperties,
  storyText: {
    color: theme.colors.text.primary,
    fontSize: 12,
  } as CSSProperties,
  divider: {
    borderColor: theme.colors.border,
    margin: '0px 0px 16px 0px',
  } as CSSProperties,
  chatListScroll: {
    maxHeight: 'calc(100vh - 280px)',
    overflowY: 'auto',
  } as CSSProperties,
  chatInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as CSSProperties,
  chatName: {
    color: theme.colors.text.primary,
    fontSize: 14,
  } as CSSProperties,
  chatTime: {
    color: theme.colors.text.secondary,
    fontSize: 12,
  } as CSSProperties,
  chatMessage: {
    base: {
      fontSize: 13,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '180px',
    } as CSSProperties,
    unread: {
      color: theme.colors.text.primary,
    } as CSSProperties,
    read: {
      color: theme.colors.text.secondary,
    } as CSSProperties,
  },
  chatBadge: {
    background: theme.colors.primary,
    minWidth: theme.sizes.badge.minWidth,
    height: theme.sizes.badge.height,
    borderRadius: 10,
    fontSize: 11,
  } as CSSProperties,
  chatContent: {
    flex: 1,
    minWidth: 0,
  } as CSSProperties,
  avatarContainer: {
    marginRight: 12,
  } as CSSProperties,
  storiesSection: {
    marginBottom: 16,
  } as CSSProperties,
};
