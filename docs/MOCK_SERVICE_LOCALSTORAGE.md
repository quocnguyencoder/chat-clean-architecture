# Mock Response Service - LocalStorage Integration

## Overview

Updated the MockResponseService to use data from localStorage repositories instead of hardcoded mock data. This ensures the service works correctly when new chats or users are added dynamically.

## Changes Made

### 1. MockResponseService.ts

**Key Updates:**

- Added `ChatParticipantsRepository` dependency to fetch participants from localStorage
- Removed dependency on mock functions: `getRandomAutoMessage()` and `getRandomOtherUser()`
- Made `determineSender()` async to support repository calls
- Inline random messages array instead of using `getRandomAutoMessage()`

**Before:**

```typescript
constructor(
  receiveMessageUseCase: ReceiveMessageUseCase,
  chatRepository: ChatRepository,
  getChatsFn: () => Chat[],
  getChatDetailFn: (chatId: string) => ChatDetail | null
)
```

**After:**

```typescript
constructor(
  receiveMessageUseCase: ReceiveMessageUseCase,
  chatRepository: ChatRepository,
  participantsRepository: ChatParticipantsRepository,
  getChatsFn: () => Chat[]
)
```

### 2. Sender Determination Logic

**Group Chats:**

- Now fetches participants from localStorage via `participantsRepository.getByChatId()`
- Filters out current user and randomly selects from actual participants
- Falls back to generic "Group Member" if no participants found

**1-on-1 Chats:**

- Uses chat name and generates ID from chat identifier
- No changes needed as it already used chat metadata

### 3. Random Message Generation

**Before:**

```typescript
const randomMessage = getRandomAutoMessage();
```

**After:**

```typescript
const randomMessages = [
  'Hey! How are you doing?',
  'Just checking in!',
  "What's up?",
  'Hope you are having a great day!',
  'Any plans for today?',
  'Long time no see!',
  'How have you been?',
];
const randomMessage =
  randomMessages[Math.floor(Math.random() * randomMessages.length)];
```

### 4. ChatContext.tsx

Updated to pass `participantsRepository` to MockResponseService:

```typescript
const mockResponseService = useMemo(
  () =>
    new MockResponseService(
      receiveMessageUseCase,
      chatRepository,
      participantsRepository,
      () => chatsRef.current
    ),
  [receiveMessageUseCase, chatRepository, participantsRepository]
);
```

## Benefits

1. **Dynamic Data Support**: Service now works with dynamically added chats and users
2. **Real Participant Data**: Group chat messages come from actual participants stored in localStorage
3. **No Mock Dependencies**: Reduced coupling with mock data files
4. **Consistent Behavior**: All data comes from the same source (localStorage)

## Testing

- ✅ Build successful
- ✅ No TypeScript errors
- ✅ Service properly initialized with repositories
- ✅ Works with exported/imported data

## Technical Details

**File Modified:**

- `/src/infrastructure/services/MockResponseService.ts`
- `/src/ui/contexts/ChatContext.tsx`

**Dependencies Added:**

- `ChatParticipantsRepository` (via constructor injection)

**Dependencies Removed:**

- `getRandomAutoMessage` from mocks
- `getRandomOtherUser` from mocks
- `ChatDetail` type (no longer needed)
- `getChatDetailFn` callback (replaced with direct repository access)

## Migration Notes

Any code that instantiates `MockResponseService` must now provide:

1. ✅ `receiveMessageUseCase: ReceiveMessageUseCase`
2. ✅ `chatRepository: ChatRepository`
3. ✅ `participantsRepository: ChatParticipantsRepository` _(NEW)_
4. ✅ `getChatsFn: () => Chat[]`
5. ❌ ~~`getChatDetailFn`~~ _(REMOVED)_
