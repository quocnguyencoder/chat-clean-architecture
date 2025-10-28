# Message Handling Implementation

## Overview

This implementation adds comprehensive message handling capabilities to the chat application, including:

1. **Real-time Message Reception** - Handle incoming messages via postMessage API and transport workers
2. **Virtual Scrolling** - Efficiently display large message lists (1000+ messages)
3. **URL-based Navigation** - Navigate to specific messages using URL parameters
4. **Automatic UI Updates** - Chat list and message area update when new messages arrive

## Features Implemented

### 1. Message Use Cases

#### SendMessageUseCase

Handles sending new messages with proper validation and entity creation.

**Usage:**

```typescript
const { sendMessageUseCase } = useChatContext();

await sendMessageUseCase.execute(
  'chat-id',
  'Hello world!',
  'user-123',
  'John Doe'
);
```

#### ReceiveMessageUseCase

Processes incoming messages from external sources (postMessage, workers, etc.).

**Usage:**

```typescript
const { receiveMessageUseCase } = useChatContext();

await receiveMessageUseCase.execute({
  chatId: '1',
  messageId: 'msg-123',
  text: 'New message',
  senderId: 'user-456',
  senderName: 'Jane Smith',
  time: '2:30 PM',
  isFromMe: false,
});
```

### 2. Message Event Service

A service that listens for incoming messages from multiple sources.

**Sending Messages via postMessage:**

```javascript
// From an iframe or external window
window.parent.postMessage(
  {
    chatId: '1',
    messageId: 'msg-' + Date.now(),
    text: 'Hello from iframe!',
    senderId: 'external-user',
    senderName: 'External User',
    time: new Date().toLocaleTimeString(),
    isFromMe: false,
  },
  '*'
);
```

**Programmatic Message Sending (for testing):**

```typescript
import { messageEventService } from '@/infrastructure/services';

messageEventService.emit({
  chatId: '1',
  messageId: 'msg-test-123',
  text: 'Test message',
  senderId: 'test-user',
  senderName: 'Test User',
  time: '3:45 PM',
  isFromMe: false,
});
```

### 3. Virtual Scrolling for Large Message Lists

The `VirtualizedMessageList` component automatically activates when a chat has 100+ messages.

**Features:**

- Only renders visible messages (performance optimization)
- Smooth scrolling
- Automatic height calculation
- Supports message highlighting

**Configuration:**

```typescript
// In MessagesArea/index.tsx
const VIRTUALIZATION_THRESHOLD = 100; // Adjust as needed
```

### 4. URL-based Message Navigation

Navigate to specific messages using URL parameters.

**URL Format:**

```
http://localhost:5173/?chatId=1&messageId=msg-123
```

**Programmatic Navigation:**

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to specific message
navigate(`?chatId=1&messageId=msg-123`);

// Navigate to chat (without specific message)
navigate(`?chatId=1`);
```

### 5. Real-time UI Updates

The chat list and message area automatically update when new messages arrive.

**How it works:**

1. MessageEventService receives incoming message
2. ReceiveMessageUseCase processes and stores the message
3. Custom event `chat:newMessage` is dispatched
4. Components listening via `useMessageEvents` hook refresh their data

## Testing the Implementation

### Test 1: Send Message via postMessage

Open browser console and run:

```javascript
window.postMessage(
  {
    chatId: '1',
    messageId: 'msg-test-' + Date.now(),
    text: 'Test message from console!',
    senderId: 'console-user',
    senderName: 'Console User',
    time: new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    isFromMe: false,
  },
  '*'
);
```

You should see:

- The message appears in the chat
- The chat list updates with the new last message

### Test 2: Navigate to Specific Message

1. Open browser console
2. Note a message ID from the chat (inspect element)
3. Update URL: `?chatId=1&messageId=<message-id>`
4. The message should be highlighted and scrolled into view

### Test 3: Large Message List

To test virtual scrolling with 1000+ messages:

```typescript
// Create test messages in LocalStorageMessagesRepository
const testMessages = Array.from({ length: 1000 }, (_, i) => ({
  id: `msg-${i}`,
  text: `Test message ${i}`,
  senderId: i % 2 === 0 ? 'user-1' : 'me',
  senderName: i % 2 === 0 ? 'Other User' : 'Me',
  time: '12:00 PM',
  isFromMe: i % 2 === 1,
}));
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    External Sources                     │
│         (postMessage, Workers, WebSocket)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ MessageEventService   │
         │  - Listens for events │
         │  - Validates messages │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ ReceiveMessageUseCase │
         │  - Business logic     │
         │  - Message validation │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  MessagesRepository   │
         │  - Persistence        │
         │  - Pagination support │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Custom Event        │
         │  'chat:newMessage'    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  useMessageEvents     │
         │  - Hook for listening │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌───────────────┐         ┌───────────────┐
