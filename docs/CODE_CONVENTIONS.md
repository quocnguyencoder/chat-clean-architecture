````markdown
# Code Conventions — Chat App (Vite + React + Ant Design)

Purpose: ensure consistent, readable, testable code that aligns with Clean Architecture and is reviewable by both humans and AI.

1. Project folder structure (recommended)

- src/
  - domain/ # Entities and pure domain logic
  - usecases/ # Application services (interactors)
  - ports/ # Interfaces (repositories, transports) used by usecases
  - infrastructure/ # Concrete implementations (LocalStorage, transports, workers)
  - ui/
    - components/ # Presentational (dumb) components
    - containers/ # Connected components that coordinate components + hooks
    - pages/ # Route-level pages
    - hooks/ # Reusable custom hooks
    - styles/ # Theme, Ant Design token overrides, CSS/LESS
  - workers/ # Web worker / transport worker code
  - services/ # Independent services / facades
  - utils/ # Utility functions (pure)
  - types/ # Shared TypeScript types
  - tests/ # Shared test helpers, fixtures, factories
  - main.tsx
  - router.tsx
  - index.css

2. Architectural rules

- Follow Clean Architecture separation: domain <- usecases <- adapters (infrastructure, UI).
- Domain logic must be pure and side-effect free. All I/O (localStorage, network, postMessage) goes through ports/infrastructure adapters.
- Use Dependency Injection: pass repositories/transports into usecases or via context providers.
- Keep UI layer thin: no domain logic in components.

3. Components & React rules

- Use functional components with hooks. No class components.
- Prefer named exports. Default export only for barrels (index.ts).
- Keep props minimal and descriptive. If many props, group them into a single object prop.
- Side effects belong in hooks (useEffect or custom hooks).
- Clean up subscriptions/listeners in useEffect cleanup functions.
- Use React.memo for pure presentational components where helpful.
- Use useCallback/useMemo responsibly to avoid unnecessary recomputation.

4. Naming conventions

- Components & pages: PascalCase (ChatWindow.tsx).
- Hooks: useCamelCase (useChatMessages.ts).
- Folders: kebab-case or lowerCamelCase (choose one and be consistent).
- Types and interfaces: PascalCase (Message, MessageRepository). Don't use Hungarian prefixes (no IMessage).
- Files: component file names match component name (ChatMessage.tsx).
- Constants: SCREAMING_SNAKE_CASE for individual constants, PascalCase for constant objects.

5. Constants & configuration

- Group related constants in dedicated files using Object.freeze for immutability:

  ```typescript
  // src/constants/chatConstants.ts
  export const CHAT_CONSTANTS = Object.freeze({
    MAX_MESSAGE_LENGTH: 1000,
    VIRTUALIZATION_THRESHOLD: 200,
    AUTO_SCROLL_DEBOUNCE: 300,
    MESSAGE_BATCH_SIZE: 50,
  } as const);

  // src/constants/messageTypes.ts
  export const MESSAGE_TYPES = Object.freeze({
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM: 'system',
  } as const);
  ```
````

- Use `as const` with Object.freeze for strict type inference.
- Constants should be grouped by domain/feature and placed in src/constants/.
- Import constants using destructuring: `const { MAX_MESSAGE_LENGTH } = CHAT_CONSTANTS;`
- Avoid magic numbers/strings in code; extract them to constants files.

6. State & storage

- Use local component state for UI-specific state; use context or a small store (e.g., Zustand) for shared state when needed.
- Wrap localStorage access in a repository (e.g., LocalMessageRepository) to allow mocking and swapping.
- For large message sets (>= 200), use virtualization (react-window or equivalent) and batch writes/reads to localStorage.

6. Performance & scalability

- Virtualize long lists (messages > 200).
- Avoid re-rendering the entire list; memoize message items and use stable keys (message.id).
- When saving many messages, write in batches and avoid synchronous blocking operations on the main thread — consider a worker for heavy serialization.

7. Message arrival & transport

- Support two arrival channels:
  - window.postMessage events (external page or iframe)
  - Transport worker (web worker) messages
- Centralize message handling in a service/hook that emits events to UI and persists via repository.
- Ensure listeners are registered once and properly cleaned up.

8. Scroll behavior

- Support scrolling to a message by ID (read from URL param).
- Behavior when id is missing/invalid: show normal view and optionally show toast or no-op.
- Ensure virtualization supports scroll-to-index / scrollIntoView for the message.

9. Accessibility

- Provide aria-label and accessible names for interactive elements (chat input, send button, message list).
- Ensure keyboard navigation focus order is logical.
- Test for screen-reader friendliness where possible.

10. Security

- Treat all incoming messages as untrusted. Don’t dangerously set innerHTML to external content.
- Escape/sanitize any rich content before rendering.

11. Testing

- Unit tests: React Testing Library + Vitest/Jest. Test hooks, usecases, and presentational behavior.
- Integration/E2E: Playwright for flows (send message, receive via postMessage/worker, load 1000 messages, scroll-to-id).
- Mock infrastructure adapters (LocalMessageRepository, Worker) for unit tests.

12. Linting & formatting

- Use ESLint with TypeScript and Prettier integration.
- Add Husky + lint-staged to run tests/linters on pre-commit.
- Do not commit code that fails linting or tests.
- **MANDATORY**: All code must automatically fix ESLint and Prettier errors before completion.
- **MANDATORY**: All code, comments, and documentation must be written in English only, regardless of prompt language.

13. Development workflow with AI assistance

- **MANDATORY**: AI should only create file templates with detailed comments unless explicitly asked to implement code.
- Create skeleton files with comprehensive TODO comments and implementation guidance.
- Only implement actual code when user specifically requests it.
- Focus on scaffolding, structure, and documentation over implementation.

14. Commit messages

- Use Conventional Commits: type(scope): subject
  - Examples:
    - feat(chat): add message virtualization
    - fix(worker): unregister event listener on unmount
    - test(chat): add unit tests for scroll-to-id

14. Code review expectations

- Small, focused PRs.
- Include a short PR description with reasoning and acceptance criteria.
- Add test coverage for new features and edge cases.

15. Documentation

- Add README for non-trivial modules (workers, transport).
- Document public hook/usecase APIs and invariants.

16. Edge cases to consider

- Empty message text (trim and validate).
- Duplicate ids.
- Extremely long messages (wrap/ellipsize).
- Offline persistence and recovery.

17. Example third-party libs to consider

- UI: antd
- Virtualization: react-window or @tanstack/react-virtual
- Worker helpers: comlink (optional)
- Small state: Zustand (optional)

```

```
