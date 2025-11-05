/**
 * Transport Worker
 *
 * Web Worker for handling message transport via WebSocket.
 * Runs in a separate thread to avoid blocking the main UI.
 * Supports:
 * - WebSocket connections
 * - Automatic reconnection with exponential backoff
 * - Message validation and error handling
 * - Authentication
 * - Presence and typing indicators
 */

// Worker state
let ws = null;
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;
let wsUrl = '';
let authToken = '';

/**
 * Handle messages from main thread
 */
self.onmessage = function (event) {
  const { type, payload } = event.data;

  switch (type) {
    case 'INIT':
      initializeConnection(payload);
      break;

    case 'SEND_MESSAGE':
      sendMessage(payload);
      break;

    case 'DISCONNECT':
      disconnect();
      break;

    case 'PING':
      // Respond to health check
      self.postMessage({ type: 'PONG' });
      break;

    default:
      // Unknown message type - ignore silently
      break;
  }
};

/**
 * Initialize WebSocket connection
 */
function initializeConnection(config) {
  wsUrl = config.url || '';
  authToken = config.authToken || '';

  // If no URL provided, run in demo mode
  if (!wsUrl) {
    if (config.enableDemo) {
      startDemoMode();
    }
    return;
  }

  try {
    // Create WebSocket connection
    ws = new WebSocket(wsUrl);

    // Connection opened
    ws.onopen = function () {
      isConnected = true;
      reconnectAttempts = 0;

      self.postMessage({
        type: 'CONNECTION_STATUS',
        payload: {
          connected: true,
          timestamp: new Date().toISOString(),
        },
      });

      // Send authentication if token provided
      if (authToken) {
        ws.send(
          JSON.stringify({
            type: 'AUTH',
            token: authToken,
          })
        );
      }
    };

    // Message received from server
    ws.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);

        // Handle different message types from server
        switch (data.type) {
          case 'MESSAGE':
            handleIncomingMessage(data.payload);
            break;

          case 'AUTH_SUCCESS':
            // Authentication successful
            break;

          case 'AUTH_FAILED':
            handleError({
              message: 'Authentication failed',
              code: 'AUTH_FAILED',
            });
            break;

          case 'TYPING':
            // Forward typing indicators
            self.postMessage({
              type: 'TYPING_INDICATOR',
              payload: data.payload,
            });
            break;

          case 'PRESENCE':
            // Forward presence updates
            self.postMessage({
              type: 'PRESENCE_UPDATE',
              payload: data.payload,
            });
            break;

          case 'READ_RECEIPT':
            // Forward read receipts
            self.postMessage({
              type: 'READ_RECEIPT',
              payload: data.payload,
            });
            break;

          default:
            // Unknown message type - ignore
            break;
        }
      } catch {
        // Failed to parse message - ignore
      }
    };

    // Connection error
    ws.onerror = function () {
      handleError({ message: 'WebSocket error', code: 'WS_ERROR' });
    };

    // Connection closed
    ws.onclose = function (event) {
      isConnected = false;
      ws = null;

      self.postMessage({
        type: 'CONNECTION_STATUS',
        payload: {
          connected: false,
          timestamp: new Date().toISOString(),
          code: event.code,
          reason: event.reason,
        },
      });

      // Attempt to reconnect if not a clean close
      if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        attemptReconnect();
      }
    };
  } catch (error) {
    handleError(error);
  }
}

/**
 * Send message through WebSocket
 */
function sendMessage(messageData) {
  if (!isConnected || !ws || ws.readyState !== WebSocket.OPEN) {
    self.postMessage({
      type: 'ERROR',
      payload: {
        message: 'WebSocket not connected',
        code: 'NOT_CONNECTED',
      },
    });
    return;
  }

  try {
    // Send message to server
    ws.send(
      JSON.stringify({
        type: 'MESSAGE',
        payload: messageData,
      })
    );

    // Acknowledge message sent
    self.postMessage({
      type: 'MESSAGE_SENT',
      payload: {
        messageId: messageData.messageId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    handleError(error);
  }
}

/**
 * Handle incoming messages from transport layer
 */
function handleIncomingMessage(messageData) {
  // Validate message structure
  if (!isValidMessage(messageData)) {
    // Invalid message - ignore silently
    return;
  }

  // Forward to main thread
  self.postMessage({
    type: 'INCOMING_MESSAGE',
    payload: messageData,
  });
}

/**
 * Validate message structure
 */
function isValidMessage(data) {
  return (
    data &&
    typeof data === 'object' &&
    data.chatId &&
    data.messageId &&
    data.text &&
    data.senderId &&
    data.senderName &&
    data.time
  );
}

/**
 * Attempt to reconnect
 */
function attemptReconnect() {
  reconnectAttempts++;

  self.postMessage({
    type: 'RECONNECTING',
    payload: {
      attempt: reconnectAttempts,
      maxAttempts: MAX_RECONNECT_ATTEMPTS,
    },
  });

  const delay = RECONNECT_DELAY * reconnectAttempts;

  setTimeout(() => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      initializeConnection({ url: wsUrl, authToken: authToken });
    } else {
      self.postMessage({
        type: 'CONNECTION_FAILED',
        payload: {
          message: 'Max reconnection attempts reached',
          attempts: reconnectAttempts,
        },
      });
    }
  }, delay);
}

/**
 * Handle connection errors
 */
function handleError(error) {
  self.postMessage({
    type: 'ERROR',
    payload: {
      message: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN_ERROR',
    },
  });
}

/**
 * Disconnect from WebSocket
 */
function disconnect() {
  if (ws) {
    // Close with normal closure code
    ws.close(1000, 'Client disconnecting');
    ws = null;
  }

  isConnected = false;
  reconnectAttempts = 0;

  self.postMessage({
    type: 'CONNECTION_STATUS',
    payload: {
      connected: false,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Demo mode - simulates messages without server
 */
function startDemoMode() {
  isConnected = true;
  reconnectAttempts = 0;

  self.postMessage({
    type: 'CONNECTION_STATUS',
    payload: {
      connected: true,
      timestamp: new Date().toISOString(),
      demo: true,
    },
  });

  // Simulate receiving a message every 30 seconds
  setInterval(() => {
    if (!isConnected) return;

    const demoMessage = {
      chatId: 'demo-chat-' + Math.random().toString(36).substr(2, 9),
      messageId: 'msg-' + Date.now(),
      text: 'Demo message from worker',
      senderId: 'worker-bot',
      senderName: 'Worker Bot',
      time: new Date().toISOString(),
    };

    handleIncomingMessage(demoMessage);
  }, 30000);
}