│   ChatList    │         │ MessagesArea  │
│  - Refreshes  │         │  - Refreshes  │
│  - Shows last │         │  - Shows new  │
│    message    │         │    messages   │
└───────────────┘         └───────────────┘
```

## API Reference

### Hooks

#### `useMessageEvents(options)`

Hook for listening to incoming messages.

**Parameters:**

- `options.onNewMessage`: Callback function called when new message arrives
- `options.chatId`: Optional - only listen for messages in specific chat

**Returns:**

- `lastMessage`: The most recent message received

#### `useChatContext()`

Access chat-related use cases and repositories.

**Returns:**

- `sendMessageUseCase`: Use case for sending messages
- `receiveMessageUseCase`: Use case for receiving messages
- `getChatListUseCase`: Use case for getting chat list
- `getChatDetailUseCase`: Use case for getting chat details
- Plus repositories

### Components

#### `VirtualizedMessageList`

Efficiently renders large message lists.

**Props:**

- `messages`: Array of Message entities
- `width`: Container width (pixels)
- `height`: Container height (pixels)
- `scrollToMessageId`: Optional message ID to scroll to
- `onScrollToComplete`: Callback when scroll completes

#### `MessagesArea`

Main message display area with auto-switching to virtual list.

**Props:**

- `messageText`: Current input text
- `onMessageChange`: Input change handler
- `onSendMessage`: Send button handler
- `chatDetail`: Chat detail entity
- `detailLoading`: Loading state
- `scrollToMessageId`: Optional message ID to scroll to
- `onScrollToComplete`: Callback when scroll completes

## Performance Considerations

1. **Virtual Scrolling**: Activates at 100+ messages
2. **Message Pagination**: Repository supports pagination (currently loads all for simplicity)
3. **Event Debouncing**: Consider debouncing rapid message events if needed
4. **Memory Management**: Old messages can be unloaded when scrolled out of view

## Future Enhancements

1. **Infinite Scroll**: Load older messages on scroll
2. **Message Search**: Search within large message lists
3. **Read Receipts**: Track which messages have been read
4. **Typing Indicators**: Show when other users are typing
5. **Message Reactions**: Add emoji reactions to messages
6. **Worker Integration**: Complete transport worker implementation
7. **WebSocket Support**: Real-time bidirectional communication

## Troubleshooting

### Messages not appearing

- Check browser console for errors
- Verify message format matches `IncomingMessageData` interface
- Ensure MessageEventService is started (automatic in ChatProvider)

### Virtual scrolling not working

- Check message count (needs 100+ messages)
- Verify container has valid dimensions
- Check browser console for errors

### URL navigation not working

- Ensure BrowserRouter is wrapping the app
- Check that messageId exists in the chat
- Verify URL format: `?chatId=X&messageId=Y`

## Dependencies

- `react-window`: Virtual scrolling library
- `react-router-dom`: URL routing and navigation
- `antd`: UI components
