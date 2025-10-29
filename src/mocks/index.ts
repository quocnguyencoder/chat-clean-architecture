/**
 * Mocks Index
 *
 * Barrel exports for all mock data
 */

export { mockChatsData } from './chats';
export {
  DEMO_AUTO_MESSAGES,
  DEMO_GROUP_MEMBERS,
  DEMO_RESPONSES,
  getRandomAutoMessage,
  getRandomGroupMember,
  getRandomResponse,
} from './demoMessages';
export {
  GROUPS,
  getGroupById,
  getGroupByName,
  getGroupMemberIds,
  getGroupMembers,
  getGroupsByMemberId,
  getRandomGroup,
  isGroupMember,
  type Group,
} from './groups';
export { mockMessagesData } from './messages';
export { mockParticipantsData } from './participants';
export {
  ALL_USERS,
  CURRENT_USER,
  OTHER_USERS,
  getOnlineUsers,
  getRandomOtherUser,
  getUserById,
  getUserByName,
  type User,
} from './users';
export { generateInitialUserStatuses, mockUserStatuses } from './userStatuses';
