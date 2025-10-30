/**
 * Hook to access stories from chat context
 */

import { useChatContext } from './useChatContext';

/**
 * Custom hook to get stories
 */
export function useStories() {
  const { stories, getStoriesUseCase } = useChatContext();

  const refreshStories = async () => {
    return await getStoriesUseCase.execute();
  };

  const getOnlineStories = async () => {
    return await getStoriesUseCase.getOnlineStories();
  };

  return {
    stories,
    refreshStories,
    getOnlineStories,
  };
}
