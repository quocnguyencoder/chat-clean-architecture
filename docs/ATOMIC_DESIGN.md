# Atomic Design Structure

## Overview

The chat application follows atomic design principles with components organized into atoms, molecules, and organisms. Each component has its own folder containing `index.tsx` and `styles.ts` for better organization and maintainability.

## Directory Structure

```
src/ui/components/
├── atoms/
│   ├── ActionButton/
│   │   ├── index.tsx             # Reusable action button component
│   │   └── styles.ts             # Action button styles
│   ├── OnlineStatusIndicator/
│   │   ├── index.tsx             # Status indicator component
│   │   └── styles.ts             # Status indicator styles
│   └── index.ts                  # Barrel export for atoms
├── molecules/
│   ├── AvatarWithStatus/
│   │   ├── index.tsx             # Avatar + status combination
│   │   └── styles.ts             # Avatar with status styles
│   ├── NavigationItem/
│   │   ├── index.tsx             # Navigation item with badge
│   │   └── styles.ts             # Navigation item styles
│   └── index.ts                  # Barrel export for molecules
├── organisms/
│   ├── ChatHeader/
│   │   ├── index.tsx             # Chat header organism
│   │   └── styles.ts             # Chat header styles
│   ├── MessageInput/
│   │   ├── index.tsx             # Complete message input
│   │   └── styles.ts             # Message input styles
│   └── index.ts                  # Barrel export for organisms
└── [remaining components - to be migrated]
    ├── ChatContent.tsx           # Main chat orchestrator (template)
    ├── ChatList.tsx             # Chat list (organism)
    ├── EmptyState.tsx           # Empty state (organism)
    ├── MessagesArea.tsx         # Messages container (template)
    └── NavigationSidebar.tsx    # Navigation sidebar (organism)
```

## Components by Atomic Level

### Atoms (Basic Building Blocks)

- **ActionButton**: Configurable button for actions with primary/secondary variants
- **OnlineStatusIndicator**: Status dot with small/medium/large sizes

### Molecules (Simple Component Groups)

- **AvatarWithStatus**: Avatar + OnlineStatusIndicator combination
- **MessageBubble**: Message content + Avatar + styling for different senders
- **NavigationItem**: Icon + Label + Badge with active/inactive states

### Organisms (Complex Component Groups)

- **MessageInput**: Complete input area with ActionButtons and Input field

### Templates/Pages (Layout Components)

- **ChatContent**: Main application orchestrator
- **ChatHeader**: Header with user info and actions
- **ChatList**: Sidebar with search, stories, and chat items
- **EmptyState**: Placeholder when no chat is selected
- **MessagesArea**: Container for messages and input
- **NavigationSidebar**: Left navigation with items and user avatar

## Folder Structure Benefits

### Component Organization

- **Separate Folders**: Each component has its own dedicated folder
- **index.tsx**: Main component logic and interface
- **styles.ts**: Dedicated styles with helper functions
- **Barrel Exports**: Clean imports via index.ts files

### Benefits Achieved

1. **Reusability**: Components can be used across different contexts
2. **Consistency**: Uniform styling and behavior across the app
3. **Maintainability**: Single source of truth for component logic and styles
4. **Testability**: Smaller, focused components are easier to test
5. **Scalability**: Easy to extend and modify individual components
6. **Type Safety**: Full TypeScript support with proper interfaces
7. **Organization**: Clear separation of concerns with dedicated style files
8. **Developer Experience**: Easy to locate and modify component styles

## Usage Examples

```tsx
// Using atomic components
<ActionButton icon={<SendOutlined />} variant="primary" onClick={handleSend} />
<OnlineStatusIndicator isOnline={true} size="medium" />

// Using molecular components
<AvatarWithStatus
  src="/avatar.jpg"
  size={48}
  isOnline={true}
  statusSize="large"
/>

<NavigationItem
  icon={<MessageOutlined />}
  label="Chats"
  isActive={true}
  badge={3}
  badgeType="count"
/>

// Using organism components
<MessageInput
  value={text}
  onChange={setText}
  onSend={handleSend}
  placeholder="Type a message..."
/>
```

## Component Props Interface

### ActionButton

- `icon`: ReactNode - Icon to display
- `onClick?`: Function - Click handler
- `variant?`: 'primary' | 'secondary' - Visual style
- `disabled?`: boolean - Disabled state

### OnlineStatusIndicator

- `isOnline`: boolean - Whether to show status
- `size?`: 'small' | 'medium' | 'large' - Size variant
- `style?`: CSSProperties - Additional styles

### AvatarWithStatus

- `src`: string - Avatar image source
- `size`: number - Avatar size
- `isOnline?`: boolean - Show status indicator
- `statusSize?`: 'small' | 'medium' | 'large' - Status size
- `style?`: CSSProperties - Container styles
- `alt?`: string - Alt text for avatar

### NavigationItem

- `icon`: ReactNode - Icon to display
- `label`: string - Text label
- `isActive?`: boolean - Active state
- `badge?`: number | boolean - Badge content
- `badgeType?`: 'count' | 'dot' - Badge style

### MessageBubble

- `content`: ReactNode - Message content
- `sender`: 'me' | 'other' - Message sender
- `senderName?`: string - Sender's name
- `showAvatar?`: boolean - Whether to show avatar
- `avatarSrc?`: string - Avatar image source

### MessageInput

- `value`: string - Input value
- `onChange`: (text: string) => void - Change handler
- `onSend`: () => void - Send handler
- `placeholder?`: string - Input placeholder

## Next Steps

1. Add unit tests for each atomic component
2. Create Storybook stories for component documentation
3. Add more atomic variants as needed (button sizes, input types, etc.)
4. Consider adding compound components for common patterns
5. Implement theming system for consistent design tokens
