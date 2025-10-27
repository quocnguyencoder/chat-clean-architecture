import type { CSSProperties } from 'react';

import { theme } from '@/constants/theme';

export const layoutStyles = {
  mainContainer: {
    minHeight: '100vh',
    width: '100vw',
    background: theme.colors.background.main,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  } as CSSProperties,

  navigationSidebar: {
    background: theme.colors.background.main,
    borderRight: `1px solid ${theme.colors.border}`,
    padding: `${theme.spacing.sm}px 0`,
  } as CSSProperties,

  chatListSidebar: {
    background: theme.colors.background.secondary,
    borderRight: `1px solid ${theme.colors.border}`,
  } as CSSProperties,

  mainChatArea: {
    background: theme.colors.background.secondary,
    width: `calc(100vw - ${theme.sizes.sidebar.navigation + theme.sizes.sidebar.chatList}px)`,
    minWidth: 400,
  } as CSSProperties,
};

export const navigationStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  } as CSSProperties,

  brand: {
    color: theme.colors.text.primary,
    margin: 0,
    fontSize: 18,
  } as CSSProperties,

  navItem: {
    textAlign: 'center',
  } as CSSProperties,

  activeNavButton: {
    color: theme.colors.primary,
    background: 'rgba(0, 132, 255, 0.1)',
    border: 'none',
    width: 40,
    height: 40,
  } as CSSProperties,

  inactiveNavButton: {
    color: theme.colors.text.secondary,
    border: 'none',
    width: 40,
    height: 40,
  } as CSSProperties,

  navLabel: {
    fontSize: 10,
    marginTop: theme.spacing.xs,
  } as CSSProperties,
};

export const chatListStyles = {
  container: {
    padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
  } as CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  } as CSSProperties,

  title: {
    color: theme.colors.text.primary,
    margin: 0,
  } as CSSProperties,

  searchInput: {
    background: theme.colors.background.tertiary,
    border: 'none',
    borderRadius: theme.borderRadius.large,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  } as CSSProperties,

  storiesContainer: {
    display: 'flex',
    gap: theme.spacing.sm,
    overflowX: 'auto',
    paddingBottom: theme.spacing.sm,
  } as CSSProperties,

  storyItem: {
    textAlign: 'center',
    minWidth: 60,
  } as CSSProperties,

  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.circle,
    background: theme.colors.gradient.story,
    padding: 2,
    marginBottom: theme.spacing.xs,
  } as CSSProperties,

  chatItem: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing.md}px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    marginBottom: theme.spacing.xs,
  } as CSSProperties,

  chatItemActive: {
    background: theme.colors.background.tertiary,
  } as CSSProperties,

  chatItemInactive: {
    background: 'transparent',
  } as CSSProperties,
};

export const chatHeaderStyles = {
  container: {
    background: theme.colors.background.secondary,
    borderBottom: `1px solid ${theme.colors.border}`,
    padding: `0 ${theme.spacing.lg}px`,
    height: theme.sizes.header,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  } as CSSProperties,

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  } as CSSProperties,

  userDetails: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    maxWidth: 'calc(100% - 200px)',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,

  userName: {
    color: theme.colors.text.primary,
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  } as CSSProperties,

  userStatus: {
    color: theme.colors.success,
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  } as CSSProperties,

  actions: {
    flexShrink: 0,
  } as CSSProperties,
};

export const messagesStyles = {
  container: {
    padding: theme.spacing.lg,
    overflowY: 'auto',
    height: `calc(100vh - ${theme.sizes.header}px)`,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: `calc(100vw - ${theme.sizes.sidebar.navigation + theme.sizes.sidebar.chatList}px)`,
  } as CSSProperties,

  messageContainer: {
    display: 'flex',
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-end',
  } as CSSProperties,

  messageBubble: {
    maxWidth: '60%',
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.borderRadius.medium,
    color: theme.colors.text.primary,
    position: 'relative',
  } as CSSProperties,

  myMessage: {
    background: theme.colors.primary,
  } as CSSProperties,

  otherMessage: {
    background: theme.colors.background.tertiary,
  } as CSSProperties,

  inputContainer: {
    background: theme.colors.background.tertiary,
    borderRadius: 24,
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  } as CSSProperties,

  messageInput: {
    background: 'transparent',
    border: 'none',
    color: theme.colors.text.primary,
    flex: 1,
  } as CSSProperties,
};
