/**
 * Hook to access online users from chat context
 */

import { useChatContext } from './useChatContext';

/**
 * Custom hook to get online users
 */
export function useOnlineUsers() {
  const { onlineUsers, getOnlineUsersUseCase } = useChatContext();

  const refreshOnlineUsers = async () => {
    return await getOnlineUsersUseCase.execute();
  };

  return {
    onlineUsers,
    refreshOnlineUsers,
  };
}
