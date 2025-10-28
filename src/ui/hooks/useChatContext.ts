/**
 * Use Chat Context Hook
 *
 * Hook to access chat context services and use cases.
 */

import { useContext } from 'react';

import { ChatContext, type ChatContextValue } from '../contexts/ChatContext';

/**
 * Hook to access chat context
 *
 * @returns Chat context value containing services and use cases
 * @throws Error if used outside ChatProvider
 */
export const useChatContext = (): ChatContextValue => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }

  return context;
};
