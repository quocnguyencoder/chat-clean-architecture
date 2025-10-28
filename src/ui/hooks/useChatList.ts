/**
 * Use Chat List Hook
 *
 * Custom hook for managing chat list state and operations.
 * This hook encapsulates the chat list business logic and provides
 * a clean interface to components.
 */

import { useCallback, useEffect, useState } from 'react';

import { useChatContext } from './useChatContext';

import type { Chat } from '@/domain/entities/Chat';

interface UseChatListReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  refreshChats: () => Promise<void>;
}

/**
 * Hook for managing chat list state
 *
 * @returns Object containing chats, loading state, error state, and refresh function
 */
export const useChatList = (): UseChatListReturn => {
  const { getChatListUseCase } = useChatContext();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load chats from the repository
   */
  const loadChats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const chatList = await getChatListUseCase.execute();
      setChats(chatList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getChatListUseCase]);

  /**
   * Refresh chats - public method for manual refresh
   */
  const refreshChats = useCallback(async () => {
    await loadChats();
  }, [loadChats]);

  // Load chats on mount
  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  return {
    chats,
    loading,
    error,
    refreshChats,
  };
};
