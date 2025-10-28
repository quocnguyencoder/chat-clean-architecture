/**
 * Use Chat Detail Hook
 *
 * Custom hook for managing chat detail state and operations.
 * This hook encapsulates the chat detail business logic and provides
 * a clean interface to components.
 */

import { useCallback, useEffect, useState } from 'react';

import { useChatContext } from './useChatContext';
import { useMessageEvents } from './useMessageEvents';

import type { ChatDetail } from '@/domain/entities/ChatDetail';

interface UseChatDetailReturn {
  chatDetail: ChatDetail | null;
  loading: boolean;
  error: string | null;
  loadChatDetail: (chatId: string) => Promise<void>;
  refreshChatDetail: () => Promise<void>;
}

/**
 * Hook for managing chat detail state
 *
 * @returns Object containing chat detail, loading state, error state, and load/refresh functions
 */
export const useChatDetail = (): UseChatDetailReturn => {
  const { getChatDetailUseCase } = useChatContext();

  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  /**
   * Load chat detail for a specific chat
   */
  const loadChatDetail = useCallback(
    async (chatId: string) => {
      setLoading(true);
      setError(null);

      try {
        const detail = await getChatDetailUseCase.execute(chatId);
        setChatDetail(detail);
        setCurrentChatId(chatId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setChatDetail(null);
        setCurrentChatId(null);
      } finally {
        setLoading(false);
      }
    },
    [getChatDetailUseCase]
  );

  /**
   * Refresh current chat detail
   */
  const refreshChatDetail = useCallback(async () => {
    if (currentChatId) {
      await loadChatDetail(currentChatId);
    }
  }, [currentChatId, loadChatDetail]);

  // Clear state when component unmounts or chat changes
  useEffect(() => {
    return () => {
      setChatDetail(null);
      setCurrentChatId(null);
      setError(null);
    };
  }, []);

  // Listen for new messages in current chat
  useMessageEvents({
    chatId: currentChatId || undefined,
    onNewMessage: () => {
      // Refresh chat detail when a new message arrives for this chat
      void refreshChatDetail();
    },
  });

  return {
    chatDetail,
    loading,
    error,
    loadChatDetail,
    refreshChatDetail,
  };
};
