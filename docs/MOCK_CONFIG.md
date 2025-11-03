# Mock Service Configuration

The mock service configuration is centralized in `src/config/mockConfig.ts`.

## Configuration Options

### Response Timing

```typescript
mockConfig.response.minDelay; // Minimum delay before response (default: 1000ms)
mockConfig.response.maxDelay; // Maximum delay before response (default: 2000ms)
```

### Auto-Send Settings

```typescript
mockConfig.autoSend.interval; // Interval between auto-messages (default: 10000ms)
mockConfig.autoSend.enabled; // Enable/disable auto-send (default: true)
```

### Behavior Settings

```typescript
mockConfig.behavior.startPaused; // Start service in paused state (default: false)
mockConfig.behavior.enableLogging; // Enable console logging (default: true)
```

## Usage Examples

### Adjust Response Timing

To make responses faster (500ms - 1000ms):

```typescript
// In src/config/mockConfig.ts
response: {
  minDelay: 500,
  maxDelay: 1000,
}
```

### Disable Auto-Send Messages

```typescript
// In src/config/mockConfig.ts
autoSend: {
  interval: 10000,
  enabled: false,  // Disable auto-sending
}
```

### Change Auto-Send Interval

To receive auto-messages every 5 seconds:

```typescript
// In src/config/mockConfig.ts
autoSend: {
  interval: 5000,  // 5 seconds
  enabled: true,
}
```

### Start Service Paused

```typescript
// In src/config/mockConfig.ts
behavior: {
  startPaused: true,  // Service starts paused
  enableLogging: true,
}
```

### Disable Logging

```typescript
// In src/config/mockConfig.ts
behavior: {
  startPaused: false,
  enableLogging: false,  // Disable console logs
}
```

## Helper Functions

### Get Random Response Delay

```typescript
import { getRandomResponseDelay } from '@/config/mockConfig';

const delay = getRandomResponseDelay();
// Returns a random value between minDelay and maxDelay
```

## Where It's Used

The configuration is used in:

- `MockResponseService` - Controls response timing, auto-send behavior, and logging
- Response delays when replying to user messages
- Auto-send interval for random messages
- Pause/resume state initialization
