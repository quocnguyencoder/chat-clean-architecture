import { BrowserRouter } from 'react-router-dom';

import { LocalStorageChatRepository } from './infrastructure/repositories';
import { LocalStorageChatParticipantsRepository } from './infrastructure/repositories/LocalStorageChatParticipantsRepository';
import { LocalStorageMessagesRepository } from './infrastructure/repositories/LocalStorageMessagesRepository';
import { ChatContent } from './ui';
import { ChatProvider } from './ui/contexts/ChatContext';

import { MainLayout } from '@/ui/layouts/MainLayout';

function App() {
  // Create repository instances
  const chatRepository = new LocalStorageChatRepository();
  const participantsRepository = new LocalStorageChatParticipantsRepository();
  const messagesRepository = new LocalStorageMessagesRepository();

  return (
    <BrowserRouter>
      <ChatProvider
        chatRepository={chatRepository}
        participantsRepository={participantsRepository}
        messagesRepository={messagesRepository}
      >
        <MainLayout>
          <ChatContent />
        </MainLayout>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
