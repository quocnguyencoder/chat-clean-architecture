import { BrowserRouter } from 'react-router-dom';

import { LocalStorageChatRepository } from './infrastructure/repositories';
import { LocalStorageChatParticipantsRepository } from './infrastructure/repositories/LocalStorageChatParticipantsRepository';
import { LocalStorageMessagesRepository } from './infrastructure/repositories/LocalStorageMessagesRepository';
import { LocalStorageUserStatusRepository } from './infrastructure/repositories/LocalStorageUserStatusRepository';
import { ChatContent } from './ui';
import { ChatProvider } from './ui/contexts/ChatContext';

import { MainLayout } from '@/ui/layouts/MainLayout';
import { initializeUserStatusData } from '@/utils/initializeUserStatus';

function App() {
  // Create repository instances
  const chatRepository = new LocalStorageChatRepository();
  const participantsRepository = new LocalStorageChatParticipantsRepository();
  const messagesRepository = new LocalStorageMessagesRepository();
  const userStatusRepository = new LocalStorageUserStatusRepository();

  // Initialize user status data
  void initializeUserStatusData(userStatusRepository);

  return (
    <BrowserRouter>
      <ChatProvider
        chatRepository={chatRepository}
        participantsRepository={participantsRepository}
        messagesRepository={messagesRepository}
        userStatusRepository={userStatusRepository}
      >
        <MainLayout>
          <ChatContent />
        </MainLayout>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
