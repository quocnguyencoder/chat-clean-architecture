# Transport Worker Setup

## Overview

The Transport Worker is a production-ready Web Worker that handles real-time message transport via WebSocket. It runs in a separate thread to prevent UI blocking and includes automatic reconnection, authentication support, and comprehensive error handling.

## Features

✅ **WebSocket Connection**: Real-time bidirectional communication
✅ **Auto-Reconnection**: Exponential backoff with configurable retry attempts
✅ **Authentication**: Built-in token-based authentication support
✅ **Message Validation**: Validates all incoming messages
✅ **Error Handling**: Comprehensive error handling and reporting
✅ **Demo Mode**: Test without a server (optional)
✅ **Typing Indicators**: Forward typing status updates
✅ **Presence Updates**: Handle user online/offline status
✅ **Read Receipts**: Track message read status

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│  UI Components  │ ◄────── │ MessageEventService│ ◄────── │   Worker    │
│                 │         │                  │         │             │
│  - ChatList     │         │  - postMessage   │         │ - WebSocket │
│  - MessageInput │         │  - Worker mgmt   │         │ - Auth      │
│  - ChatDetail   │         │  - Event routing │         │ - Reconnect │
└─────────────────┘         └──────────────────┘         └─────────────┘
                                                                  │
                                                                  ▼
                                                          ┌──────────────┐
                                                          │ WebSocket    │
                                                          │ Server       │
                                                          └──────────────┘
```

## Files

### 1. Transport Worker (`public/transport-worker.js`)

**Location:** `/public/transport-worker.js`

**Purpose:**

- Runs in separate thread
- Handles network connections
- Processes incoming/outgoing messages
- Manages reconnection logic

**Message Types (Worker → Main Thread):**

- `INCOMING_MESSAGE` - New message received
- `CONNECTION_STATUS` - Connection state changed
- `ERROR` - Error occurred
- `RECONNECTING` - Attempting to reconnect
- `CONNECTION_FAILED` - All reconnect attempts failed
- `MESSAGE_SENT` - Message successfully sent
- `PONG` - Health check response

**Message Types (Main Thread → Worker):**

- `INIT` - Initialize with configuration
- `SEND_MESSAGE` - Send a message
- `DISCONNECT` - Close connection
- `PING` - Health check

### 2. MessageEventService (`src/infrastructure/services/MessageEventService.ts`)

**Purpose:**

- Manages worker lifecycle
- Routes messages between worker and application
- Provides unified interface for message handling
- Fallback to postMessage API if worker fails

## Usage

### 1. Environment Configuration

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:

```env
# WebSocket server URL
VITE_WEBSOCKET_URL=wss://your-server.com/ws

# Optional: Authentication token
VITE_AUTH_TOKEN=your-auth-token-here

# Set to true for demo mode (no server needed)
VITE_ENABLE_DEMO=false
```

### 2. Basic Setup (Demo Mode - No Server)

```typescript
import { messageEventService } from '@/infrastructure/services';

// Start in demo mode
messageEventService.startListening({
  enableDemo: true,
});
// Receives simulated messages every 30 seconds
```

### 3. Production Setup (With WebSocket Server)

```typescript
import { messageEventService } from '@/infrastructure/services';

