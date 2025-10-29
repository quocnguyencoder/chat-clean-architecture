# UUID Migration Guide

This document describes the migration from string-based IDs to UUID v4 for users, chats, and messages.

## Overview

All user IDs, chat IDs, and message IDs now use UUID v4 format for better uniqueness and scalability.

## Changes

### User IDs

**Before:**

```typescript
{
  id: 'current-user',
  name: 'Me',
}

{
  id: 'user-alex-johnson',
  name: 'Alex Johnson',
}
```

**After:**

```typescript
{
  id: '550e8400-e29b-41d4-a716-446655440000', // CURRENT_USER
  name: 'Me',
}

{
  id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Alex Johnson
  name: 'Alex Johnson',
}
```

### User ID Mapping

| User Name         | Old ID               | New UUID                               |
| ----------------- | -------------------- | -------------------------------------- |
| Me (Current User) | `current-user`       | `550e8400-e29b-41d4-a716-446655440000` |
| Alex Johnson      | `user-alex-johnson`  | `6ba7b810-9dad-11d1-80b4-00c04fd430c8` |
| Lisa Chen         | `user-lisa-chen`     | `6ba7b811-9dad-11d1-80b4-00c04fd430c8` |
| David Kim         | `user-david-kim`     | `6ba7b812-9dad-11d1-80b4-00c04fd430c8` |
| Sarah Parker      | `user-sarah-parker`  | `6ba7b813-9dad-11d1-80b4-00c04fd430c8` |
| Michael Brown     | `user-michael-brown` | `6ba7b814-9dad-11d1-80b4-00c04fd430c8` |
| Emma Wilson       | `user-emma-wilson`   | `6ba7b815-9dad-11d1-80b4-00c04fd430c8` |

### Group/Chat IDs

**Before:**

```typescript
{
  id: '4',
  name: 'Project Team Alpha',
}
```

**After:**

```typescript
{
  id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  name: 'Project Team Alpha',
}
```

### Group ID Mapping

| Group Name          | Old ID | New UUID                               |
| ------------------- | ------ | -------------------------------------- |
| Project Team Alpha  | `4`    | `a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d` |
| Marketing Team 2024 | `5`    | `b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e` |
| Sports Club Members | `6`    | `c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f` |
| Design Studio       | `7`    | `d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a` |

### Message IDs

**Before:**

```typescript
messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// Example: "msg-1698765432100-k3j2h1"
```

**After:**

```typescript
messageId: generateMessageId();
// Example: "a3f5b2c1-8d4e-4f7a-9b2c-1e3f4a5b6c7d"
```

## New UUID Utilities

Located in `src/utils/uuid.ts`:

```typescript
import {
  generateUUID,
  generateUserId,
  generateChatId,
  generateMessageId,
  isValidUUID,
} from '@/utils/uuid';

// Generate a generic UUID
const uuid = generateUUID();

// Generate specific IDs
const userId = generateUserId();
const chatId = generateChatId();
const messageId = generateMessageId();

// Validate UUID
const isValid = isValidUUID('550e8400-e29b-41d4-a716-446655440000'); // true
```

## Updated Files

### Mock Data

- `src/mocks/users.ts` - Updated all user IDs to UUIDs
- `src/mocks/groups.ts` - Updated all group IDs to UUIDs
- `src/mocks/userStatuses.ts` - Updated all user IDs to match new UUIDs
- `src/mocks/chats.ts` - Automatically uses user IDs as chat IDs (already UUIDs)
- `src/mocks/participants.ts` - Automatically uses user IDs (already UUIDs)
- `src/mocks/messages.ts` - Automatically uses chat IDs (already UUIDs)

### Use Cases

- `src/usecases/SendMessageUseCase.ts` - Uses `generateMessageId()` from uuid utils
- Removed old `generateMessageId()` method that used timestamp

### Services

- `src/infrastructure/services/MockResponseService.ts` - Uses `generateMessageId()` for auto-responses

### Utilities

- `src/utils/uuid.ts` - New file with UUID generation and validation utilities

## Benefits

✅ **Better Uniqueness** - UUID v4 provides 128-bit random identifiers
✅ **Scalability** - No collision concerns across distributed systems
✅ **Standard Format** - Industry-standard UUID format
✅ **Type Safety** - String type with validation utilities
✅ **Future Proof** - Easy to integrate with backend systems using UUIDs

## Breaking Changes

⚠️ **LocalStorage Data** - Existing LocalStorage data with old IDs will not work
⚠️ **Hard-coded IDs** - Any hard-coded user/chat IDs in tests need updating

## Migration Steps for Existing Data

If you have existing LocalStorage data:

1. Clear LocalStorage:

   ```javascript
   localStorage.clear();
   ```

2. Refresh the application - new UUID-based data will be initialized

## Backward Compatibility

None. This is a breaking change. All IDs must use the new UUID format.

## Testing

All UUID utilities include validation:

```typescript
import { isValidUUID } from '@/utils/uuid';

// Valid UUID v4
isValidUUID('550e8400-e29b-41d4-a716-446655440000'); // true

// Invalid UUIDs
isValidUUID('invalid-id'); // false
isValidUUID('123'); // false
```

## Notes

- Chat IDs for 1-on-1 conversations use the user ID of the other participant
- Group chat IDs use dedicated group UUIDs
- Message IDs are generated fresh for each message using UUID v4
- All UUIDs follow RFC 4122 version 4 format
