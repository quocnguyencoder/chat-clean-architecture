import type { CSSProperties } from 'react';

import { layoutStyles } from '@/ui/styles/chatStyles';

export const styles = {
  navigationSidebar: layoutStyles.navigationSidebar,
  chatListSidebar: layoutStyles.chatListSidebar,
  mainChatArea: layoutStyles.mainChatArea,
  chatHeader: {
    padding: 0,
  } as CSSProperties,
};
