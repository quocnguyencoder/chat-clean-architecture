import { LocalStorageChatRepository } from './infrastructure/repositories';
import { ChatContent } from './ui';
import { ChatProvider } from './ui/contexts/ChatContext';

import { MainLayout } from '@/ui/layouts/MainLayout';

function App() {
  // Create repository instance
  const chatRepository = new LocalStorageChatRepository();

  return (
    <ChatProvider chatRepository={chatRepository}>
      <MainLayout>
        <ChatContent />
      </MainLayout>
    </ChatProvider>
  );
}

export default App;
