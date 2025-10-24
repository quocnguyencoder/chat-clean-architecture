import type { CSSProperties } from 'react';

import { layoutStyles } from '@/ui/styles/chatStyles';

export const getNavigationSidebarStyles = () => layoutStyles.navigationSidebar;
export const getChatListSidebarStyles = () => layoutStyles.chatListSidebar;
export const getMainChatAreaStyles = () => layoutStyles.mainChatArea;

export const getChatHeaderStyles = (): CSSProperties => ({
  padding: 0,
});
