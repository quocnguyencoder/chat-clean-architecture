# Online Users Feature

This feature provides a comprehensive system for tracking and managing user online status in the chat application.

## Architecture

### Domain Layer

- **`UserStatus` Entity** (`src/domain/entities/UserStatus.ts`)
  - Represents a user's online presence
  - Fields:
    - `userId`: string - User identifier
    - `status`: 'online' | 'offline' | 'away' - Current status
    - `lastOnlineTime`: string - ISO 8601 timestamp
  - Methods:
    - `isOnline()`: boolean
    - `isAway()`: boolean
    - `isOffline()`: boolean

### Port Layer

- **`UserStatusRepository` Interface** (`src/ports/UserStatusRepository.ts`)
  - Defines the contract for user status data access
  - Methods:
    - `getAllUserStatuses()`: Get all user statuses
    - `getUserStatus(userId)`: Get specific user status
    - `updateUserStatus(userId, status)`: Update status
    - `updateLastOnlineTime(userId, time)`: Update last online time
    - `getOnlineUsers()`: Get all currently online users

### Infrastructure Layer

- **`LocalStorageUserStatusRepository`** (`src/infrastructure/repositories/LocalStorageUserStatusRepository.ts`)
  - LocalStorage-based implementation
  - Stores data in `chat-user-statuses` key
  - Automatically updates `lastOnlineTime` when user goes offline

### Use Case Layer

- **`GetOnlineUsersUseCase`** (`src/usecases/GetOnlineUsersUseCase.ts`)
  - Business logic for retrieving online users
  - Returns list of `UserStatus` entities

### Mock Data

- **`mockUserStatuses`** (`src/mocks/userStatuses.ts`)
  - Initial user status data
  - Synced with user data from `src/mocks/users.ts`
  - Includes online/offline states with realistic timestamps

## Context Integration

The `ChatContext` now provides:

```typescript
interface ChatContextValue {
  // ... existing fields
  userStatusRepository: UserStatusRepository;
  getOnlineUsersUseCase: GetOnlineUsersUseCase;
  onlineUsers: UserStatus[]; // Live list of online users
}
```

## Usage

### Using the Hook

```typescript
import { useOnlineUsers } from '@/ui/hooks';

function MyComponent() {
  const { onlineUsers, refreshOnlineUsers } = useOnlineUsers();

  return (
    <div>
      <h3>Online Users ({onlineUsers.length})</h3>
      {onlineUsers.map(user => (
        <div key={user.userId}>
          {user.userId} - {user.status}
          <span>Last seen: {user.lastOnlineTime}</span>
        </div>
      ))}
    </div>
  );
}
```

### Using the Context Directly

```typescript
import { useChatContext } from '@/ui/hooks';

function MyComponent() {
  const { onlineUsers, userStatusRepository } = useChatContext();

  const updateStatus = async (userId: string) => {
    await userStatusRepository.updateUserStatus(userId, 'away');
  };

  const getUserStatus = async (userId: string) => {
    const status = await userStatusRepository.getUserStatus(userId);
    return status;
  };

  // ...
}
```

### Accessing User Information

You can combine online status with user information:

```typescript
import { useOnlineUsers } from '@/ui/hooks';
import { getUserById } from '@/mocks/users';

function OnlineUsersList() {
  const { onlineUsers } = useOnlineUsers();

  return (
    <ul>
      {onlineUsers.map(userStatus => {
        const user = getUserById(userStatus.userId);
        return (
          <li key={userStatus.userId}>
            {user?.name} - {userStatus.status}
          </li>
        );
      })}
    </ul>
  );
}
```

## Data Structure

### UserStatus Entity

```typescript
{
  userId: 'user-alex-johnson',
  status: 'online',
  lastOnlineTime: '2025-10-29T10:30:00.000Z'
}
```

### Plain Object Format (for storage)

```typescript
{
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastOnlineTime: string; // ISO 8601
}
```

## Initialization

The user status data is automatically initialized in `App.tsx`:

```typescript
const userStatusRepository = new LocalStorageUserStatusRepository();
void initializeUserStatusData(userStatusRepository);
```

This populates the repository with mock data on first load.

## Features

✅ **Real-time tracking** - Online users list in context
✅ **Clean Architecture** - Proper separation of concerns
✅ **Type-safe** - Full TypeScript support
✅ **Flexible storage** - Repository pattern allows different implementations
✅ **ISO timestamps** - Consistent time format across the app
✅ **Status types** - Support for online, offline, and away states
✅ **Easy integration** - Simple hooks for components

## Example Component

See `src/examples/OnlineUsersExample.tsx` for a complete usage example.