// Connect to real WebSocket server
messageEventService.startListening({
  url: import.meta.env.VITE_WEBSOCKET_URL,
  authToken: import.meta.env.VITE_AUTH_TOKEN, // Optional
});
```

### 4. In ChatContext

```typescript
useEffect(() => {
  // Start listening for incoming messages
  messageEventService.startListening({
    url: import.meta.env.VITE_WEBSOCKET_URL,
    authToken: import.meta.env.VITE_AUTH_TOKEN,
    enableDemo: import.meta.env.VITE_ENABLE_DEMO === 'true',
  });

  // Subscribe to message events
  const unsubscribe = messageEventService.subscribe(async messageData => {
    try {
      await receiveMessageUseCase.execute(messageData);
      window.dispatchEvent(
        new CustomEvent('chat:newMessage', { detail: messageData })
      );
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  });

  return () => {
    unsubscribe();
    messageEventService.stopListening();
  };
}, []);
```

### 5. Send Messages Through Worker

```typescript
messageEventService.sendThroughWorker({
  chatId: 'chat-123',
  messageId: 'msg-456',
  text: 'Hello!',
  senderId: 'user-1',
  senderName: 'John Doe',
  time: new Date().toISOString(),
});
```

## WebSocket Integration Example

To integrate with a real WebSocket server, modify `public/transport-worker.js`:

````javascript
## WebSocket Server Requirements

Your WebSocket server should handle these message types from the client:

### Client → Server Messages

```json
{
  "type": "AUTH",
  "token": "user-auth-token"
}

{
  "type": "MESSAGE",
  "payload": {
    "chatId": "chat-123",
    "messageId": "msg-456",
    "text": "Hello!",
    "senderId": "user-1",
    "senderName": "John Doe",
    "time": "2025-11-04T12:00:00.000Z"
  }
}
````

### Server → Client Messages

```json
{
  "type": "MESSAGE",
  "payload": {
    "chatId": "chat-123",
    "messageId": "msg-789",
    "text": "Hi there!",
    "senderId": "user-2",
    "senderName": "Jane Smith",
    "time": "2025-11-04T12:00:01.000Z"
  }
}

{
  "type": "AUTH_SUCCESS"
}

{
  "type": "AUTH_FAILED"
}

{
  "type": "TYPING",
  "payload": {
    "chatId": "chat-123",
    "userId": "user-2",
    "isTyping": true
  }
}

{
  "type": "PRESENCE",
  "payload": {
    "userId": "user-2",
    "status": "online"
  }
}

{
  "type": "READ_RECEIPT",
  "payload": {
    "chatId": "chat-123",
    "messageId": "msg-456",
    "userId": "user-2",
    "readAt": "2025-11-04T12:00:02.000Z"
  }
}
```

````

## SSE (Server-Sent Events) Integration Example

```javascript
let eventSource = null;

function initializeConnection(config) {
  eventSource = new EventSource(config.url);

  eventSource.onopen = () => {
    isConnected = true;
    self.postMessage({
      type: 'CONNECTION_STATUS',
      payload: { connected: true, timestamp: new Date().toISOString() },
    });
  };

  eventSource.onmessage = event => {
    const messageData = JSON.parse(event.data);
    handleIncomingMessage(messageData);
  };

  eventSource.onerror = error => {
    handleError(error);
  };
}

function disconnect() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  isConnected = false;
}
````

## Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```env
# WebSocket server URL (leave empty for demo mode)
VITE_WEBSOCKET_URL=wss://your-server.com/ws

# Authentication token (optional)
VITE_AUTH_TOKEN=your-auth-token

# Enable demo mode (true/false)
VITE_ENABLE_DEMO=false
```

### Worker Config Interface

```typescript
interface WorkerConfig {
  url?: string; // WebSocket URL (if empty, uses demo mode)
  authToken?: string; // Authentication token
  enableDemo?: boolean; // Enable demo message simulation
}
```

### Connection Settings (in worker)

```javascript
const MAX_RECONNECT_ATTEMPTS = 5; // Maximum reconnection attempts
const RECONNECT_DELAY = 2000; // Base delay in ms (exponential backoff)
```

## Error Handling

The worker implements automatic reconnection with exponential backoff:

1. Initial connection attempt
2. On failure, wait `RECONNECT_DELAY * attempt` milliseconds
3. Retry up to `MAX_RECONNECT_ATTEMPTS` times
4. If all attempts fail, emit `CONNECTION_FAILED` event

## Health Check

Periodically ping the worker to ensure it's responsive:

```typescript
// Ping every 30 seconds
setInterval(() => {
  messageEventService.pingWorker();
}, 30000);
```

## Testing

### Enable Demo Mode

```typescript
messageEventService.startListening({
  enableDemo: true, // Simulates messages every 30 seconds
});
```

### Manual Message Injection

```typescript
messageEventService.emit({
  chatId: 'test-chat',
  messageId: 'test-msg-1',
  text: 'Test message',
  senderId: 'test-user',
  senderName: 'Test User',
  time: new Date().toISOString(),
});
```

## Browser Compatibility

Web Workers are supported in all modern browsers:

- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge 12+
- Opera 10.6+

## Performance Benefits

1. **Non-blocking**: Network operations don't block UI thread
2. **Parallel processing**: Message handling runs in parallel
3. **Resource isolation**: Worker failures don't crash main thread
4. **Better UX**: Smoother animations and interactions

## Security Considerations

1. **Origin validation**: Always validate `event.origin` for postMessage
2. **Message validation**: Validate all incoming message structures
3. **Secure WebSocket**: Use `wss://` (not `ws://`) in production
4. **Authentication**: Include auth tokens in WebSocket handshake
5. **Rate limiting**: Implement message rate limiting

## Troubleshooting

### Worker not loading

- Check that `public/transport-worker.js` exists
- Verify file is served at `/transport-worker.js`
- Check browser console for CORS errors

### Messages not received

- Verify worker is initialized (`messageEventService.isActive()`)
- Check listener count (`messageEventService.getListenerCount()`)
- Enable demo mode to test worker functionality
- Check browser console for errors

### Connection failures

- Verify WebSocket URL is correct
- Check network tab for connection attempts
- Ensure server is running and accessible
- Review firewall/proxy settings

## Migration from Mock to Real Transport

1. ✅ **Worker Implementation**: Already complete with WebSocket support
2. **Set up your WebSocket server** following the message format above
3. **Configure environment variables** in `.env` file
4. **Update ChatContext** to use environment variables:
   ```typescript
   messageEventService.startListening({
     url: import.meta.env.VITE_WEBSOCKET_URL,
     authToken: import.meta.env.VITE_AUTH_TOKEN,
   });
   ```
5. **Test connection** in browser DevTools
6. **Monitor** connection status and errors
7. **Disable demo mode** once real server is working

## Testing Checklist

- [ ] Worker loads successfully
- [ ] Can connect to WebSocket server (or demo mode works)
- [ ] Can send messages through worker
- [ ] Can receive messages from server
- [ ] Reconnection works after disconnect
- [ ] Authentication works (if implemented)
- [ ] Error handling works properly
- [ ] Clean disconnection on app close

## Future Enhancements

- [ ] Implement message queue for offline support
- [ ] Add message acknowledgment system
- [ ] Support multiple concurrent connections
- [ ] Add message encryption/decryption
- [ ] Implement presence detection
- [ ] Add typing indicators
- [ ] Support file transfer through worker
